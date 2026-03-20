import Link from "next/link";
import { fetchPapers, TRENDING_TOPICS } from "@/lib/arxiv";
import { PaperCard } from "@/components/paper/PaperCard";

async function getTrendingByCategory(category: string, count = 3) {
  try {
    const result = await fetchPapers({
      query: "",
      category,
      sortBy: "submittedDate",
      sortOrder: "descending",
      maxResults: count,
    });
    return result.papers;
  } catch {
    return [];
  }
}

export const revalidate = 600; // 10 min

export default async function TrendingPage() {
  // Fetch top 2 trending topics in parallel
  const [llmPapers, diffusionPapers] = await Promise.all([
    getTrendingByCategory("cs.CL", 3),
    getTrendingByCategory("cs.CV", 3),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Live from arXiv
        </div>
        <h1 className="font-display font-bold text-4xl text-ink-100 mb-3">
          Trending in Research
        </h1>
        <p className="text-ink-500 text-lg max-w-xl">
          Explore the most active research fronts and discover what's being
          published right now.
        </p>
      </div>

      {/* Topic explorer grid */}
      <section className="mb-16">
        <h2 className="font-display font-semibold text-xl text-ink-200 mb-6">
          Active Research Areas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRENDING_TOPICS.map((topic, i) => (
            <Link
              key={topic.label}
              href={`/search?category=${topic.category}&q=${encodeURIComponent(topic.label)}`}
              className="group p-5 rounded-2xl border border-ink-800 bg-ink-900/50 hover:border-amber-500/30 hover:bg-ink-900 transition-all animate-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{topic.icon}</span>
                <span className="text-xs font-mono text-ink-600 bg-ink-800 px-2 py-0.5 rounded-md border border-ink-700">
                  {topic.category}
                </span>
              </div>
              <h3 className="font-display font-semibold text-ink-100 group-hover:text-amber-300 transition-colors mb-1.5">
                {topic.label}
              </h3>
              <p className="text-sm text-ink-500 leading-relaxed">
                {topic.description}
              </p>
              <div className="flex items-center gap-1 mt-4 text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore papers
                <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest in NLP/LLMs */}
      {llmPapers.length > 0 && (
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-ink-200">
              🧠 Latest in Language Models
              <span className="ml-2 font-mono text-sm font-normal text-ink-500">cs.CL</span>
            </h2>
            <Link
              href="/search?category=cs.CL&sortBy=submittedDate"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {llmPapers.map((paper, i) => (
              <PaperCard key={paper.arxivId} paper={paper} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Latest in Computer Vision */}
      {diffusionPapers.length > 0 && (
        <section className="mb-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-ink-200">
              🎨 Latest in Computer Vision
              <span className="ml-2 font-mono text-sm font-normal text-ink-500">cs.CV</span>
            </h2>
            <Link
              href="/search?category=cs.CV&sortBy=submittedDate"
              className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {diffusionPapers.map((paper, i) => (
              <PaperCard key={paper.arxivId} paper={paper} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Browse by field */}
      <section>
        <h2 className="font-display font-semibold text-xl text-ink-200 mb-6">
          Browse by Field
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Computer Science", prefix: "cs", icon: "💻", desc: "AI, Systems, Theory" },
            { label: "Physics", prefix: "physics", icon: "⚡", desc: "Classical & Modern" },
            { label: "Mathematics", prefix: "math", icon: "∑", desc: "Pure & Applied" },
            { label: "Quantum", prefix: "quant-ph", icon: "⚛️", desc: "Quantum Information" },
            { label: "Statistics", prefix: "stat", icon: "📊", desc: "Theory & Methods" },
            { label: "Biology", prefix: "q-bio", icon: "🧬", desc: "Quantitative Bio" },
            { label: "Economics", prefix: "econ", icon: "📈", desc: "Theory & Finance" },
            { label: "Astrophysics", prefix: "astro-ph", icon: "🌌", desc: "Stars & Galaxies" },
          ].map((field) => (
            <Link
              key={field.prefix}
              href={`/search?category=${field.prefix}`}
              className="group p-4 rounded-xl border border-ink-800 bg-ink-900/30 hover:border-ink-700 hover:bg-ink-900 transition-all text-center"
            >
              <div className="text-2xl mb-2">{field.icon}</div>
              <div className="text-sm font-medium text-ink-200 group-hover:text-amber-300 transition-colors">
                {field.label}
              </div>
              <div className="text-xs text-ink-600 mt-0.5">{field.desc}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
