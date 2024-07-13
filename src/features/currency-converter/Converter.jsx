import axios from "axios";
import "./Converter.css";
import { useState } from "react";
import { useQuery } from "react-query";
import { useEffect } from "react";

const apiKey = import.meta.env.VITE_APP_API_KEY;

const getCurrencies = (code, date) => {
  if (date) {
    const dateArray = date.split("-");
    const year = dateArray[0];
    const month = dateArray[1].replace(/^0+/, "");
    const day = dateArray[2].replace(/^0+/, "");
    if (code) {
      return axios.get(
        `https://v6.exchangerate-api.com/v6/${apiKey}/history/${code}/${year}/${month}/${day}`
      );
    }
    return axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/history/USD/${year}/${month}/${day}`
    );
  }
  if (code) {
    return axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${code}`
    );
  }
  return axios.get(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
};

const Converter = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month =
    String(today.getMonth()).length == 1
      ? `0${today.getMonth() + 1}`
      : today?.getMonth() + 1;
  const day =
    String(today.getDate()).length == 1
      ? `0${today.getDate()}`
      : today?.getDate();
  const formatedToday = `${year}-${month}-${day}`;

  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("INR");
  const [sourceValue, setSourceValue] = useState(1);
  const [targetValue, setTargetValue] = useState();
  const [rate, setRate] = useState();
  const [date, setDate] = useState();

  const [conversionRates, setConversionRates] = useState([]);

  const { data, isSuccess } = useQuery(
    ["get-codes", sourceCurrency, date],
    () => getCurrencies(sourceCurrency, date)
  );

  useEffect(() => {
    if (isSuccess && data?.data?.conversion_rates) {
      const codes = Object.keys(data?.data?.conversion_rates);
      const options = codes.map((code) => ({
        label: code,
        value: data.data.conversion_rates[code],
      }));
      setConversionRates(options);
      const defaulValue = options.find(
        (option) => option?.label == targetCurrency
      );
      setTargetValue(sourceValue * defaulValue?.value);
      setRate(defaulValue?.value);
    }
  }, [isSuccess, data]);

  const handleSourceValueChange = (e) => {
    setSourceValue(e.target.value);
    setTargetValue(e.target.value * rate);
  };

  const handleTargetValueChange = (e) => {
    setTargetValue(e.target.value);
    setSourceValue(e.target.value / rate);
  };

  const handleTargetCurrencyChange = (e) => {
    const rate = conversionRates?.find((rate) => rate.label == e.target.value);
    setRate(rate.value);
    setTargetCurrency(rate.label);
    setSourceValue(targetValue / rate.value);
  };

  return (
    <div className="input-container">
      <h1>
        {sourceCurrency} to {targetCurrency}
      </h1>
      <div className="input-select">
        <input
          value={sourceValue}
          onChange={handleSourceValueChange}
          className="number"
          type="number"
        />
        <div className="select-container">
          <div className="separator"></div>
          <select
            onChange={(e) => setSourceCurrency(e.target.value)}
            className="currency-select"
            name="currency"
            id="currency1"
          >
            {conversionRates?.map((option, i) => {
              return (
                <option key={i} value={option?.label}>
                  {option?.label}
                </option>
              );
            })}
          </select>
          <span className="currency-name">{sourceCurrency}</span>
        </div>
      </div>
      <div className="input-select">
        <input
          value={targetValue}
          onChange={handleTargetValueChange}
          className="number"
          type="number"
        />
        <div className="select-container">
          <div className="separator"></div>
          <select
            onChange={handleTargetCurrencyChange}
            className="currency-select"
            name="currency"
            id="currency2"
          >
            {conversionRates?.map((option, i) => {
              return (
                <option key={i} value={option?.label}>
                  {option?.label}
                </option>
              );
            })}
          </select>
          <span className="currency-name">{targetCurrency}</span>
        </div>
      </div>
      <div className="input-select">
        <input
          type="date"
          className="date"
          min={"2021-01-01"}
          max={formatedToday}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Converter;
