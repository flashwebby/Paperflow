"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">⚡</div>
        <h1 className="font-display font-semibold text-2xl text-ink-300 mb-3">
          Something went wrong
        </h1>
        <p className="text-ink-500 mb-8 text-sm max-w-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <button onClick={reset} className="btn-amber">
          Try again
        </button>
      </div>
    </div>
  );
}
