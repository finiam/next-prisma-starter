import { useRouter } from "next/router";
import Error from "root/components/Error";

export default function ErrorPage({ error }) {
  const router = useRouter();

  const onReset = () => router.push("/");

  return <Error error={error} resetErrorBoundary={onReset} />;
}

ErrorPage.getInitialProps = ({ err }) => {
  return { error: err };
};
