"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Play, RefreshCw, Download, CheckCircle, XCircle, Clock, Terminal } from "lucide-react";

// Use local API proxy to bypass CORS
const API_URL = "/api/hera";

interface HeraOutput {
  status: "in-progress" | "success" | "failed";
  config: {
    format: string;
    aspect_ratio: string;
    fps: string;
    resolution: string;
  };
  file_url?: string;
  error?: string;
}

interface HeraVideoStatus {
  video_id: string;
  status: "in-progress" | "success" | "failed";
  outputs: HeraOutput[];
  project_url?: string;
}

interface LogEntry {
  timestamp: string;
  type: "request" | "response" | "error" | "info";
  message: string;
  data?: any;
}

export default function HeraTestPage() {
  const [prompt, setPrompt] = useState("A spinning rainbow wheel with glowing particles");
  const [duration, setDuration] = useState(8);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("1080p");
  const [fps, setFps] = useState("30");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<HeraVideoStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Add log entry helper
  const addLog = (type: LogEntry["type"], message: string, data?: any) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      data,
    };
    setLogs((prev) => [...prev, entry]);
    console.log(`[${type.toUpperCase()}]`, message, data);
  };

  // Clear logs
  const clearLogs = () => setLogs([]);

  // Generate video
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setVideoId(null);
    setVideoStatus(null);

    const requestBody = {
      prompt,
      duration_seconds: duration,
      outputs: [
        {
          format: "mp4",
          aspect_ratio: aspectRatio,
          fps: fps,
          resolution: resolution,
        },
      ],
    };

    addLog("request", `POST ${API_URL}`, requestBody);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      let data: any;
      
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

      addLog("response", `Response ${response.status} ${response.statusText}`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: data,
      });

      if (!response.ok) {
        const errorMsg = data.message || data.error || `API Error: ${response.status}`;
        addLog("error", errorMsg, data);
        throw new Error(errorMsg);
      }

      setVideoId(data.video_id);
      addLog("info", `Video job created: ${data.video_id}`, data);
      setIsPolling(true);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to generate video";
      addLog("error", errorMsg, { error: err.toString(), stack: err.stack });
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Poll for status
  const checkStatus = async () => {
    if (!videoId) return;

    const url = `${API_URL}/${videoId}`;
    addLog("request", `GET ${url}`, null);

    try {
      const response = await fetch(url, {
        method: "GET",
      });

      const responseText = await response.text();
      let data: any;
      
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { raw: responseText };
      }

      addLog("response", `Response ${response.status} ${response.statusText}`, {
        status: response.status,
        statusText: response.statusText,
        body: data,
      });

      if (!response.ok) {
        const errorMsg = data.message || data.error || `Status check failed: ${response.status}`;
        addLog("error", errorMsg, data);
        throw new Error(errorMsg);
      }

      setVideoStatus(data);

      if (data.status === "success") {
        addLog("info", "Video generation completed successfully!", data);
        setIsPolling(false);
      } else if (data.status === "failed") {
        addLog("error", "Video generation failed", data);
        setIsPolling(false);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Failed to check status";
      addLog("error", errorMsg, { error: err.toString(), stack: err.stack });
      setError(errorMsg);
      setIsPolling(false);
    }
  };

  // Auto-poll when we have a video ID and are in polling mode
  useEffect(() => {
    if (!isPolling || !videoId) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 3000); // Poll every 3 seconds

    // Initial check
    checkStatus();

    return () => clearInterval(interval);
  }, [isPolling, videoId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Hera API Test</h1>
          <p className="text-muted-foreground mt-2">
            Test the Hera Motion Graphics Generation API
          </p>
        </div>

        {/* Input Form */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>Generate Motion Graphics</CardTitle>
            <CardDescription>
              Enter a prompt and configure output settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prompt */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the motion graphics you want..."
                className="bg-white/5 border-white/10"
              />
            </div>

            {/* Settings Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (s)</label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-white/5 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm"
                >
                  <option value="16:9">16:9</option>
                  <option value="9:16">9:16</option>
                  <option value="1:1">1:1</option>
                  <option value="4:3">4:3</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm"
                >
                  <option value="360p">360p</option>
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">FPS</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm"
                >
                  <option value="24">24</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isPolling || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Generate Video
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <strong>Error:</strong> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Card */}
        {videoId && (
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Video Status
                {videoStatus && getStatusIcon(videoStatus.status)}
              </CardTitle>
              <CardDescription>
                Video ID: <code className="text-xs bg-white/10 px-2 py-1 rounded">{videoId}</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Polling indicator */}
              {isPolling && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Polling for updates every 3 seconds...</span>
                </div>
              )}

              {/* Status info */}
              {videoStatus && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className={`font-medium ${
                      videoStatus.status === "success" ? "text-green-400" :
                      videoStatus.status === "failed" ? "text-red-400" : "text-yellow-400"
                    }`}>
                      {videoStatus.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Project URL */}
                  {videoStatus.project_url && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Project URL:</span>
                      <a 
                        href={videoStatus.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        View in Hera
                      </a>
                    </div>
                  )}

                  {/* Outputs */}
                  {videoStatus.outputs && videoStatus.outputs.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Outputs:</h4>
                      {videoStatus.outputs.map((output, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              {output.config.resolution} • {output.config.aspect_ratio} • {output.config.fps}fps
                            </span>
                            {getStatusIcon(output.status)}
                          </div>

                          {output.file_url && (
                            <div className="space-y-3">
                              {/* Video Preview */}
                              <video 
                                src={output.file_url} 
                                controls 
                                className="w-full rounded-lg"
                              />
                              
                              {/* Download Button */}
                              <a
                                href={output.file_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                                Download MP4
                              </a>
                            </div>
                          )}

                          {output.error && (
                            <div className="text-red-400 text-sm">
                              Error: {output.error}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Manual refresh button */}
              <Button
                variant="outline"
                onClick={checkStatus}
                disabled={isPolling}
                className="border-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
            </CardContent>
          </Card>
        )}

        {/* API Info */}
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p><strong>POST</strong> /v1/videos - Create generation job</p>
            <p><strong>GET</strong> /v1/videos/{"{video_id}"} - Check status</p>
            <p>Duration: 1-60 seconds</p>
            <p>Formats: mp4</p>
            <p>Resolutions: 360p, 720p, 1080p</p>
          </CardContent>
        </Card>

        {/* Debug Log Panel */}
        <Card className="glass border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              <CardTitle>Debug Logs</CardTitle>
              <span className="text-xs text-muted-foreground">({logs.length} entries)</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearLogs}
              className="border-white/10"
            >
              Clear Logs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="bg-black/50 rounded-lg p-4 max-h-[500px] overflow-y-auto font-mono text-xs space-y-2">
              {logs.length === 0 ? (
                <div className="text-muted-foreground italic">No logs yet. Make a request to see the debug output.</div>
              ) : (
                logs.map((log, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 rounded border-l-4 ${
                      log.type === "request" ? "border-blue-500 bg-blue-500/10" :
                      log.type === "response" ? "border-green-500 bg-green-500/10" :
                      log.type === "error" ? "border-red-500 bg-red-500/10" :
                      "border-yellow-500 bg-yellow-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold uppercase text-[10px] ${
                        log.type === "request" ? "text-blue-400" :
                        log.type === "response" ? "text-green-400" :
                        log.type === "error" ? "text-red-400" :
                        "text-yellow-400"
                      }`}>
                        [{log.type}]
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-white/90 mb-1">{log.message}</div>
                    {log.data && (
                      <pre className="text-[10px] text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all bg-black/30 p-2 rounded mt-1">
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
