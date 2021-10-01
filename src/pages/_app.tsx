import React, { useRef } from "react";
import { ErrorBoundary, useErrorHandler } from "react-error-boundary";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import Error from "src/components/Error";
import "tailwindcss/tailwind.css";
import "src/styles/defaults.css";

function InnerApp({ Component, pageProps }) {
  const onError = useErrorHandler();
  const clientRef = useRef(
    new GraphQLClient({
      url: "/api/graphql",
      onError,
    })
  );

  return (
    <ClientContext.Provider value={clientRef.current}>
      <Component {...pageProps} />
    </ClientContext.Provider>
  );
}

export default function App(props) {
  return (
    <ErrorBoundary FallbackComponent={Error}>
      <InnerApp {...props} />
    </ErrorBoundary>
  );
}
