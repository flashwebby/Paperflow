import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { fetchPaperById } from "@/lib/arxiv";
import { formatDate, formatAuthors, categoryColor, cn } from "@/lib/utils";
import { PaperActions } from "@/components/paper/PaperActions";
import { RelatedPapers } from "@/components/paper/RelatedPapers";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paper = await fetchPaperById(params.id);
  if (!paper) return { title: "Paper not found — PaperFlow" };
  return {
    title: `${paper.title} — PaperFlow`,
    description: paper.abstract.slice(0, 160),
  };
}

export default async function PaperPage({ params }: Props) {
  const paper = await fetchPaperById(params.id);
  if (!paper) notFound();

  const colorClass = categoryColor(paper.primaryCategory.term);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-300 transition-colors mb-8 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to search
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* Main content */}
        <div>
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={cn("badge", colorClass)}>
              {paper.primaryCategory.term}
            </span>
            {paper.categories.slice(1, 5).map((cat) => (
              <span key={cat.term} className="badge text-ink-400 bg-ink-800 border-ink-700">
                {cat.term}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-50 leading-snug mb-5 text-balance">
            {paper.title}
          </h1>

          {/* Authors */}
          <div className="flex flex-wrap gap-2 mb-6">
            {paper.authors.map((author) => (
              <Link
                key={author.name}
                href={`/search?q=${encodeURIComponent(`au:${author.name}`)}`}
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium bg-amber-400/5 hover:bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/10 hover:border-amber-400/20"
              >
                {author.name}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-ink-700 to-transparent mb-6" />

          {/* Abstract */}
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">
              Abstract
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-ink-300 leading-relaxed text-base">
                {paper.abstract}
              </p>
            </div>
          </section>

          {/* Comments / journal ref */}
          {(paper.comment || paper.journalRef) && (
            <div className="mt-6 p-4 rounded-xl bg-ink-900 border border-ink-800 space-y-2">
              {paper.journalRef && (
                <p className="text-sm text-ink-400">
                  <span className="text-ink-500 font-mono text-xs mr-2">Journal</span>
                  {paper.journalRef}
                </p>
              )}
              {paper.comment && (
                <p className="text-sm text-ink-400">
                  <span className="text-ink-500 font-mono text-xs mr-2">Note</span>
                  {paper.comment}
                </p>
              )}
            </div>
          )}

          {/* Actions (client component for bookmarking) */}
          <PaperActions paper={paper} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Metadata card */}
          <div className="p-4 rounded-xl bg-ink-900 border border-ink-800 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-ink-500">
              Metadata
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-ink-500 text-xs mb-0.5">arXiv ID</p>
                <p className="font-mono text-amber-400">{paper.arxivId}</p>
              </div>
              <div>
                <p className="text-ink-500 text-xs mb-0.5">Submitted</p>
                <p className="text-ink-300">{formatDate(paper.published)}</p>
              </div>
              <div>
                <p className="text-ink-500 text-xs mb-0.5">Last Updated</p>
                <p className="text-ink-300">{formatDate(paper.updated)}</p>
              </div>
              {paper.doi && (
                <div>
                  <p className="text-ink-500 text-xs mb-0.5">DOI</p>
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 transition-colors text-xs break-all"
                  >
                    {paper.doi}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Links card */}
          <div className="p-4 rounded-xl bg-ink-900 border border-ink-800 space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">
              Links
            </h3>
            <a
              href={paper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Download PDF
            </a>
            <a
              href={paper.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 w-full p-2.5 rounded-lg border border-ink-700 text-ink-400 hover:border-ink-500 hover:text-ink-200 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on arXiv
            </a>
          </div>

          {/* Categories card */}
          <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
            <h3 className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">
              Categories
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {paper.categories.map((cat) => (
                <Link
                  key={cat.term}
                  href={`/search?category=${cat.term}`}
                  className="badge text-ink-400 bg-ink-800 border-ink-700 hover:border-ink-500 hover:text-ink-200 transition-colors"
                >
                  {cat.term}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Related papers */}
      <RelatedPapers
        primaryCategory={paper.primaryCategory.term}
        currentId={paper.arxivId}
      />
    </div>
  );
}
