"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { columns } from "./columns";
import type { YouTubeVideo } from "./columns";
import { DataCards } from "./data-cards";

// Mock data for YouTube search results
const mockSearchResults: YouTubeVideo[] = [
  {
    id: "1",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoId: "dQw4w9WgXcQ",
    title: "How to Build AI Apps That Actually Scale - Complete Tutorial 2024",
    description: "Learn how to build production-ready AI applications that can handle millions of users. This comprehensive tutorial covers everything from model deployment to infrastructure scaling...",
    thumbnail: {
      default: "/api/placeholder/120/90",
      medium: "/api/placeholder/320/180",
      high: "/api/placeholder/480/360",
    },
    channel: {
      name: "TechGuru Pro",
      channelUrl: "https://www.youtube.com/@TechGuruPro",
      avatar: "/api/placeholder/40/40",
      subscribers: 2400000,
      verified: true,
    },
    duration: "14:32",
    durationSeconds: 872,
    metrics: {
      views: 1240000,
      likes: 45600,
      comments: 3200,
      shares: 1200,
      engagementRate: 4.2,
    },
    publishedAt: "11/01/2025",
    viralityScore: 92,
    isTrending: true,
    category: "Technology",
    tags: ["AI", "Programming", "Tutorial", "Scale"],
    quality: "4K",
  },
  {
    id: "2",
    videoUrl: "https://www.youtube.com/watch?v=abc123def",
    videoId: "abc123def",
    title: "The Future of AI: What Nobody Talks About",
    description: "An eye-opening discussion about the hidden aspects of AI development that most people don't know about. Industry experts share their insights...",
    thumbnail: {
      default: "/api/placeholder/120/90",
      medium: "/api/placeholder/320/180",
      high: "/api/placeholder/480/360",
    },
    channel: {
      name: "AI Insights Daily",
      channelUrl: "https://www.youtube.com/@AIInsightsDaily",
      avatar: "/api/placeholder/40/40",
      subscribers: 890000,
      verified: true,
    },
    duration: "22:15",
    durationSeconds: 1335,
    metrics: {
      views: 650000,
      likes: 28900,
      comments: 2100,
      shares: 850,
      engagementRate: 4.8,
    },
    publishedAt: "10/30/2025",
    viralityScore: 87,
    isTrending: true,
    category: "Education",
    tags: ["AI", "Future", "Technology", "Innovation"],
    quality: "HD",
  },
  {
    id: "3",
    videoUrl: "https://www.youtube.com/watch?v=xyz789ghi",
    videoId: "xyz789ghi",
    title: "I Built an AI Startup in 30 Days - Here's What Happened",
    description: "Follow my journey building an AI startup from scratch in just 30 days. From idea to MVP to first customers - everything is documented...",
    thumbnail: {
      default: "/api/placeholder/120/90",
      medium: "/api/placeholder/320/180",
      high: "/api/placeholder/480/360",
    },
    channel: {
      name: "Startup Journey",
      channelUrl: "https://www.youtube.com/@StartupJourney",
      avatar: "/api/placeholder/40/40",
      subscribers: 1200000,
      verified: true,
    },
    duration: "18:47",
    durationSeconds: 1127,
    metrics: {
      views: 980000,
      likes: 52300,
      comments: 4500,
      shares: 2100,
      engagementRate: 6.1,
    },
    publishedAt: "10/28/2025",
    viralityScore: 95,
    isTrending: true,
    category: "Business",
    tags: ["Startup", "AI", "Entrepreneurship", "MVP"],
    quality: "4K",
  },
  {
    id: "4",
    videoUrl: "https://www.youtube.com/watch?v=def456abc",
    videoId: "def456abc",
    title: "AI Coding Assistant vs Human Developer: Speed Test Challenge",
    description: "We put AI coding assistants to the ultimate test against experienced developers. The results will surprise you...",
    thumbnail: {
      default: "/api/placeholder/120/90",
      medium: "/api/placeholder/320/180",
      high: "/api/placeholder/480/360",
    },
    channel: {
      name: "Code Challenge Pro",
      channelUrl: "https://www.youtube.com/@CodeChallengePro",
      avatar: "/api/placeholder/40/40",
      subscribers: 750000,
      verified: false,
    },
    duration: "12:23",
    durationSeconds: 743,
    metrics: {
      views: 420000,
      likes: 19800,
      comments: 1850,
      shares: 650,
      engagementRate: 5.3,
    },
    publishedAt: "10/26/2025",
    viralityScore: 78,
    isTrending: false,
    category: "Technology",
    tags: ["Coding", "AI", "Challenge", "Programming"],
    quality: "HD",
  },
];

export default function YouTubeSearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchId = params.searchId as string;

  // In a real app, you would decode this from the searchId
  const mockQuery = "AI programming tutorials";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{mockQuery}</h1>
      </div>

      {/* Query Details Section */}
      <Card className="w-auto max-w-md shadow-none glass-youtube">
        <CardContent className="p-4">
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="text-muted-foreground w-20">Search:</span>
              <span className="font-medium">{mockQuery}</span>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Max Videos:</span>
              <span className="font-medium">50</span>
            </div>
            <div className="flex">
              <span className="technical-label w-24">Status:</span>
              <Badge
                variant="secondary"
                className="bg-red-500/10 text-red-500 border border-red-500/20 technical-label opacity-100 px-2 py-0"
              >
                ⚠ FAILED
              </Badge>
            </div>
            <div className="flex">
              <span className="technical-label w-24">Error:</span>
              <span className="text-red-500 technical-label opacity-100">API_QUOTA_EXCEEDED</span>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Duration:</span>
              <Badge
                variant="outline"
                className="text-xs bg-gray-100/50 backdrop-blur-sm border-2 border-gray-300/50"
              >
                Any Duration
              </Badge>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Platform:</span>
              <Badge className="bg-red-600 text-xs text-white">YouTube</Badge>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Status:</span>
              <Badge
                variant="secondary"
                className="bg-green-50 text-green-700 text-xs"
              >
                ✓ Completed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section with Data Cards */}
      <DataCards columns={columns} data={mockSearchResults} />
    </div>
  );
}