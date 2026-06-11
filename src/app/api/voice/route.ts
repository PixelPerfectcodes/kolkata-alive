import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = "21m00Tcm4TlvDq8ikWAM" } = await req.json(); // Rachel default voice or classical broad

    const xiApiKey = process.env.ELEVENLABS_API_KEY;
    if (!xiApiKey) {
      // Return a flag instructing client to use WebSpeech API fallback
      return NextResponse.json({
        success: true,
        useWebSpeechFallback: true,
        message: "Using high-quality client-side Web Speech engine (ElevenLabs API Key not set).",
      });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": xiApiKey,
          "Content-Type": "application/json",
          accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error: any) {
    console.warn("ElevenLabs voice synthesis failed. Utilizing Client WebSpeech.", error);
    return NextResponse.json({
      success: true,
      useWebSpeechFallback: true,
      error: error.message,
    });
  }
}
