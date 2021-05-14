/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

type NetworkResourceReturnType<A extends (...args: any) => any> = [
  A,
  { loading: boolean; data: ReturnType<A>; error: any }
];

type NetworkResourceOptions<A extends (...args: any) => any> = {
  onError?: (error: any) => any;
  onSuccess?: (data: ReturnType<A>) => any;
};

export default function useNetworkResource<A extends (...args: any) => any>(
  fn: A,
  options: NetworkResourceOptions<ReturnType<A>> = {}
): NetworkResourceReturnType<A> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReturnType<A>>();
  const [error, setError] = useState();

  const executor: unknown = async (...args: unknown[]) => {
    let result: ReturnType<A>;

    setLoading(true);

    try {
      result = await fn(...args);

      setData(result);

      if (options.onSuccess) options.onSuccess(result);
    } catch (newError) {
      setError(newError);

      if (options.onError) options.onError(newError);
    } finally {
      setLoading(false);
    }

    return result;
  };

  return [executor as A, { loading, data, error }];
}
