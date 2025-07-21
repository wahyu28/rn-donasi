// services/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Will retry failed queries 2 times before displaying an error
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});
