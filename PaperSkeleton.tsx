"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaperCard } from "@/components/paper/PaperCard";
import { PaperSkeleton } from "@/components/paper/PaperSkeleton";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterBar } from "@/components/ui/FilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { useAppStore } from "@/lib/store";
import type { Paper, SortOption } from "@/types";

const RESULTS_PER_PAGE = 10;

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { viewMode, setViewMode, setLastSearch } = useAppStore();

  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialSort = (searchParams.get("sortBy") as SortOption) ?? "relevance";
  const initialPage = parseInt(searchParams.get("page") ?? "1", 10);

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [papers, setPapers] = useState<Paper[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.min(Math.ceil(totalResults / RESULTS_PER_PAGE), 100);

  const fetchResults = useCallback(
    async (q: string, cat: string, sort: SortOption, page: number) => {
      if (!q && !cat) return;
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          query: q,
          ...(cat && { category: cat }),
          sortBy: sort,
          sortOrder: "descending",
          start: ((page - 1) * RESULTS_PER_PAGE).toString(),
          maxResults: RESULTS_PER_PAGE.toString(),
        });

        const res = await fetch(`/api/arxiv?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPapers(data.papers);
        setTotalResults(data.totalResults);
        setLastSearch({ query: q, category: cat, sortBy: sort });
      } catch {
        setError("Failed to fetch papers. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [setLastSearch]
  );

  // Sync URL → state on mount and URL changes
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const cat = searchParams.get("category") ?? "";
    const sort = (searchParams.get("sortBy") as SortOption) ?? "relevance";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    setQuery(q);
    setCategory(cat);
    setSortBy(sort);
    setCurrentPage(page);
    fetchResults(q, cat, sort, page);
  }, [searchParams, fetchResults]);

  const updateUrl = (q: string, cat: string, sort: SortOption, page: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    if (sort !== "relevance") params.set("sortBy", sort);
    if (page > 1) params.set("page", page.toString());
    router.push(`/search?${params.toString()}`);
  };

  const handleSearch = (newQuery: string) => {
    setCurrentPage(1);
    updateUrl(newQuery, category, sortBy, 1);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCurrentPage(1);
    updateUrl(query, cat, sortBy, 1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
    updateUrl(query, category, sort, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(query, category, sortBy, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ink-100 mb-6">
          {query ? (
            <>
              Results for{" "}
              <span className="gradient-text">"{query}"</span>
            </>
          ) : category ? (
            <>
              Papers in{" "}
              <span className="gradient-text font-mono">{category}</span>
            </>
          ) : (
            "Search Papers"
          )}
        </h1>

        <SearchBar defaultValue={query} onSearch={handleSearch} size="lg" />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          category={category}
          sortBy={sortBy}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          resultCount={!loading ? totalResults : undefined}
        />
      </div>

      {/* View mode toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-ink-900 border border-ink-800">
          <button
            onClick={() => setViewMode("card")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "card" ? "bg-ink-700 text-ink-100" : "text-ink-500 hover:text-ink-300"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-ink-700 text-ink-100" : "text-ink-500 hover:text-ink-300"}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results */}
      {error ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-ink-400">{error}</p>
          <button
            onClick={() => fetchResults(query, category, sortBy, currentPage)}
            className="mt-4 btn-amber"
          >
            Retry
          </button>
        </div>
      ) : !query && !category ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔭</div>
          <h3 className="font-display text-xl text-ink-300 mb-2">
            Search for research papers
          </h3>
          <p className="text-ink-500 text-sm">
            Try searching for a topic, author, or pick a category above
          </p>
        </div>
      ) : loading ? (
        <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
          <PaperSkeleton count={viewMode === "card" ? 6 : 8} />
        </div>
      ) : papers.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-ink-400">No papers found. Try a different query.</p>
        </div>
      ) : (
        <>
          <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
            {papers.map((paper, i) => (
              <PaperCard
                key={paper.arxivId}
                paper={paper}
                index={i}
                variant={viewMode}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <PaperSkeleton count={6} />
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
