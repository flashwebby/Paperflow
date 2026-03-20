import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display font-bold text-9xl text-ink-800 mb-4 select-none">
          404
        </div>
        <h1 className="font-display font-semibold text-2xl text-ink-300 mb-3">
          Paper not found
        </h1>
        <p className="text-ink-500 mb-8 max-w-sm">
          This page doesn't exist or the paper may have been removed from arXiv.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-amber">
            Go Home
          </Link>
          <Link href="/search" className="btn-ghost">
            Search Papers
          </Link>
        </div>
      </div>
    </div>
  );
}
