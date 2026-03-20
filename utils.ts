import Link from "next/link";
import { fetchPapers } from "@/lib/arxiv";
import { TRENDING_TOPICS } from "@/lib/arxiv";
import { PaperCard } from "@/components/paper/PaperCard";
import { SearchBar } from "@/components/ui/SearchBar";

async function getRecentPapers() {
  try {
    const result = await fetchPapers({
      query: "machine learning",
      sortBy: "submittedDate",
      sortOrder: "descending",
      maxResults: 6,
    });
    return result.papers;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const recentPapers = await getRecentPapers();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-amber-600/3 blur-[80px] rounded-full" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium mb-8 animate-in">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Live arXiv data · Updated every 5 minutes
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-ink-50 leading-[1.05] tracking-tight mb-6 animate-in animation-delay-100">
            Research,{" "}
            <span className="gradient-text">reimagined.</span>
          </h1>

          <p className="text-lg sm:text-xl text-ink-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-in animation-delay-200">
            A modern interface for arXiv — discover, read, and understand the
            latest scientific papers without the noise.
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto animate-in animation-delay-300">
            <SearchBar size="lg" />
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 animate-in animation-delay-400">
            <span className="text-xs text-ink-600">Try:</span>
            {["transformer architecture", "protein folding", "quantum entanglement", "RLHF"].map((q) => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="text-xs px-2.5 py-1 rounded-full bg-ink-800 border border-ink-700 text-ink-400 hover:text-ink-200 hover:border-ink-500 transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-ink-800 bg-ink-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-center gap-8 sm:gap-16 flex-wrap">
            {[
              { label: "Papers indexed", value: "2.4M+" },
              { label: "New papers daily", value: "~2,000" },
              { label: "Subject areas", value: "8" },
              { label: "Open access", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-xl text-amber-400">{stat.value}</div>
                <div className="text-xs text-ink-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-display font-semibold text-2xl text-ink-100">
              Trending Topics
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              Explore active research areas
            </p>
          </div>
          <Link
            href="/trending"
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TRENDING_TOPICS.map((topic, i) => (
            <Link
              key={topic.label}
              href={`/search?category=${topic.category}&q=${encodeURIComponent(topic.label)}`}
              className="group p-4 rounded-xl border border-ink-800 bg-ink-900/50 hover:border-amber-500/30 hover:bg-ink-900 transition-all animate-in text-center"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="text-2xl mb-2">{topic.icon}</div>
              <div className="text-xs font-medium text-ink-200 group-hover:text-amber-300 transition-colors leading-tight">
                {topic.label}
              </div>
              <div className="text-[10px] font-mono text-ink-600 mt-1">
                {topic.category}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Papers */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="font-display font-semibold text-2xl text-ink-100">
              Recently Submitted
            </h2>
            <p className="text-sm text-ink-500 mt-1">
              Latest papers from arXiv
            </p>
          </div>
          <Link
            href="/search?sortBy=submittedDate"
            className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
          >
            See more →
          </Link>
        </div>

        {recentPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPapers.map((paper, i) => (
              <PaperCard key={paper.arxivId} paper={paper} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-ink-500">
            <p>Unable to load papers. Check your connection.</p>
          </div>
        )}
      </section>

      {/* Features section */}
      <section className="border-t border-ink-800 bg-ink-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="font-display font-semibold text-2xl text-ink-100 text-center mb-12">
            Built for researchers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🔍",
                title: "Smart Search",
                desc: "Search by keyword, author, or category with instant filters",
              },
              {
                icon: "🔖",
                title: "Save & Organize",
                desc: "Bookmark papers and add personal notes for later",
              },
              {
                icon: "📊",
                title: "Rich Previews",
                desc: "Read abstracts, metadata, and links without leaving the page",
              },
              {
                icon: "🌙",
                title: "Dark Mode",
                desc: "Easy on the eyes during late-night reading sessions",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="p-5 rounded-xl border border-ink-800 animate-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-medium text-ink-100 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-ink-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
