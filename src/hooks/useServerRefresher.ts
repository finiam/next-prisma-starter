import { useRouter } from "next/router";

export default function useServerRefresher(): () => void {
  const router = useRouter();

  return () => router.replace(router.asPath);
}
