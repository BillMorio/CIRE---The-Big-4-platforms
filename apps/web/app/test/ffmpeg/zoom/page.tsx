"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/tailwind/ui/button";
import { Upload, Video, Loader2, Download, X, ZoomIn, ZoomOut, Sparkles, Target } from "lucide-react";

const FFMPEG_SERVER = "http://localhost:3333";

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
}

export default function ZoomTest() {
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");

  // Zoom controls
  const [zoomType, setZoomType] = useState<"in" | "out">("in");
  const [startZoom, setStartZoom] = useState<number>(1);
  const [endZoom, setEndZoom] = useState<number>(1.5);
  const [centerX, setCenterX] = useState<number>(0.5);
  const [centerY, setCenterY] = useState<number>(0.5);

  const videoRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
      };
      videoEl.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [video]);

  // Update zoom values when type changes
  useEffect(() => {
    if (zoomType === "in") {
      setStartZoom(1);
      setEndZoom(1.5);
    } else {
      setStartZoom(1.5);
      setEndZoom(1);
    }
  }, [zoomType]);

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

  const handleZoom = async () => {
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
      formData.append("type", zoomType);
      formData.append("startZoom", startZoom.toString());
      formData.append("endZoom", endZoom.toString());
      formData.append("centerX", centerX.toString());
      formData.append("centerY", centerY.toString());

      setProgress("Applying zoom effect...");

      const response = await fetch(`${FFMPEG_SERVER}/api/zoom`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply zoom");
      }

      setProgress("Complete!");
      setOutputUrl(`${FFMPEG_SERVER}${data.outputFile}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle click on preview to set center point
  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCenterX(Math.max(0, Math.min(1, x)));
    setCenterY(Math.max(0, Math.min(1, y)));
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
            Zoom Effect Tool
          </h1>
          <p className="text-zinc-500 max-w-md mx-auto">
            Apply Ken Burns style zoom in or zoom out effects to your videos
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
                        {metadata && ` • ${metadata.duration.toFixed(1)}s • ${metadata.width}x${metadata.height}`}
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
                
                {/* Video Preview with Center Point Selector */}
                <div className="relative">
                  <p className="text-xs text-zinc-500 mb-2">Click on the video to set zoom center point</p>
                  <div
                    ref={previewRef}
                    onClick={handlePreviewClick}
                    className="relative cursor-crosshair"
                  >
                    {videoUrl && (
                      <video
                        src={videoUrl}
                        className="w-full h-48 object-contain rounded-xl bg-black"
                        controls
                      />
                    )}
                    {/* Center point indicator */}
                    <div
                      className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        left: `${centerX * 100}%`,
                        top: `${centerY * 100}%`,
                      }}
                    >
                      <Target className="w-8 h-8 text-fuchsia-400 drop-shadow-lg" />
                    </div>
                  </div>
                </div>
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

        {/* Zoom Controls */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            {zoomType === "in" ? (
              <ZoomIn className="w-5 h-5 text-violet-400" />
            ) : (
              <ZoomOut className="w-5 h-5 text-violet-400" />
            )}
            Zoom Settings
          </h3>

          {/* Zoom Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setZoomType("in")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                zoomType === "in"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
              }`}
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </button>
            <button
              onClick={() => setZoomType("out")}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                zoomType === "out"
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
              }`}
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </button>
          </div>

          {/* Zoom Values */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Start Zoom</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={startZoom}
                  onChange={(e) => setStartZoom(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-sm text-white w-12 text-right">{startZoom.toFixed(1)}x</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">End Zoom</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={endZoom}
                  onChange={(e) => setEndZoom(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
                <span className="text-sm text-white w-12 text-right">{endZoom.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          {/* Center Point */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Center X</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={centerX}
                  onChange={(e) => setCenterX(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-sm text-white w-12 text-right">{(centerX * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Center Y</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={centerY}
                  onChange={(e) => setCenterY(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
                <span className="text-sm text-white w-12 text-right">{(centerY * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Preview Animation */}
          <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl">
            <p className="text-xs text-zinc-500 mb-3">Effect Preview</p>
            <div className="flex items-center justify-center gap-4">
              <div className="relative w-16 h-16 border-2 border-zinc-600 rounded-lg overflow-hidden">
                <div
                  className="absolute bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 transition-all duration-500"
                  style={{
                    width: `${100 / startZoom}%`,
                    height: `${100 / startZoom}%`,
                    left: `${(1 - 1 / startZoom) * centerX * 100}%`,
                    top: `${(1 - 1 / startZoom) * centerY * 100}%`,
                  }}
                />
                <p className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">Start</p>
              </div>
              <span className="text-zinc-600">→</span>
              <div className="relative w-16 h-16 border-2 border-zinc-600 rounded-lg overflow-hidden">
                <div
                  className="absolute bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 transition-all duration-500"
                  style={{
                    width: `${100 / endZoom}%`,
                    height: `${100 / endZoom}%`,
                    left: `${(1 - 1 / endZoom) * centerX * 100}%`,
                    top: `${(1 - 1 / endZoom) * centerY * 100}%`,
                  }}
                />
                <p className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">End</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleZoom}
            disabled={!video || isProcessing}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {progress}
              </>
            ) : (
              <>
                {zoomType === "in" ? <ZoomIn className="w-5 h-5 mr-2" /> : <ZoomOut className="w-5 h-5 mr-2" />}
                Apply Zoom {zoomType === "in" ? "In" : "Out"} Effect
              </>
            )}
          </Button>
        </div>

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
                Zoomed Video
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
