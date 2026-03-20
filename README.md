import Link from "next/link";
import { fetchPapers } from "@/lib/arxiv";
import { formatDate, formatAuthors, categoryColor, cn } from "@/lib/utils";

interface RelatedPapersProps {
  primaryCategory: string;
  currentId: string;
}

export async function RelatedPapers({ primaryCategory, currentId }: RelatedPapersProps) {
  try {
    const result = await fetchPapers({
      query: "",
      category: primaryCategory,
      sortBy: "submittedDate",
      sortOrder: "descending",
      maxResults: 5,
    });

    const related = result.papers.filter((p) => p.arxivId !== currentId).slice(0, 4);

    if (related.length === 0) return null;

    return (
      <section className="mt-16 pt-8 border-t border-ink-800">
        <h2 className="font-display font-semibold text-xl text-ink-100 mb-6">
          Related Papers
          <span className="ml-2 font-mono text-sm text-ink-500 font-normal">
            in {primaryCategory}
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {related.map((paper) => (
            <Link
              key={paper.arxivId}
              href={`/paper/${paper.arxivId}`}
              className="group p-4 rounded-xl border border-ink-800 bg-ink-900/50 hover:border-ink-700 hover:bg-ink-900 transition-all"
            >
              <div className="flex gap-2 mb-2">
                <span className={cn("badge text-xs", categoryColor(paper.primaryCategory.term))}>
                  {paper.primaryCategory.term}
                </span>
              </div>
              <h3 className="text-sm font-medium text-ink-200 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-1.5">
                {paper.title}
              </h3>
              <p className="text-xs text-ink-500">
                {formatAuthors(paper.authors, 2)} · {formatDate(paper.published)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    );
  } catch {
    return null;
  }
}
