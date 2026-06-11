import { NextRequest, NextResponse } from "next/server";
import { mockLocations } from "@/lib/mockData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { locationId, prompt, language = "en" } = body;

    const location = mockLocations.find((l) => l.id === locationId);
    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    // Default static narrative from mock database
    let narrative = language === "bn" ? location.storyBn : location.storyEn;

    // Simulate custom storytelling generation using Hugging Face if token is present
    const hfToken = process.env.HF_TOKEN;
    if (hfToken && prompt) {
      try {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${hfToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: `Generate a highly cinematic, emotional, and heritage-inspired cultural story about ${location.name} in Kolkata. Focus on the sensory details like street smells, historical echoes, and deep cultural pride. Use the query details: ${prompt}. Keep it around 150 words.`,
              parameters: {
                max_new_tokens: 250,
                temperature: 0.7,
              },
            }),
          }
        );
        const data = await response.json();
        if (data && data[0]?.generated_text) {
          narrative = data[0].generated_text.split("inputs:")[0].trim();
        }
      } catch (err) {
        console.warn("Hugging Face API call failed, falling back to rich static archive.", err);
      }
    }

    // Return narrative with structured meta info
    return NextResponse.json({
      locationName: location.name,
      bengaliName: location.bengaliName,
      story: narrative,
      category: location.category,
      timeline: location.timeline,
      references: location.literatureReferences,
      image: location.imageUrl,
    });
  } catch (error) {
    console.error("Storytelling generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
