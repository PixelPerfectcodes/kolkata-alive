import { NextRequest, NextResponse } from "next/server";
import { mockLocations } from "@/lib/mockData";
import { fetchApprovedMemories } from "@/lib/dbService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.toLowerCase() || "";
    const category = searchParams.get("category") || "";

    const activeMemories = await fetchApprovedMemories();

    // Simulate RAG (Retrieval-Augmented Generation) Vector matching
    // Calculate pseudo-semantic similarity scores based on term matches
    const results = mockLocations
      .map((location) => {
        let score = 0;
        if (!query) {
          score = 1;
        } else {
          // Weight title matches highly
          if (location.name.toLowerCase().includes(query)) score += 0.8;
          if (location.bengaliName.includes(query)) score += 0.9;
          if (location.shortDescription.toLowerCase().includes(query)) score += 0.4;
          if (location.storyEn.toLowerCase().includes(query)) score += 0.2;
          
          // Match tags
          const matchedTags = location.tags.filter((t) => t.toLowerCase().includes(query));
          score += matchedTags.length * 0.3;
        }

        // Apply metadata filters
        if (category && location.category !== category) {
          score = 0;
        }

        return { ...location, similarity: Math.min(score, 0.99) };
      })
      .filter((loc) => loc.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);

    // Also scan memories for related terms to simulate historical logs
    const relatedMemories = activeMemories.filter((mem) => {
      if (!query) return true;
      return (
        mem.title.toLowerCase().includes(query) ||
        mem.story.toLowerCase().includes(query) ||
        mem.userName.toLowerCase().includes(query)
      );
    });

    return NextResponse.json({
      query,
      category,
      results,
      memories: relatedMemories,
      totalMatches: results.length + relatedMemories.length,
    });
  } catch (error) {
    console.error("RAG search query failure:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
