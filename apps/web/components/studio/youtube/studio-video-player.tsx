"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface StudioVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}

export function StudioVideoPlayer({ src, poster, className, autoPlay = false }: StudioVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHls, setIsHls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.includes(".m3u8")) {
      setIsHls(true);
      if (Hls.isSupported()) {
        const hls = new Hls({
          capLevelToPlayerSize: true,
          autoStartLoad: true,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
        return () => hls.destroy();
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      }
    } else {
      setIsHls(false);
      video.src = src;
    }
  }, [src]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`relative group overflow-hidden rounded-2xl bg-black border border-white/10 ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
      />

      {/* Glass Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="relative h-1 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-500 shadow-glow" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={togglePlay} 
                className="h-8 w-8 hover:bg-white/10 text-white"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
              </Button>

              <div className="flex items-center gap-2">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="h-8 w-8 hover:bg-white/10 text-white"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="w-20 hidden sm:block">
                     <Slider 
                        value={[isMuted ? 0 : volume * 100]} 
                        onValueChange={(v) => setVolume(v[0] / 100)} 
                        max={100}
                     />
                  </div>
              </div>

              <div className="text-[10px] technical-label font-black text-white/60">
                {formatTime(currentTime)} / {formatTime(duration)}
                {isHls && <span className="ml-2 text-blue-400">● LIVE_STREAM</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
               <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-white">
                 <Settings className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 text-white">
                 <Maximize className="w-4 h-4" />
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
