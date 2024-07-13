import Converter from "./features/currency-converter/Converter";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Converter />
      </>
    </QueryClientProvider>
  );
}

export default App;
