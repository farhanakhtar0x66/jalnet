import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./src/Home";
import { Text, View } from "react-native";
import { configurationError } from "./src/api";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 20_000, retry: 1 } },
});

export default function App() {
  if (configurationError)
    return (
      <View style={{ padding: 32, paddingTop: 64 }}>
        <Text accessibilityRole="header">JalNet configuration blocked</Text>
        <Text accessibilityRole="alert">{configurationError}</Text>
      </View>
    );
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
