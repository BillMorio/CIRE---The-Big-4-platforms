"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Eye, MessageSquare, Heart, Share2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";


// Mock scraped content data
const getCreatorResults = (platform: string, creator: string, runId: string) => {
  const baseResults = [
    {
      id: "post_001",
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
      topics: [] as string[],
    },
  ];

  // Platform-specific content
  if (platform === "twitter" && creator === "@james") {
    return [
      {
        id: "tweet_001",
        content: `Just discovered this incredible AI automation tool that's literally saving me 4+ hours every single day. The productivity gains are mind-blowing when you combine it with proper workflow design and the right mindset. Thread 🧵`,
        timestamp: "2 hours ago",
        engagement: { views: 15420, likes: 342, comments: 28, shares: 15 },
        url: "https://twitter.com/james/status/123456",
        quality: "high" as const,
        topics: ["AI automation", "productivity"],
      },
      {
        id: "tweet_002", 
        content: `Building in public day 47: Revenue hit $12k MRR last month. Here's the exact breakdown of what's working and what isn't. The data might surprise you...`,
        timestamp: "1 day ago",
        engagement: { views: 8760, likes: 178, comments: 45, shares: 23 },
        url: "https://twitter.com/james/status/123455",
        quality: "medium" as const,
        topics: ["startup", "revenue"],
      },
    ];
  } else if (platform === "reddit" && creator === "r/programming") {
    return [
      {
        id: "reddit_001",
        content: `[Discussion] Machine learning model deployment strategies - what's actually working in production in 2024? Looking for real-world examples and lessons learned from teams who've scaled beyond proof-of-concept.`,
        timestamp: "3 hours ago",
        engagement: { views: 9870, likes: 234, comments: 67, shares: 12 },
        url: "https://reddit.com/r/programming/comments/abc123",
        quality: "high" as const,
        topics: ["machine learning", "deployment"],
      },
    ];
  } else if (platform === "linkedin" && creator === "Sarah Chen") {
    return [
      {
        id: "linkedin_001",
        content: `Remote work productivity has evolved significantly in 2024. After leading distributed teams for 3 years, here are the 5 AI-powered tools that are genuinely transforming how we collaborate and maintain high performance standards...`,
        timestamp: "1 hour ago",
        engagement: { views: 5420, likes: 89, comments: 23, shares: 8 },
        url: "https://linkedin.com/posts/sarahchen",
        quality: "medium" as const,
        topics: ["remote work", "AI tools", "leadership"],
      },
    ];
  } else if (platform === "youtube" && creator === "TechGuru Pro") {
    return [
      {
        id: "youtube_001", 
        content: `AI Automation for Beginners: Complete 2024 Guide - In this comprehensive tutorial, I'll walk you through setting up your first AI automation workflow. Perfect for complete beginners who want practical results today.`,
        timestamp: "6 hours ago",
        engagement: { views: 12340, likes: 456, comments: 89, shares: 34 },
        url: "https://youtube.com/watch?v=abc123",
        quality: "high" as const,
        topics: ["AI automation", "tutorial"],
      },
    ];
  }

  return baseResults;
};

const getPlatformInfo = (platform: string) => {
  const platformMap = {
    twitter: { name: "Twitter", icon: "𝕏", color: "bg-black", sourceLabel: "Creator" },
    reddit: { name: "Reddit", icon: "r", color: "bg-orange-500", sourceLabel: "Subreddit" },
    linkedin: { name: "LinkedIn", icon: "in", color: "bg-blue-600", sourceLabel: "Profile" },
    youtube: { name: "YouTube", icon: "▶", color: "bg-red-600", sourceLabel: "Channel" },
  };
  return platformMap[platform as keyof typeof platformMap] || { name: platform, icon: "?", color: "bg-gray-500", sourceLabel: "Source" };
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

const getCreatorInitials = (name: string) => {
  if (name.startsWith("@")) return name.slice(1, 3).toUpperCase();
  if (name.startsWith("r/")) return "R";
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export default function CreatorResultsPage() {
  const params = useParams();
  const platform = params.platform as string;
  const runId = params.runId as string;
  const creator = decodeURIComponent(params.creator as string);
  
  const platformInfo = getPlatformInfo(platform);
  const results = getCreatorResults(platform, creator, runId);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={`${platformInfo.color} text-white text-sm font-bold`}>
                {getCreatorInitials(creator)}
              </AvatarFallback>
            </Avatar>
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold break-words">{creator}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
              <span>{platformInfo.sourceLabel} from {platformInfo.name}</span>
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
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`${platformInfo.color} text-white text-sm font-bold`}>
                        {getCreatorInitials(creator)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{creator}</div>
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
                  <div className="flex flex-wrap gap-2">
                    {post.topics.map((topic, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
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
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-purple-900">{platformInfo.sourceLabel} Summary</h4>
                <p className="text-purple-800 text-sm">
                  Found {results.length} posts from {creator} during this scraping run.
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-purple-600">
                  {results.reduce((sum, post) => sum + post.engagement.views, 0).toLocaleString()}
                </div>
                <div className="text-xs text-purple-700">Total Views</div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}