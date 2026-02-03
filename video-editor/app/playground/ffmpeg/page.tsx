"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Upload, Play, Scissors, Gauge, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FFmpegPlaygroundPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(10);
  const [targetDuration, setTargetDuration] = useState(5);
  const [zoomStart, setZoomStart] = useState(1);
  const [zoomEnd, setZoomEnd] = useState(1.3);
  const [output, setOutput] = useState<string | null>(null);

  const runTrim = async () => {
    setOutput("Running trim... (API call would go here)");
    // TODO: Implement actual API call
  };

  const runFit = async () => {
    setOutput("Running fit to duration... (API call would go here)");
    // TODO: Implement actual API call
  };

  const runZoom = async () => {
    setOutput("Running zoom effect... (API call would go here)");
    // TODO: Implement actual API call
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/playground" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Film className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">FFmpeg Operations</h1>
            <p className="text-xs text-muted-foreground technical-label uppercase tracking-widest">
              Test video processing operations
            </p>
          </div>
        </div>

        {/* Video Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm technical-label uppercase tracking-widest flex items-center gap-2">
              <Upload className="w-4 h-4" /> Video Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL or path..."
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* Trim */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm technical-label uppercase tracking-widest flex items-center gap-2">
              <Scissors className="w-4 h-4" /> Trim
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start Time (s)</label>
                <Input 
                  type="number" 
                  value={trimStart} 
                  onChange={(e) => setTrimStart(Number(e.target.value))}
                  step={0.1}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End Time (s)</label>
                <Input 
                  type="number" 
                  value={trimEnd} 
                  onChange={(e) => setTrimEnd(Number(e.target.value))}
                  step={0.1}
                />
              </div>
            </div>
            <Button onClick={runTrim} className="w-full">
              <Play className="w-4 h-4 mr-2" /> Run Trim
            </Button>
          </CardContent>
        </Card>

        {/* Fit to Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm technical-label uppercase tracking-widest flex items-center gap-2">
              <Gauge className="w-4 h-4" /> Fit to Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Target Duration (s)</label>
              <Input 
                type="number" 
                value={targetDuration} 
                onChange={(e) => setTargetDuration(Number(e.target.value))}
                step={0.5}
              />
            </div>
            <Button onClick={runFit} className="w-full">
              <Play className="w-4 h-4 mr-2" /> Run Fit
            </Button>
          </CardContent>
        </Card>

        {/* Zoom */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm technical-label uppercase tracking-widest flex items-center gap-2">
              <ZoomIn className="w-4 h-4" /> Zoom Effect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Start Zoom</label>
                <Input 
                  type="number" 
                  value={zoomStart} 
                  onChange={(e) => setZoomStart(Number(e.target.value))}
                  step={0.1}
                  min={0.5}
                  max={3}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">End Zoom</label>
                <Input 
                  type="number" 
                  value={zoomEnd} 
                  onChange={(e) => setZoomEnd(Number(e.target.value))}
                  step={0.1}
                  min={0.5}
                  max={3}
                />
              </div>
            </div>
            <Button onClick={runZoom} className="w-full">
              <Play className="w-4 h-4 mr-2" /> Run Zoom
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        {output && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm technical-label uppercase tracking-widest">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="p-3 bg-muted/10 rounded-lg border border-border text-xs font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
