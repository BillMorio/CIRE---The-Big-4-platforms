"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppTopbar } from "@/components/app-topbar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, LineChart, Line, AreaChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Hash, CheckCircle, AlertCircle, Clock } from "lucide-react"

const performanceData = [
  { name: "Mon", twitter: 45, reddit: 32, linkedin: 12, youtube: 18 },
  { name: "Tue", twitter: 52, reddit: 38, linkedin: 15, youtube: 22 },
  { name: "Wed", twitter: 48, reddit: 45, linkedin: 22, youtube: 25 },
  { name: "Thu", twitter: 61, reddit: 42, linkedin: 18, youtube: 31 },
  { name: "Fri", twitter: 55, reddit: 51, linkedin: 25, youtube: 28 },
  { name: "Sat", twitter: 67, reddit: 48, linkedin: 28, youtube: 35 },
  { name: "Sun", twitter: 72, reddit: 55, linkedin: 31, youtube: 42 },
]

const chartConfig = {
  twitter: {
    label: "Twitter",
    color: "hsl(var(--chart-1))",
  },
  reddit: {
    label: "Reddit",
    color: "hsl(var(--chart-2))",
  },
  linkedin: {
    label: "LinkedIn",
    color: "hsl(var(--chart-3))",
  },
  youtube: {
    label: "YouTube",
    color: "hsl(var(--chart-4))",
  },
}

export default function JobsAnalysisPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppTopbar />
      <div className="flex-1 overflow-auto bg-background">
        <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient pb-2">
              System Analytics
            </h1>
            <p className="technical-label text-sm opacity-60">Aggregate Diagnostic Insights // Multiple Node Connectivity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Results</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter text-white">12,482</div>
                <p className="technical-label mt-1 text-green-500/80">+12% VELOCITY</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Keywords Tracked</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter text-white">154</div>
                <p className="technical-label mt-1">Cross-Platform Nodes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Creators Monitored</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter text-white">842</div>
                <p className="technical-label mt-1 text-blue-400">92 ACTIVE PROXY_STREAMS</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black tracking-tighter text-white">98.2%</div>
                <p className="technical-label mt-1 text-green-500">SYSTEM_NOMINAL // 4/4 ONLINE</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Daily Scraping Volume</CardTitle>
                <CardDescription>Number of results found per platform over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer config={chartConfig}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-twitter)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-twitter)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}`}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="twitter" 
                      stroke="var(--color-twitter)" 
                      fillOpacity={1} 
                      fill="url(#colorTwitter)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reddit" 
                      stroke="var(--color-reddit)" 
                      fillOpacity={1} 
                      fill="transparent" 
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Share of total leads generated this month.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ChartContainer config={chartConfig}>
                  <BarChart data={performanceData.slice(-1)}>
                     <CartesianGrid vertical={false} />
                     <XAxis dataKey="name" hide />
                     <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                     <Bar dataKey="twitter" fill="var(--color-twitter)" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="reddit" fill="var(--color-reddit)" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="linkedin" fill="var(--color-linkedin)" radius={[4, 4, 0, 0]} />
                     <Bar dataKey="youtube" fill="var(--color-youtube)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[var(--color-twitter)]" />
                       Twitter
                    </div>
                    <div className="text-xl font-bold">45.2%</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[var(--color-reddit)]" />
                       Reddit
                    </div>
                    <div className="text-xl font-bold">32.8%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Activity Status</CardTitle>
              <CardDescription>Last run status and health of individual scrapers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Twitter", status: "active", lastRun: "2h ago", health: 95, icon: "𝕏" },
                  { name: "Reddit", status: "active", lastRun: "1h ago", health: 100, icon: "r" },
                  { name: "LinkedIn", status: "error", lastRun: "FAILED", health: 85, icon: "in" },
                  { name: "YouTube", status: "active", lastRun: "30m ago", health: 90, icon: "▶" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">{s.icon}</div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-sm text-muted-foreground">Last run: {s.lastRun}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-medium">Health</div>
                        <div className={`text-sm ${s.health >= 95 ? 'text-green-500' : 'text-yellow-500'}`}>{s.health}%</div>
                      </div>
                      <Badge variant={s.status === 'active' ? 'default' : 'destructive'}>
                        {s.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
