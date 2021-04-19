import { useState } from "react";

type useRpcReturnType<A, B> = [A, { loading: boolean; data: B; error: any }];

type useRpcOptions<B> = {
  onError?: (error: any) => any;
  onSuccess?: (data: B) => any;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export default function useRpc<A extends Function, B>(
  rpcFn: A,
  options: useRpcOptions<B> = {}
): useRpcReturnType<A, B> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<B>();
  const [error, setError] = useState();

  const executor: unknown = async (...args: unknown[]) => {
    let result: B;

    setLoading(true);

    try {
      result = await rpcFn(...args);

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
