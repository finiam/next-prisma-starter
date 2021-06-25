import React, { useMemo } from "react";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";
import Error from "src/components/Error";
import "tailwindcss/tailwind.css";
import "src/styles/defaults.css";

function InnerApp({ Component, pageProps }) {
  const onError = useErrorHandler();
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: { mutations: { onError }, queries: { onError } },
      }),
    [onError]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default function App(props) {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <InnerApp {...props} />
    </ErrorBoundary>
  );
}
