import { NextRequest, NextResponse } from "next/server";

const HERA_API_KEY = "333c6d24744f0bf4d706a72ebdb7d073134989ad640f94bab413ce0a07bfda1b";
const HERA_API_URL = "https://api.hera.video/v1/videos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(HERA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": HERA_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to call Hera API" },
      { status: 500 }
    );
  }
}
