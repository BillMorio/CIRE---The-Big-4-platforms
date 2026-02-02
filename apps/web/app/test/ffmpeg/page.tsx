"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/tailwind/ui/button";
import { Upload, Video, Loader2, Download, X, Film, Sparkles, Blend } from "lucide-react";

const FFMPEG_SERVER = "http://localhost:3333";

type TransitionType = "none" | "fade" | "crossfade" | "wipeleft" | "wiperight" | "slideup" | "slidedown";

const TRANSITIONS: { value: TransitionType; label: string; description: string }[] = [
  { value: "none", label: "None", description: "No transition" },
  { value: "fade", label: "Fade", description: "Fade to black" },
  { value: "crossfade", label: "Crossfade", description: "Blend together" },
  { value: "wipeleft", label: "Wipe Left", description: "Wipe to left" },
  { value: "wiperight", label: "Wipe Right", description: "Wipe to right" },
  { value: "slideup", label: "Slide Up", description: "Slide upward" },
  { value: "slidedown", label: "Slide Down", description: "Slide downward" },
];

export default function VideoJoinTest() {
  const [video1, setVideo1] = useState<File | null>(null);
  const [video2, setVideo2] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>("");
  const [transition, setTransition] = useState<TransitionType>("none");
  const [transitionDuration, setTransitionDuration] = useState<number>(1);

  const video1Ref = useRef<HTMLInputElement>(null);
  const video2Ref = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, setVideo: (file: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);
      setOutputUrl(null);
      setError(null);
    }
  };

  const handleJoinVideos = async () => {
    if (!video1 || !video2) {
      setError("Please select both videos");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress("Uploading videos...");

    try {
      const formData = new FormData();
      formData.append("files", video1);
      formData.append("files", video2);
      formData.append("transition", transition);
      formData.append("transitionDuration", transitionDuration.toString());

      setProgress("Processing with FFmpeg...");

      const response = await fetch(`${FFMPEG_SERVER}/api/concat`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join videos");
      }

      setProgress("Complete!");
      setOutputUrl(`${FFMPEG_SERVER}${data.outputFile}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearVideo = (setVideo: (file: File | null) => void, ref: React.RefObject<HTMLInputElement>) => {
    setVideo(null);
    if (ref.current) {
      ref.current.value = "";
    }
  };

  const VideoSlot = ({
    video,
    setVideo,
    inputRef,
    label,
  }: {
    video: File | null;
    setVideo: (file: File | null) => void;
    inputRef: React.RefObject<HTMLInputElement>;
    label: string;
  }) => (
    <div className="flex-1">
      <label className="block text-sm font-medium text-zinc-400 mb-2">{label}</label>
      <div
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
          video
            ? "border-emerald-500/50 bg-emerald-500/5"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
        }`}
      >
        {video ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-xl">
                <Video className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{video.name}</p>
                <p className="text-xs text-zinc-500">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => clearVideo(setVideo, inputRef)}
                className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
            <video
              src={URL.createObjectURL(video)}
              className="w-full h-32 object-cover rounded-xl"
              controls
            />
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
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
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={(e) => handleFileSelect(e, setVideo)}
          className="hidden"
        />
      </div>
    </div>
  );

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
            Video Join Tool
          </h1>
          <p className="text-zinc-500 max-w-md mx-auto">
            Upload two videos and combine them into one using FFmpeg
          </p>
        </div>

        {/* Video Upload Slots */}
        <div className="flex gap-6 mb-8">
          <VideoSlot
            video={video1}
            setVideo={setVideo1}
            inputRef={video1Ref}
            label="First Video"
          />
          
          {/* Transition Selector (between videos) */}
          <div className="flex flex-col items-center justify-center min-w-[140px]">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center mb-3">
              <Blend className="w-6 h-6 text-violet-400" />
            </div>
            <label className="text-xs text-zinc-500 mb-2">Transition</label>
            <select
              value={transition}
              onChange={(e) => setTransition(e.target.value as TransitionType)}
              className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 w-full"
            >
              {TRANSITIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            {transition !== "none" && (
              <div className="mt-2 w-full">
                <label className="text-xs text-zinc-500">Duration: {transitionDuration}s</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.5"
                  value={transitionDuration}
                  onChange={(e) => setTransitionDuration(parseFloat(e.target.value))}
                  className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>
            )}
          </div>
          
          <VideoSlot
            video={video2}
            setVideo={setVideo2}
            inputRef={video2Ref}
            label="Second Video"
          />
        </div>

        {/* Transition Preview */}
        {transition !== "none" && (
          <div className="mb-6 p-4 bg-violet-500/5 border border-violet-500/20 rounded-2xl">
            <div className="flex items-center gap-3">
              <Blend className="w-5 h-5 text-violet-400" />
              <div>
                <p className="text-sm text-white font-medium">
                  {TRANSITIONS.find(t => t.value === transition)?.label} Transition
                </p>
                <p className="text-xs text-zinc-500">
                  {TRANSITIONS.find(t => t.value === transition)?.description} • {transitionDuration}s duration
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Join Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleJoinVideos}
            disabled={!video1 || !video2 || isProcessing}
            className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {progress}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Join Videos
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
                Joined Video
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
