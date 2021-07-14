import React from "react";
import { useRouter } from "next/router";
import Error from "src/components/Error";

export default function ErrorPage({ error }) {
  const router = useRouter();

  const onReset = () => router.push("/");

  return <Error error={error} resetErrorBoundary={onReset} />;
}

ErrorPage.getInitialProps = ({ err }) => ({ error: err });
