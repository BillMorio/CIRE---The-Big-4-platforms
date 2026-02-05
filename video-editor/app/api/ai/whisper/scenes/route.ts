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

CRITICAL REQUIREMENT: SEQUENTIAL CONTINUITY
Your scenes MUST be perfectly sequential and cover the entire duration of the transcript without gaps or overlaps.
- Scene 1 MUST start at the offset of the first word (usually 0.0).
- Every subsequent Scene n MUST have its 'startTime' exactly matching Scene n-1's 'endTime'.
- Failure to maintain sequential timestamps (e.g., resetting to 0.0 for every scene) is UNACCEPTABLE.

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

EXAMPLE SEQUENTIAL OUTPUT:
{
  "project": { "title": "...", "totalDuration": 12.5 },
  "scenes": [
    {
      "index": 1,
      "startTime": 0.0,
      "endTime": 6.7,
      "duration": 6.7,
      "script": "The first segment of the production.",
      "directorNote": "Host introduction, centered and confident.",
      "visualType": "a-roll",
      "aRoll": { "type": "ai-avatar", "avatarId": "avatar_host_01", "provider": "heygen" }
    },
    {
      "index": 2,
      "startTime": 6.7,
      "endTime": 12.5,
      "duration": 5.8,
      "script": "The next segment continues exactly from the previous second.",
      "directorNote": "Dynamic cinematic shift to supporting B-roll.",
      "visualType": "b-roll",
      "bRoll": { "searchQuery": "closeup of mechanical keyboard" }
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
