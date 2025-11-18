"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, TrendingUp, Users, Settings, ExternalLink, Search, Target } from "lucide-react"
import { useBrandCampaignStore } from "@/lib/store"
import { AppTopbar } from "@/components/app-topbar"

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
    <div className="flex flex-1 flex-col">
      <AppTopbar />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-4 pt-4 max-w-6xl mx-auto w-full">
          {/* Campaign Context Banner */}
        {selectedCampaign && (
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-semibold text-sm">
                      {selectedBrand?.logo} {selectedBrand?.name} • {selectedCampaign.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tracking: {selectedCampaign.settings.searchKeywords.slice(0, 3).join(", ")}
                      {selectedCampaign.settings.searchKeywords.length > 3 && ` +${selectedCampaign.settings.searchKeywords.length - 3} more`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">
                    {selectedCampaign.settings.creatorsToTrack.length} creators
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    {selectedCampaign.settings.platforms.join(", ")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scraping Jobs Status Bar */}
        <Card className="border-l-4 border-l-green-400 bg-gradient-to-r from-green-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm font-medium">All jobs healthy</span>
                  <span className="text-xs text-muted-foreground">• Last run: 2 hours ago</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">📊 127 new items today</span>
                  <span className="text-muted-foreground ml-2">
                    (Twitter: 47, Reddit: 43, LinkedIn: 37)
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/discover/jobs">
                    <Settings className="w-4 h-4 mr-2" />
                    View Details →
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            <Card key={content.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-2">
                    {content.title}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${getPlatformColor(content.platform)} text-white text-xs`}
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
                  <Badge variant="outline" className="text-xs">
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
      </div>
    </div>
  )
}