"use client";

import Link from "next/link";
import { useState } from "react";
import type { Paper } from "@/types";
import { cn, formatDate, formatAuthors, categoryColor, truncateText } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface PaperCardProps {
  paper: Paper;
  index?: number;
  variant?: "card" | "list";
}

export function PaperCard({ paper, index = 0, variant = "card" }: PaperCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const bookmarked = isBookmarked(paper.arxivId);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(paper.arxivId);
    } else {
      addBookmark(paper);
    }
  };

  const abstract = expanded
    ? paper.abstract
    : truncateText(paper.abstract, 240);

  const colorClass = categoryColor(paper.primaryCategory.term);

  if (variant === "list") {
    return (
      <article
        className="paper-card group flex gap-4 p-4 rounded-xl border border-ink-800 bg-ink-900/50 hover:border-ink-700 hover:bg-ink-900 transition-all animate-in"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/paper/${paper.arxivId}`} className="group/title">
              <h3 className="font-display font-semibold text-ink-100 group-hover/title:text-amber-300 transition-colors leading-snug line-clamp-2 text-base">
                {paper.title}
              </h3>
            </Link>
            <button
              onClick={toggleBookmark}
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                bookmarked
                  ? "text-amber-400 bg-amber-400/10"
                  : "text-ink-500 hover:text-ink-300 hover:bg-ink-800"
              )}
            >
              <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-ink-400 mt-1">{formatAuthors(paper.authors)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn("badge", colorClass)}>{paper.primaryCategory.term}</span>
            <span className="text-xs text-ink-500">{formatDate(paper.published)}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="paper-card group flex flex-col p-5 rounded-2xl border border-ink-800 bg-ink-900/50 hover:border-ink-700 hover:bg-ink-900 transition-all animate-in relative overflow-hidden"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Subtle top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <span className={cn("badge", colorClass)}>
            {paper.primaryCategory.term}
          </span>
          {paper.categories.slice(1, 3).map((cat) => (
            <span key={cat.term} className="badge text-ink-400 bg-ink-800 border-ink-700">
              {cat.term}
            </span>
          ))}
        </div>
        <button
          onClick={toggleBookmark}
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
            bookmarked
              ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
              : "text-ink-600 hover:text-ink-300 hover:bg-ink-800 border border-transparent"
          )}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark paper"}
        >
          <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Title */}
      <Link href={`/paper/${paper.arxivId}`} className="group/title mb-2 block">
        <h3 className="font-display font-semibold text-ink-100 group-hover/title:text-amber-300 transition-colors leading-snug text-balance text-[15px] sm:text-base">
          {paper.title}
        </h3>
      </Link>

      {/* Authors */}
      <p className="text-xs text-ink-400 mb-3 font-mono leading-relaxed">
        {formatAuthors(paper.authors, 4)}
      </p>

      {/* Abstract */}
      <div className="flex-1">
        <p className="text-sm text-ink-300 leading-relaxed">
          {abstract}
          {paper.abstract.length > 240 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-amber-500 hover:text-amber-400 transition-colors font-medium text-xs"
            >
              {expanded ? " show less" : " read more"}
            </button>
          )}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-ink-800">
        <span className="text-xs text-ink-500">{formatDate(paper.published, true)}</span>

        <div className="flex items-center gap-1.5">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-2.5 py-1 rounded-md border border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200 transition-colors flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </a>
          <Link
            href={`/paper/${paper.arxivId}`}
            className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            View →
          </Link>
        </div>
      </div>
    </article>
  );
}
