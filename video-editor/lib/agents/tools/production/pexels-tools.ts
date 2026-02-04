/**
 * PRODUCTION PEXELS TOOLS
 * Uses the real Pexels API to search for high-quality stock footage.
 */

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export interface SearchPexelsArgs {
  query: string;
  per_page?: number;
}

/**
 * Searches the Pexels library for videos matching a query.
 */
export async function search_pexels_library(args: SearchPexelsArgs) {
  console.log(`[PexelsTool] Searching for "${args.query}"...`);

  if (!PEXELS_API_KEY) {
    return {
      status: "failed",
      error: "PEXELS_API_KEY is missing from environment variables."
    };
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(args.query)}&per_page=${args.per_page || 5}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        status: "failed",
        error: data.error || "Failed to search Pexels API"
      };
    }

    if (!data.videos || data.videos.length === 0) {
      return {
        status: "failed",
        error: `No results found for query: ${args.query}`
      };
    }

    // Pick the best video (typically the first one)
    const bestVideo = data.videos[0];
    
    // Find the original or a high-res link
    const videoFile = bestVideo.video_files.find((f: any) => f.quality === 'hd') || bestVideo.video_files[0];

    console.log(`[PexelsTool] Found video: ${bestVideo.url}`);

    return {
      status: "completed",
      videoUrl: videoFile.link,
      thumbnail: bestVideo.image,
      duration: bestVideo.duration,
      pexels_url: bestVideo.url,
      message: `Found premium footage for "${args.query}".`
    };
  } catch (error: any) {
    console.error("[PexelsTool] Error searching Pexels:", error);
    return {
      status: "failed",
      error: error.message || "Unknown error during Pexels search"
    };
  }
}
