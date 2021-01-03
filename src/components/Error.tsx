import React from "react";

interface Props {
  error?: any;
  resetErrorBoundary: () => void;
}

export default function Error({ error, resetErrorBoundary }: Props) {
  return (
    <div className="absolute-center">
      <p className="text-xl text-red-600">Error!</p>
      {error && <pre>{error.message}</pre>}
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
