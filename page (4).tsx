"use client";

import { useAppStore } from "@/lib/store";
import { PaperCard } from "@/components/paper/PaperCard";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function BookmarksPage() {
  const { bookmarks, clearHistory, history } = useAppStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl text-ink-100 mb-2">
          Your Library
        </h1>
        <p className="text-ink-500">
          Saved papers and reading history
        </p>
      </div>

      {/* Bookmarks */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-ink-200">
            Bookmarks
            <span className="ml-2 text-sm font-sans font-normal text-ink-500">
              {bookmarks.length} saved
            </span>
          </h2>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-ink-800 rounded-2xl">
            <div className="text-5xl mb-4">🔖</div>
            <h3 className="font-display text-xl text-ink-400 mb-2">No bookmarks yet</h3>
            <p className="text-ink-600 text-sm mb-6">
              Save papers from the search results or paper pages
            </p>
            <Link href="/search" className="btn-amber inline-block">
              Discover Papers
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map(({ paper, savedAt }, i) => (
              <div key={paper.arxivId} className="relative">
                <div className="absolute -top-2 -right-2 z-10 text-xs font-mono text-ink-600 bg-ink-900 border border-ink-800 px-2 py-0.5 rounded-full">
                  Saved {formatDate(savedAt, true)}
                </div>
                <PaperCard paper={paper} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-ink-200">
            Recently Viewed
            <span className="ml-2 text-sm font-sans font-normal text-ink-500">
              {history.length} papers
            </span>
          </h2>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs text-ink-600 hover:text-ink-400 transition-colors"
            >
              Clear history
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-ink-800 rounded-2xl">
            <div className="text-4xl mb-3">🕒</div>
            <p className="text-ink-600 text-sm">No reading history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 20).map(({ paper, viewedAt }) => (
              <Link
                key={`${paper.arxivId}-${viewedAt}`}
                href={`/paper/${paper.arxivId}`}
                className="flex items-center gap-4 p-3 rounded-xl border border-ink-800 hover:border-ink-700 hover:bg-ink-900 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-200 group-hover:text-amber-300 transition-colors truncate">
                    {paper.title}
                  </p>
                  <p className="text-xs text-ink-600 mt-0.5">
                    {paper.authors[0]?.name} · {paper.primaryCategory.term}
                  </p>
                </div>
                <span className="text-xs text-ink-600 flex-shrink-0">
                  {formatDate(viewedAt, true)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
