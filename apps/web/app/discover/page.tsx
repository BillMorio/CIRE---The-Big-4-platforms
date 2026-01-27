"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, TrendingUp, Users, Settings, ExternalLink, Search, Target } from "lucide-react"
import { useBrandCampaignStore } from "@/lib/store"
import { cn } from "@/lib/utils"

// Mock data for demonstration
const scrapingStatus = {
  activeJobs: 4,
  lastRun: "2 hours ago",
  nextRun: "in 30 minutes",
  status: "running" as "running" | "idle" | "error"
}

const mockContent = [
  {
    id: 1,
    title: "How I Built a $1M SaaS in 12 Months",
    snippet: "Starting from zero with no technical background, here's exactly what I did to build and scale my SaaS to $1M ARR...",
    platform: "Reddit",
    author: "u/saasfounder",
    engagement: { upvotes: 2400, comments: 312 },
    performance_score: 95,
    scraped_at: "3 hours ago"
  },
  {
    id: 2,
    title: "The Psychology Behind Viral LinkedIn Posts",
    snippet: "After analyzing 10,000+ LinkedIn posts, I discovered these 5 patterns that make content go viral...",
    platform: "LinkedIn",
    author: "Sarah Chen",
    engagement: { likes: 8500, comments: 423, shares: 156 },
    performance_score: 89,
    scraped_at: "5 hours ago"
  },
  {
    id: 3,
    title: "Why Most Startups Fail (And How to Avoid It)",
    snippet: "Having witnessed 100+ startup failures firsthand as a VC, here are the top 3 mistakes that kill companies...",
    platform: "Twitter",
    author: "@vcinsights",
    engagement: { retweets: 1200, likes: 4300, replies: 89 },
    performance_score: 87,
    scraped_at: "1 hour ago"
  }
]

export default function DiscoverPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("trending")
  const { selectedBrand, selectedCampaign } = useBrandCampaignStore()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500"
      case "error": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Reddit": return "bg-orange-500"
      case "Twitter": return "bg-blue-500"
      case "LinkedIn": return "bg-blue-600"
      case "YouTube": return "bg-red-600"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-4 max-w-6xl mx-auto w-full">
          {/* Campaign Context Banner */}
        {selectedCampaign && (
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-black text-sm tracking-tight">
                      {selectedBrand?.logo} {selectedBrand?.name} / {selectedCampaign.name}
                    </div>
                    <div className="technical-label mt-0.5">
                      TRACKING: {selectedCampaign.settings.searchKeywords.slice(0, 3).join(", ")}
                      {selectedCampaign.settings.searchKeywords.length > 3 && ` +${selectedCampaign.settings.searchKeywords.length - 3} more`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">
                    {selectedCampaign.settings.creatorsToTrack.length} Nodes
                  </Badge>
                  <Badge variant="outline">
                    {selectedCampaign.settings.platforms.join(", ")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scraping Jobs Status Bar */}
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow" />
                  <span className="technical-label text-green-500 opacity-100">SYSTEM_NOMINAL</span>
                  <span className="technical-label opacity-40">• Last run: 2 hours ago</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="text-sm technical-label opacity-60">
                  <span className="font-black">127 NEW_ENTRIES</span>
                  <span className="ml-2">
                    (TWTR: 47, RDIT: 43, LNKD: 37)
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild className="rounded-lg h-8 px-3 w-full sm:w-auto">
                  <Link href="/scrapers">
                    <Settings className="w-3 h-3 mr-2" />
                    Diagnostics →
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="reddit">Reddit</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="engagement">Top Engagement</SelectItem>
                <SelectItem value="performance">Performance Score</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/discover/search">
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Manual Search
              </Button>
            </Link>
            <div className="text-sm text-muted-foreground">
              {mockContent.length} results found
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockContent.map((content) => (
            <Card 
              key={content.id} 
              className={cn(
                "transition-all duration-300",
                content.platform === "Reddit" && "glass-reddit border-orange-500/10 hover:border-orange-500/20",
                content.platform === "Twitter" && "glass-twitter border-blue-400/10 hover:border-blue-400/20",
                content.platform === "LinkedIn" && "glass-linkedin border-blue-600/10 hover:border-blue-600/20",
                content.platform === "YouTube" && "glass-youtube border-red-600/10 hover:border-red-600/20"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-2">
                    {content.title}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={getPlatformColor(content.platform)}
                  >
                    {content.platform}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {content.snippet}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <span>by {content.author}</span>
                  <span>{content.scraped_at}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {content.platform === "Reddit" && `${content.engagement.upvotes} upvotes`}
                      {content.platform === "LinkedIn" && `${content.engagement.likes} likes`}
                      {content.platform === "Twitter" && `${content.engagement.likes} likes`}
                    </div>
                  </div>
                  <Badge variant="outline">
                    Score: {content.performance_score}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Use This
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
  )
}