import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    console.log(`[Whisper API] Processing file: ${file.name} (${file.size} bytes)`);

    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"],
    });

    return NextResponse.json(transcription);
  } catch (error: any) {
    console.error("[Whisper API Error]", error);
    return NextResponse.json({ 
      error: error.message || "Failed to transcribe audio",
      details: error.response?.data || null
    }, { status: 500 });
  }
}
