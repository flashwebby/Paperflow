import { NextRequest, NextResponse } from "next/server";
import { fetchPapers } from "@/lib/arxiv";
import type { SearchParams, SortOption } from "@/types";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const params: SearchParams = {
    query: searchParams.get("query") ?? "",
    category: searchParams.get("category") ?? undefined,
    sortBy: (searchParams.get("sortBy") as SortOption) ?? "relevance",
    sortOrder:
      (searchParams.get("sortOrder") as "ascending" | "descending") ??
      "descending",
    start: parseInt(searchParams.get("start") ?? "0", 10),
    maxResults: parseInt(searchParams.get("maxResults") ?? "10", 10),
  };

  try {
    const result = await fetchPapers(params);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("arXiv API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch papers from arXiv" },
      { status: 500 }
    );
  }
}
