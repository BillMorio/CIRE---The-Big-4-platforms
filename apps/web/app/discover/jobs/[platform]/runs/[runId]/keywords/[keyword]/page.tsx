"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hash, Eye, MessageSquare, Heart, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


// Mock scraped content data
const getKeywordResults = (platform: string, keyword: string, runId: string) => {
  const baseResults = [
    {
      id: "post_001",
      author: "",
      content: "",
      timestamp: "2 hours ago",
      engagement: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0,
      },
      url: "#",
      quality: "high" as const,
    },
  ];

  // Platform-specific content
  if (platform === "twitter") {
    return [
      {
        id: "tweet_001",
        author: "@james",
        content: `Just discovered this incredible AI automation tool that's literally saving me 4+ hours every single day. The productivity gains are mind-blowing when you combine it with proper workflow design and the right mindset. Thread 🧵`,
        timestamp: "2 hours ago",
        engagement: { views: 15420, likes: 342, comments: 28, shares: 15 },
        url: "https://twitter.com/james/status/123456",
        quality: "high" as const,
      },
      {
        id: "tweet_002", 
        author: "@ryanhol",
        content: `${keyword} is the future. Here's why every entrepreneur needs to understand this shift happening right now. Most people are sleeping on this opportunity...`,
        timestamp: "4 hours ago",
        engagement: { views: 8760, likes: 178, comments: 45, shares: 23 },
        url: "https://twitter.com/ryanhol/status/123457",
        quality: "medium" as const,
      },
    ];
  } else if (platform === "reddit") {
    return [
      {
        id: "reddit_001",
        author: "u/techexpert_42",
        content: `${keyword} discussion: Has anyone else noticed the massive improvements in ${keyword} tools lately? I've been testing several solutions and the results are incredible. Here's my detailed breakdown...`,
        timestamp: "3 hours ago",
        engagement: { views: 9870, likes: 234, comments: 67, shares: 12 },
        url: "https://reddit.com/r/programming/comments/abc123",
        quality: "high" as const,
      },
    ];
  } else if (platform === "linkedin") {
    return [
      {
        id: "linkedin_001",
        author: "Sarah Chen",
        content: `${keyword} is transforming how we work. After 6 months of implementation, here are the 5 key insights that every professional needs to know. The data doesn't lie - companies using these approaches are seeing 40% productivity increases...`,
        timestamp: "1 hour ago",
        engagement: { views: 5420, likes: 89, comments: 23, shares: 8 },
        url: "https://linkedin.com/posts/sarahchen",
        quality: "medium" as const,
      },
    ];
  } else if (platform === "youtube") {
    return [
      {
        id: "youtube_001", 
        author: "TechGuru Pro",
        content: `${keyword} Tutorial: Complete Guide for Beginners (2024) - In this comprehensive tutorial, I'll show you everything you need to know about ${keyword}. Perfect for beginners who want to get started today.`,
        timestamp: "6 hours ago",
        engagement: { views: 12340, likes: 456, comments: 89, shares: 34 },
        url: "https://youtube.com/watch?v=abc123",
        quality: "high" as const,
      },
    ];
  }

  return baseResults;
};

const getPlatformInfo = (platform: string) => {
  const platformMap = {
    twitter: { name: "Twitter", icon: "𝕏", color: "bg-black" },
    reddit: { name: "Reddit", icon: "r", color: "bg-orange-500" },
    linkedin: { name: "LinkedIn", icon: "in", color: "bg-blue-600" },
    youtube: { name: "YouTube", icon: "▶", color: "bg-red-600" },
  };
  return platformMap[platform as keyof typeof platformMap] || { name: platform, icon: "?", color: "bg-gray-500" };
};

const getQualityColor = (quality: string) => {
  const qualityMap = {
    high: "bg-green-100 text-green-800 border-green-300",
    medium: "bg-blue-100 text-blue-800 border-blue-300",
    low: "bg-gray-100 text-gray-800 border-gray-300",
  };
  return qualityMap[quality as keyof typeof qualityMap] || "bg-gray-100 text-gray-800 border-gray-300";
};

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

export default function KeywordResultsPage() {
  const params = useParams();
  const platform = params.platform as string;
  const runId = params.runId as string;
  const keyword = decodeURIComponent(params.keyword as string);
  
  const platformInfo = getPlatformInfo(platform);
  const results = getKeywordResults(platform, keyword, runId);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
              {platformInfo.icon}
            </div>
            <Hash className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold break-words">{keyword}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
              <span>Results from {platformInfo.name}</span>
              <span className="hidden sm:inline">•</span>
              <span>Run ID: {runId}</span>
              <span className="hidden sm:inline">•</span>
              <span>{results.length} posts found</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.map((post) => (
            <Card key={post.id} className="overflow-hidden bg-white dark:bg-gray-900 border dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {platformInfo.icon}
                    </div>
                    <div>
                      <div className="font-medium">{post.author}</div>
                      <div className="text-sm text-muted-foreground">{post.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getQualityColor(post.quality)}>
                      {post.quality} quality
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <a href={post.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <Badge variant="secondary" className="text-xs">
                      #{keyword}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{formatNumber(post.engagement.views)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.engagement.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.engagement.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      <span>{post.engagement.shares}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-900">Search Summary</h4>
                <p className="text-blue-800 text-sm">
                  Found {results.length} posts containing "{keyword}" from {platformInfo.name} during this scraping run.
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {results.reduce((sum, post) => sum + post.engagement.views, 0).toLocaleString()}
                </div>
                <div className="text-xs text-blue-700">Total Views</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}