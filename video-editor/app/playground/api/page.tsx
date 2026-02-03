"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Server, Play, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type RequestStatus = "idle" | "loading" | "success" | "error";

interface ApiTest {
  name: string;
  endpoint: string;
  method: "GET" | "POST";
  status: RequestStatus;
  response?: string;
}

export default function APIPlaygroundPage() {
  const [customUrl, setCustomUrl] = useState("http://localhost:3333/health");
  const [customResponse, setCustomResponse] = useState<string | null>(null);
  const [customStatus, setCustomStatus] = useState<RequestStatus>("idle");

  const [tests, setTests] = useState<ApiTest[]>([
    { name: "FFmpeg Health Check", endpoint: "http://localhost:3333/health", method: "GET", status: "idle" },
    { name: "FFmpeg Probe", endpoint: "http://localhost:3333/api/probe", method: "POST", status: "idle" },
  ]);

  const runTest = async (index: number) => {
    const test = tests[index];
    setTests(prev => prev.map((t, i) => i === index ? { ...t, status: "loading" as RequestStatus } : t));
    
    try {
      const res = await fetch(test.endpoint, { method: test.method });
      const data = await res.text();
      setTests(prev => prev.map((t, i) => 
        i === index ? { ...t, status: "success" as RequestStatus, response: data.slice(0, 200) } : t
      ));
    } catch (err) {
      setTests(prev => prev.map((t, i) => 
        i === index ? { ...t, status: "error" as RequestStatus, response: String(err) } : t
      ));
    }
  };

  const runCustomTest = async () => {
    setCustomStatus("loading");
    try {
      const res = await fetch(customUrl);
      const data = await res.text();
      setCustomResponse(data.slice(0, 500));
      setCustomStatus("success");
    } catch (err) {
      setCustomResponse(String(err));
      setCustomStatus("error");
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case "loading": return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case "success": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/playground" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Server className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">API Tests</h1>
            <p className="text-xs text-muted-foreground technical-label uppercase tracking-widest">
              Test API endpoints and integrations
            </p>
          </div>
        </div>

        {/* Predefined Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm technical-label uppercase tracking-widest">Predefined Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tests.map((test, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <p className="font-medium text-sm">{test.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{test.method} {test.endpoint}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => runTest(i)} disabled={test.status === "loading"}>
                  <Play className="w-3 h-3 mr-1" /> Run
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Custom Request */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm technical-label uppercase tracking-widest">Custom Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input 
                value={customUrl} 
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Enter URL..."
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={runCustomTest} disabled={customStatus === "loading"}>
                {customStatus === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            
            {customResponse && (
              <div className={`p-3 rounded-lg border ${customStatus === "success" ? "bg-green-500/5 border-green-500/30" : "bg-red-500/5 border-red-500/30"}`}>
                <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto">{customResponse}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
