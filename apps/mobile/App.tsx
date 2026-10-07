import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./src/Home";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 20_000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
