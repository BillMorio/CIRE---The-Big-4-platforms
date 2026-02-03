"use client";

import Link from "next/link";
import { 
  ArrowLeft, Cpu, Bot, Code2, 
  Repeat, Box, Zap, Sparkles, 
  ArrowRight, ShieldCheck, Database, 
  MessageSquare, Layers, Settings2,
  AlertCircle, Workflow, Terminal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AgentArchitecturePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-500/30">
      {/* Sidebar-style Nav (Floating) */}
      <div className="fixed top-8 left-8 z-50">
        <Link 
          href="/playground" 
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background/80 backdrop-blur-md hover:bg-muted transition-all shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Back to Hub</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Hero Section */}
        <header className="space-y-6 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Technical Specification</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
            AI Agent Architecture
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comprehensive guide to building autonomous systems that bridge the gap between high-level human intent and low-level code execution.
          </p>
        </header>

        {/* 1. Global Orchestration Flow */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Layers className="w-6 h-6 text-indigo-500" />
              1. Global Orchestration Flow
            </h2>
            <p className="text-muted-foreground">The high-level path of data from user request to final execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* User */}
            <Card className="bg-background border-border shadow-sm text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 text-orange-500" />
              </div>
              <div className="font-bold text-sm">User</div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-tight">NATURAL LANGUAGE INPUT</p>
            </Card>

            <div className="hidden md:flex justify-center text-muted-foreground">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            {/* Orchestrator */}
            <Card className="bg-indigo-500/5 border-indigo-500/20 shadow-lg text-center p-6 space-y-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mx-auto relative z-10">
                <Bot className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="font-bold text-sm relative z-10">Orchestrator</div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-tight relative z-10">LLM (REASONING ENGINE)</p>
            </Card>

            <div className="hidden md:flex justify-center text-muted-foreground">
              <ArrowRight className="w-6 h-6 animate-pulse" />
            </div>

            {/* Tools */}
            <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                <Settings2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="font-bold text-sm">Tool Executor</div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-tight">CODE / API EXECUTION</p>
            </Card>
          </div>
        </section>

        {/* 2. The Tool-Calling Lifecycle */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Repeat className="w-6 h-6 text-indigo-500" />
              2. The Tool-Calling Lifecycle
            </h2>
            <p className="text-muted-foreground">How the LLM communicates with your backend via JSON.</p>
          </div>

          <Card className="overflow-hidden border-border bg-muted/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
              {/* Request */}
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">AGENT OUTPUT</Badge>
                  <code className="text-[10px] text-muted-foreground">role: assistant</code>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                    <Terminal className="w-3 h-3" /> Tool Call (JSON)
                  </h4>
                  <pre className="p-4 rounded-lg bg-black text-xs font-mono text-blue-400 overflow-x-auto ring-1 ring-white/10 shadow-inner">
{`{
  "name": "search_videos",
  "arguments": {
    "query": "ocean waves",
    "orientation": "landscape"
  }
}`}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The LLM doesn't "run" the function. It returns a specific JSON object expressing its <strong>intent</strong> to run a function.
                </p>
              </div>

              {/* Execution */}
              <div className="p-8 space-y-4 bg-muted/20">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">SYSTEM RESPONSE</Badge>
                  <code className="text-[10px] text-muted-foreground">role: tool</code>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                    <Workflow className="w-3 h-3" /> Tool Result (JSON)
                  </h4>
                  <pre className="p-4 rounded-lg bg-black text-xs font-mono text-emerald-400 overflow-x-auto ring-1 ring-white/10 shadow-inner">
{`{
  "status": "success",
  "data": {
    "url": "https://pexels.com/v/123",
    "duration": 12.5
  }
}`}
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your code executes the API call (Pexels, FFmpeg) and feeds the raw results back to the LLM's conversation history.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Context Window Management */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Database className="w-6 h-6 text-indigo-500" />
              3. Context Window Management
            </h2>
            <p className="text-muted-foreground">Agents have limited memory. Efficiently managing history is critical.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-gradient-to-br from-background to-indigo-500/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-400">Memory Pruning</CardTitle>
                <CardDescription>Discarding old or irrelevant data to keep costs down and focus high.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[80%] animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground uppercase">
                      <span>LLM Token Limit</span>
                      <span>128k Tokens</span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Summarizing older tool results
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Dropping intermediate reasoning logs
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Prioritizing system instructions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-gradient-to-br from-background to-emerald-500/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-400">Resilience Patterns</CardTitle>
                <CardDescription>How agents recover from API failures or invalid tool calls.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <div className="text-xs">
                      <p className="font-bold text-red-400">Error Hooked!</p>
                      <p className="text-muted-foreground italic">"Pexels API Key invalid. Please check env."</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instead of crashing, the error is fed back to the LLM. The agent can then:
                    <br />1. Explain the issue to the user
                    <br />2. Try a different tool
                    <br />3. Adjust its parameters and retry
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 4. Video Editor Orchestration: A Deep Dive */}
        <section className="space-y-8 pb-20">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              4. Video Editor Orchestration
            </h2>
            <p className="text-muted-foreground">Mapping a complex user request to a sequence of autonomous actions.</p>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_50px_-12px_rgba(99,102,241,0.25)]">
              <p className="text-xl font-medium italic text-indigo-400">
                "Find me a dramatic 5s landscape shot of a mountain and add a subtle zoom."
              </p>
            </div>

            <div className="relative space-y-12 pt-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-border before:to-transparent">
              
              {/* Step 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-500 bg-background text-indigo-500 shadow-xl z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-border bg-background shadow-md hover:border-indigo-500/50 transition-colors">
                  <h4 className="font-bold text-sm mb-1">Search Phase</h4>
                  <p className="text-xs text-muted-foreground mb-3">Agent searches Pexels for "dramatic mountain".</p>
                  <code className="block p-2 rounded bg-muted/50 text-[10px] font-mono text-indigo-400">pexels.search(&#123; q: "dramatic mountain", orientation: "landscape" &#125;)</code>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-500 bg-background text-indigo-500 shadow-xl z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-border bg-background shadow-md hover:border-indigo-500/50 transition-colors">
                  <h4 className="font-bold text-sm mb-1">Duration Clipping</h4>
                  <p className="text-xs text-muted-foreground mb-3">Agent trims the result to exactly 5 seconds.</p>
                  <code className="block p-2 rounded bg-muted/50 text-[10px] font-mono text-indigo-400">ffmpeg.trim(&#123; input: "vid_id", end: 5 &#125;)</code>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-500 bg-background text-indigo-500 shadow-xl z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-border bg-background shadow-md hover:border-indigo-500/50 transition-colors">
                  <h4 className="font-bold text-sm mb-1">Visual Polish</h4>
                  <p className="text-xs text-muted-foreground mb-3">Agent applies a 1x to 1.15x zoom over 5 seconds.</p>
                  <code className="block p-2 rounded bg-muted/50 text-[10px] font-mono text-indigo-400">ffmpeg.zoom(&#123; start: 1, end: 1.15 &#125;)</code>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-500 bg-background text-indigo-500 shadow-xl z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 transition-transform">
                  4
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[45%] p-4 rounded-xl border border-border bg-background shadow-md hover:border-indigo-500/50 transition-colors">
                  <h4 className="font-bold text-sm mb-1">Final Insertion</h4>
                  <p className="text-xs text-muted-foreground mb-3">The processed asset is added to the scene's B-ROLL slot.</p>
                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wider">Scene Index Updated</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer/CTA */}
        <footer className="pt-20 border-t border-border flex flex-col items-center gap-6">
          <div className="text-center space-y-2">
            <h3 className="font-bold">Next Phase: Implementation</h3>
            <p className="text-sm text-muted-foreground">Ready to turn these diagrams into code?</p>
          </div>
          <div className="flex gap-4">
             <Link 
              href="/playground/openai"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-current" />
              Build Test Agent
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
