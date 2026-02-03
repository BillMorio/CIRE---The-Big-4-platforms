"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/tailwind/ui/button";
import { Upload, Video, Loader2, Download, X, Scissors, Gauge, Clock, Sparkles } from "lucide-react";

const FFMPEG_SERVER = "http://localhost:3333";

// Helper to format seconds to HH:MM:SS
function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Helper to parse HH:MM:SS to seconds
function parseTime(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parseFloat(timeStr) || 0;
}

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export default function TrimFitTest() {
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"trim" | "fit">("trim");

  // Trim controls
  const [startTime, setStartTime] = useState<string>("00:00:00");
  const [duration, setDuration] = useState<string>("00:00:10");

  // Fit controls
  const [targetDuration, setTargetDuration] = useState<number>(10);

  const videoRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Get video metadata when file is selected
  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoUrl(url);

      const videoEl = document.createElement("video");
      videoEl.onloadedmetadata = () => {
        setMetadata({
          duration: videoEl.duration,
          width: videoEl.videoWidth,
          height: videoEl.videoHeight,
        });
        // Set default target duration to video duration
        setTargetDuration(Math.round(videoEl.duration));
      };
      videoEl.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [video]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setOutputUrl(null);
      setError(null);
    }
  };

  const clearVideo = () => {
    setVideo(null);
    setVideoUrl(null);
    setMetadata(null);
    setOutputUrl(null);
    if (videoRef.current) {
      videoRef.current.value = "";
    }
  };

  const handleTrim = async () => {
    if (!video) {
      setError("Please select a video");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress("Uploading video...");

    try {
      const formData = new FormData();
      formData.append("file", video);
      formData.append("start", startTime);
      formData.append("duration", duration);

      setProgress("Trimming with FFmpeg...");

      const response = await fetch(`${FFMPEG_SERVER}/api/trim`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to trim video");
      }

      setProgress("Complete!");
      setOutputUrl(`${FFMPEG_SERVER}${data.outputFile}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFit = async () => {
    if (!video) {
      setError("Please select a video");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress("Uploading video...");

    try {
      const formData = new FormData();
      formData.append("file", video);
      formData.append("targetDuration", targetDuration.toString());

      setProgress("Adjusting speed with FFmpeg...");

      const response = await fetch(`${FFMPEG_SERVER}/api/speed`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to adjust video speed");
      }

      setProgress(`Complete! Speed: ${data.speedApplied}x`);
      setOutputUrl(`${FFMPEG_SERVER}${data.outputFile}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">FFmpeg Playground</span>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-300 to-zinc-500 mb-3">
            Trim & Fit Tool
          </h1>
          <p className="text-zinc-500 max-w-md mx-auto">
            Trim videos to a specific segment or fit them to a target duration
          </p>
        </div>

        {/* Video Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-zinc-400 mb-2">Source Video</label>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
              video
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
            }`}
          >
            {video ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <Video className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate">{video.name}</p>
                      <p className="text-xs text-zinc-500">
                        {(video.size / 1024 / 1024).toFixed(2)} MB
                        {metadata && ` • ${formatTime(metadata.duration)} • ${metadata.width}x${metadata.height}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearVideo}
                    className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-zinc-400" />
                  </button>
                </div>
                {videoUrl && (
                  <video
                    ref={previewVideoRef}
                    src={videoUrl}
                    className="w-full h-48 object-contain rounded-xl bg-black"
                    controls
                  />
                )}
              </div>
            ) : (
              <div
                onClick={() => videoRef.current?.click()}
                className="cursor-pointer text-center py-8"
              >
                <div className="mx-auto w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="text-sm text-zinc-400">Click to upload</p>
                <p className="text-xs text-zinc-600 mt-1">MP4, WebM, MOV</p>
              </div>
            )}
            <input
              ref={videoRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("trim")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "trim"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Scissors className="w-4 h-4" />
            Trim
          </button>
          <button
            onClick={() => setActiveTab("fit")}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "fit"
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Gauge className="w-4 h-4" />
            Fit to Duration
          </button>
        </div>

        {/* Trim Controls */}
        {activeTab === "trim" && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-violet-400" />
              Trim Settings
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Start Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="00:00:00"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                />
                <p className="text-xs text-zinc-600 mt-1">Format: HH:MM:SS</p>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="00:00:10"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500"
                />
                <p className="text-xs text-zinc-600 mt-1">Format: HH:MM:SS</p>
              </div>
            </div>
            {metadata && (
              <div className="mt-4 p-3 bg-zinc-800/50 rounded-xl">
                <p className="text-xs text-zinc-500">
                  Original duration: <span className="text-zinc-300">{formatTime(metadata.duration)}</span>
                  {" • "}
                  Trimmed range: <span className="text-violet-400">{startTime}</span> to{" "}
                  <span className="text-violet-400">{formatTime(parseTime(startTime) + parseTime(duration))}</span>
                </p>
              </div>
            )}
            <Button
              onClick={handleTrim}
              disabled={!video || isProcessing}
              className="w-full mt-4 py-4 text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
            >
              {isProcessing && activeTab === "trim" ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {progress}
                </>
              ) : (
                <>
                  <Scissors className="w-5 h-5 mr-2" />
                  Trim Video
                </>
              )}
            </Button>
          </div>
        )}

        {/* Fit Controls */}
        {activeTab === "fit" && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-violet-400" />
              Fit to Duration
            </h3>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Target Duration (seconds)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={metadata ? Math.ceil(metadata.duration / 4) : 1}
                  max={metadata ? Math.ceil(metadata.duration * 4) : 60}
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <input
                  type="number"
                  value={targetDuration}
                  onChange={(e) => setTargetDuration(parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-24 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>
            {metadata && (
              <div className="mt-4 p-3 bg-zinc-800/50 rounded-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">
                    Original: <span className="text-zinc-300">{formatTime(metadata.duration)}</span>
                  </span>
                  <span className="text-zinc-500">
                    Target: <span className="text-violet-400">{formatTime(targetDuration)}</span>
                  </span>
                  <span className="text-zinc-500">
                    Speed:{" "}
                    <span className={`font-medium ${metadata.duration / targetDuration > 1 ? "text-orange-400" : "text-emerald-400"}`}>
                      {(metadata.duration / targetDuration).toFixed(2)}x
                    </span>
                  </span>
                </div>
                <div className="mt-2 h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all"
                    style={{ width: `${Math.min(100, (targetDuration / metadata.duration) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-2">
                  {metadata.duration / targetDuration > 1
                    ? "Video will be sped up (faster playback)"
                    : "Video will be slowed down (slower playback)"}
                </p>
              </div>
            )}
            <Button
              onClick={handleFit}
              disabled={!video || isProcessing}
              className="w-full mt-4 py-4 text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
            >
              {isProcessing && activeTab === "fit" ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {progress}
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5 mr-2" />
                  Fit to {formatTime(targetDuration)}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Output Section */}
        {outputUrl && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-400" />
                Processed Video
              </h2>
              <a
                href={outputUrl}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
            <video
              src={outputUrl}
              controls
              className="w-full rounded-2xl"
            />
          </div>
        )}

        {/* Server Status Hint */}
        <div className="mt-8 text-center text-sm text-zinc-600">
          <p>Make sure the FFmpeg server is running at <code className="text-zinc-400">localhost:3333</code></p>
        </div>
      </div>
    </div>
  );
}
