import React from "react";

interface Props {
  error?: { message: string };
  resetErrorBoundary: () => void;
}

export default function Error({ error, resetErrorBoundary }: Props) {
  return (
    <div className="h-screen u-center">
      <p className="text-xl text-red-600">Error!</p>
      {error && <pre>{error.message}</pre>}
      <button onClick={resetErrorBoundary} type="button">
        Try again
      </button>
    </div>
  );
}
