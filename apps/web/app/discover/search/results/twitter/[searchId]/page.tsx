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
import type { Tweet } from "./columns";
import { DataCards } from "./data-cards";

// Mock data for Twitter search results
const mockSearchResults: Tweet[] = [
  {
    id: "1",
    tweetUrl: "https://twitter.com/user1/status/123456789",
    content: "Just shipped our new AI-powered feature that automatically generates viral content ideas. 10x productivity boost for content creators! 🚀",
    fullContent: "Just shipped our new AI-powered feature that automatically generates viral content ideas. 10x productivity boost for content creators! 🚀 #AI #ContentCreation #Productivity",
    author: {
      username: "tech_founder",
      displayName: "Sarah Chen",
      avatar: "/api/placeholder/32/32",
      followers: 124000,
      verified: true,
      blueCheckmark: false,
    },
    tweetType: "text",
    metrics: {
      views: 450000,
      likes: 8900,
      retweets: 2100,
      quotes: 450,
      replies: 380,
      bookmarks: 1200,
      engagementRate: 2.8,
    },
    postedAt: "2h",
    viralityScore: 94,
    isTrending: true,
    hashtags: ["AI", "ContentCreation", "Productivity"],
    mentions: [],
    isReply: false,
  },
  {
    id: "2",
    tweetUrl: "https://twitter.com/user2/status/234567890",
    content: "Thread 🧵 on how I grew my startup from 0 to $1M ARR in 12 months without any VC funding. Here's what I learned:",
    fullContent: "Thread 🧵 on how I grew my startup from 0 to $1M ARR in 12 months without any VC funding. Here's what I learned: 1/ Focus on one problem 2/ Build in public 3/ Customer obsession...",
    author: {
      username: "startup_builder",
      displayName: "Marcus Johnson",
      avatar: "/api/placeholder/32/32",
      followers: 89000,
      verified: false,
      blueCheckmark: true,
    },
    tweetType: "thread",
    metrics: {
      views: 320000,
      likes: 12400,
      retweets: 3200,
      quotes: 890,
      replies: 540,
      bookmarks: 2800,
      engagementRate: 5.2,
    },
    postedAt: "4h",
    viralityScore: 96,
    isTrending: true,
    hashtags: ["startup", "entrepreneur", "buildinpublic"],
    mentions: [],
    isReply: false,
    threadId: "thread_123",
  },
  {
    id: "3",
    tweetUrl: "https://twitter.com/user3/status/345678901",
    content: "The biggest mistake I see developers make when learning AI: focusing too much on theory, not enough on building. Start with projects, learn concepts as you need them.",
    fullContent: "The biggest mistake I see developers make when learning AI: focusing too much on theory, not enough on building. Start with projects, learn concepts as you need them. Here are 5 beginner-friendly AI projects to get started...",
    author: {
      username: "ai_educator",
      displayName: "Dr. Amanda Foster",
      avatar: "/api/placeholder/32/32",
      followers: 156000,
      verified: true,
      blueCheckmark: false,
    },
    tweetType: "text",
    media: [
      {
        type: "image",
        url: "/api/placeholder/400/300",
        thumbnail: "/api/placeholder/400/300",
      },
    ],
    metrics: {
      views: 280000,
      likes: 6700,
      retweets: 1400,
      quotes: 320,
      replies: 290,
      bookmarks: 980,
      engagementRate: 3.4,
    },
    postedAt: "6h",
    viralityScore: 87,
    isTrending: true,
    hashtags: ["AI", "MachineLearning", "Developer"],
    mentions: [],
    isReply: false,
  },
  {
    id: "4",
    tweetUrl: "https://twitter.com/user4/status/456789012",
    content: "POV: You're explaining to your non-tech friends what you do as a software engineer 😅",
    fullContent: "POV: You're explaining to your non-tech friends what you do as a software engineer 😅 *gestures wildly while talking about APIs and databases*",
    author: {
      username: "dev_memes",
      displayName: "Code Comedian",
      avatar: "/api/placeholder/32/32",
      followers: 67000,
      verified: false,
      blueCheckmark: false,
    },
    tweetType: "video",
    media: [
      {
        type: "video",
        url: "/api/placeholder/400/300",
        thumbnail: "/api/placeholder/400/300",
      },
    ],
    metrics: {
      views: 890000,
      likes: 18900,
      retweets: 4200,
      quotes: 750,
      replies: 680,
      bookmarks: 1500,
      engagementRate: 2.9,
    },
    postedAt: "8h",
    viralityScore: 92,
    isTrending: true,
    hashtags: ["developer", "programming", "meme"],
    mentions: [],
    isReply: false,
  },
];

export default function TwitterSearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchId = params.searchId as string;

  // In a real app, you would decode this from the searchId
  const mockQuery = "#AI #productivity #startup";

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/discover">Discover</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/discover/search">Manual Search</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Twitter Results</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto px-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">{mockQuery}</h1>
        </div>

      {/* Query Details Section */}
      <Card className="w-auto max-w-md shadow-none">
        <CardContent className="p-4">
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="text-muted-foreground w-20">Search:</span>
              <span className="font-medium">{mockQuery}</span>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Max Posts:</span>
              <span className="font-medium">100</span>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Accounts:</span>
              <Badge
                variant="outline"
                className="text-xs bg-sky-100 text-sky-700 border-sky-300"
              >
                All Accounts
              </Badge>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Platform:</span>
              <Badge className="bg-black text-xs text-white">Twitter/X</Badge>
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
  </SidebarInset>
);
}