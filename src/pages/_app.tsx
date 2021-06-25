import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import Error from "src/components/Error";
import "tailwindcss/tailwind.css";
import "src/styles/defaults.css";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
