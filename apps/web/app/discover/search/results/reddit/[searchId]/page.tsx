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
import type { RedditPost } from "./columns";
import { DataCards } from "./data-cards";

// Mock data for Reddit search results
const mockSearchResults: RedditPost[] = [
  {
    id: "1",
    postUrl: "https://www.reddit.com/r/MachineLearning/comments/abc123/",
    title: "I built an AI that can predict startup success with 85% accuracy - Here's what I learned",
    content: "After 6 months of development and testing on 10,000 startups, I've created an ML model that predicts startup success. The key features are surprisingly simple...",
    fullContent: "After 6 months of development and testing on 10,000 startups, I've created an ML model that predicts startup success. The key features are surprisingly simple: team composition, market timing, and initial user feedback patterns. Here's the full breakdown...",
    subreddit: "MachineLearning",
    subredditUrl: "https://www.reddit.com/r/MachineLearning/",
    author: {
      username: "ai_researcher_2024",
      avatar: "/api/placeholder/32/32",
      karma: 15420,
      accountAge: "3 years",
    },
    postType: "text",
    metrics: {
      upvotes: 4200,
      downvotes: 180,
      score: 4020,
      upvoteRatio: 0.96,
      comments: 387,
      awards: 12,
      engagementRate: 9.2,
    },
    postedAt: "2 hours ago",
    viralityScore: 94,
    isTrending: true,
    flair: "Research",
    isStickied: false,
    isLocked: false,
  },
  {
    id: "2",
    postUrl: "https://www.reddit.com/r/programming/comments/def456/",
    title: "Why I switched from React to Vue and never looked back",
    content: "After 5 years of React development, I made the switch to Vue 3 and my productivity skyrocketed. Here's why...",
    fullContent: "After 5 years of React development, I made the switch to Vue 3 and my productivity skyrocketed. The composition API, better TypeScript support, and simpler state management made development so much more enjoyable...",
    subreddit: "programming",
    subredditUrl: "https://www.reddit.com/r/programming/",
    author: {
      username: "frontend_dev_pro",
      avatar: "/api/placeholder/32/32",
      karma: 8920,
      accountAge: "2 years",
    },
    postType: "text",
    metrics: {
      upvotes: 2840,
      downvotes: 520,
      score: 2320,
      upvoteRatio: 0.85,
      comments: 156,
      awards: 3,
      engagementRate: 6.7,
    },
    postedAt: "4 hours ago",
    viralityScore: 78,
    isTrending: true,
    flair: "Discussion",
    isStickied: false,
    isLocked: false,
  },
  {
    id: "3",
    postUrl: "https://www.reddit.com/r/entrepreneur/comments/ghi789/",
    title: "From $0 to $100k ARR in 8 months with no funding - Complete breakdown",
    content: "I bootstrapped my SaaS to $100k ARR without taking any funding. Here's exactly what I did, what worked, and what didn't...",
    fullContent: "I bootstrapped my SaaS to $100k ARR without taking any funding. Here's exactly what I did, what worked, and what didn't. The key was finding the right problem-solution fit and doubling down on customer success...",
    subreddit: "entrepreneur",
    subredditUrl: "https://www.reddit.com/r/entrepreneur/",
    author: {
      username: "bootstrap_founder",
      avatar: "/api/placeholder/32/32",
      karma: 22100,
      accountAge: "4 years",
    },
    postType: "text",
    metrics: {
      upvotes: 5600,
      downvotes: 240,
      score: 5360,
      upvoteRatio: 0.96,
      comments: 492,
      awards: 18,
      engagementRate: 8.8,
    },
    postedAt: "6 hours ago",
    viralityScore: 91,
    isTrending: true,
    flair: "Success Story",
    isStickied: false,
    isLocked: false,
  },
  {
    id: "4",
    postUrl: "https://www.reddit.com/r/productivity/comments/jkl012/",
    title: "I tracked every minute for 6 months - Here's what I discovered about productivity",
    content: "Using time tracking apps and manual logging, I tracked literally every minute of my life for 6 months. The results were shocking...",
    fullContent: "Using time tracking apps and manual logging, I tracked literally every minute of my life for 6 months. The results were shocking - I was wasting 3.2 hours daily on activities that added no value. Here's what I learned and how I optimized my schedule...",
    subreddit: "productivity",
    subredditUrl: "https://www.reddit.com/r/productivity/",
    author: {
      username: "time_hacker",
      avatar: "/api/placeholder/32/32",
      karma: 12780,
      accountAge: "1 year",
    },
    postType: "text",
    metrics: {
      upvotes: 3200,
      downvotes: 150,
      score: 3050,
      upvoteRatio: 0.95,
      comments: 278,
      awards: 8,
      engagementRate: 9.1,
    },
    postedAt: "8 hours ago",
    viralityScore: 85,
    isTrending: true,
    flair: "Data",
    isStickied: false,
    isLocked: false,
  },
];

export default function RedditSearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchId = params.searchId as string;

  // In a real app, you would decode this from the searchId
  const mockQuery = "AI productivity programming";

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{mockQuery}</h1>
      </div>

      {/* Query Details Section */}
      <Card className="w-auto max-w-md shadow-none glass-reddit">
        <CardContent className="p-4">
          <div className="space-y-3 text-sm">
            <div className="flex">
              <span className="technical-label w-24">Search:</span>
              <span className="font-black text-white">{mockQuery}</span>
            </div>
            <div className="flex">
              <span className="technical-label w-24">Depth:</span>
              <span className="font-black text-white">50 NODES</span>
            </div>
            <div className="flex">
              <span className="technical-label w-24">Nodes:</span>
              <Badge
                variant="outline"
                className="technical-label border-white/10 opacity-100"
              >
                ALL_SUBREDDITS
              </Badge>
            </div>
            <div className="flex">
              <span className="technical-label w-24">Domain:</span>
              <Badge className="bg-white text-black technical-label opacity-100">REDDIT</Badge>
            </div>
            <div className="flex">
              <span className="technical-label w-24">Status:</span>
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-500 border border-green-500/20 technical-label opacity-100 px-2 py-0"
              >
                ✓ COMPLETED
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