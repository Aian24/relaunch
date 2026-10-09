"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
      <h2 className="font-heading font-black text-3xl text-[#090D16] mb-4">
        Something went wrong
      </h2>
      <p className="text-sm text-slate-600 mb-6 max-w-md">
        An unexpected error occurred. Please try reloading the page.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-[#FF6700] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
