import { NextRequest, NextResponse } from "next/server";

const HERA_API_KEY = "333c6d24744f0bf4d706a72ebdb7d073134989ad640f94bab413ce0a07bfda1b";
const HERA_API_URL = "https://api.hera.video/v1/videos";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    const response = await fetch(`${HERA_API_URL}/${videoId}`, {
      method: "GET",
      headers: {
        "x-api-key": HERA_API_KEY,
      },
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
      { error: error.message || "Failed to check Hera video status" },
      { status: 500 }
    );
  }
}
