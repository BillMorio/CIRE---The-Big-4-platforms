import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const { transcription, allowedVisualTypes } = await req.json();

    if (!transcription || !transcription.text) {
      return NextResponse.json({ error: "Invalid transcription data" }, { status: 400 });
    }

    const visualTypesList = allowedVisualTypes && allowedVisualTypes.length > 0 
      ? allowedVisualTypes.join(", ") 
      : "a-roll, b-roll, graphics, image";

    const systemPrompt = `You are an expert video director and storyboard artist.
Your task is to take a transcript with word-level timestamps and segment it into logical video scenes.

RESTRICTION:
You ONLY use the following visual types: [${visualTypesList}].
If only "a-roll" is selected, the entire video should be one or more segments of "a-roll".

SCHEMA:
You must return a JSON object containing a "project" summary and a "scenes" array.
Each scene must have:
- index (int)
- startTime (float)
- endTime (float)
- script (text)
- directorNote (text): A brief note describing the visual "vibe" and direction.
- visualType (one of: ${visualTypesList})
- aRoll, bRoll, graphics, or image (object with technical details)

TECHNICAL REQUIREMENTS:
- startTime and endTime must exactly match the word-level timestamps provided.
- a-roll: Used for host explanation. Provide 'avatarId' (e.g., "avatar_host_01").
- b-roll: Used for b-roll footage. You MUST provide a highly descriptive 'searchQuery' (e.g., "closeup of developer typing on mechanical keyboard with blue neon lighting").
- graphics: Used for text overlays. Provide a 'prompt' describing the animation.
- image: Used for statics. Provide a 'searchQuery'.

EXAMPLE OUTPUT FORMAT:
{
  "project": { "title": "...", "totalDuration": 0 },
  "scenes": [
    {
      "index": 1,
      "startTime": 0.0,
      "endTime": 5.2,
      "duration": 5.2,
      "script": "...",
      "directorNote": "Close up of host looking directly at camera, confident energy.",
      "visualType": "a-roll",
      "aRoll": { "type": "ai-avatar", "avatarId": "avatar_host_01", "provider": "heygen" }
    }
  ]
}

Input: ${JSON.stringify(transcription.text)}
Timestamps: ${JSON.stringify(transcription.words)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Segment this transcript into a professional video storyboard." }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("[Scene Generation Error]", error);
    return NextResponse.json({ error: error.message || "Failed to generate scenes" }, { status: 500 });
  }
}
