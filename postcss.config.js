"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import type { Paper } from "@/types";
import { cn } from "@/lib/utils";

interface PaperActionsProps {
  paper: Paper;
}

export function PaperActions({ paper }: PaperActionsProps) {
  const { addBookmark, removeBookmark, isBookmarked, addToHistory } = useAppStore();
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  const bookmarked = isBookmarked(paper.arxivId);

  // Track history on mount
  useState(() => {
    addToHistory(paper);
  });

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(paper.arxivId);
    } else {
      addBookmark(paper);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://arxiv.org/abs/${paper.arxivId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyBib = () => {
    const authors = paper.authors.map((a) => a.name).join(" and ");
    const year = new Date(paper.published).getFullYear();
    const key = `${paper.authors[0]?.name.split(" ").pop() ?? "paper"}${year}`;
    const bib = `@article{${key},\n  title={${paper.title}},\n  author={${authors}},\n  journal={arXiv preprint arXiv:${paper.arxivId}},\n  year={${year}}\n}`;
    navigator.clipboard.writeText(bib);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={toggleBookmark}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
            bookmarked
              ? "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/20"
              : "border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200 bg-ink-900"
          )}
        >
          <svg
            className="w-4 h-4"
            fill={bookmarked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        <button
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200 bg-ink-900 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Add Note
        </button>

        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200 bg-ink-900 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? "Copied!" : "Copy Link"}
        </button>

        <button
          onClick={copyBib}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200 bg-ink-900 text-sm font-medium transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          BibTeX
        </button>
      </div>

      {/* Notes area */}
      {showNotes && (
        <div className="p-4 rounded-xl bg-ink-900 border border-ink-800 animate-in">
          <label className="block text-xs font-mono uppercase tracking-widest text-ink-500 mb-2">
            Personal Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your thoughts, key takeaways, or questions about this paper…"
            rows={4}
            className="w-full bg-ink-800 border border-ink-700 rounded-lg px-3 py-2.5 text-sm text-ink-200 placeholder-ink-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/40 resize-none transition-colors"
          />
          <div className="flex justify-end mt-2">
            <button className="btn-amber text-sm">Save Note</button>
          </div>
        </div>
      )}
    </div>
  );
}
