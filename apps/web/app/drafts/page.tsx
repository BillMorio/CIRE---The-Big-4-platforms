"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataCards } from "./data-cards";

// Mock data for drafts
const mockDrafts = [
  {
    id: "1",
    title: "Top 5 Productivity Hacks from Twitter Experts",
    content: "After analyzing hundreds of productivity tweets, here are the top 5 strategies that consistently appear...",
    excerpt: "After analyzing hundreds of productivity tweets, here are the top 5 strategies...",
    source: "ai-generated" as const,
    sourceDetails: {
      platform: "Twitter" as const,
      originalAuthor: "@productivity_guru",
      scrapedDate: "2 hours ago",
    },
    status: "draft" as const,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    platform: "Twitter" as "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog",
    contentType: "post" as const,
    contentCategory: "Advice" as const,
    tags: ["productivity", "tips", "twitter"],
  },
  {
    id: "2",
    title: "My Thoughts on AI in Content Creation",
    content: "As someone who's been using AI tools for content creation, I've learned a lot about what works and what doesn't...",
    excerpt: "As someone who's been using AI tools for content creation, I've learned a lot...",
    source: "manual" as const,
    status: "ready-to-publish" as const,
    createdAt: "2024-01-14T15:20:00Z",
    updatedAt: "2024-01-14T18:45:00Z",
    platform: "LinkedIn" as "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog",
    contentType: "article" as const,
    contentCategory: "Personal Story" as const,
    tags: ["ai", "content", "opinion"],
  },
  {
    id: "3",
    title: "Reddit Marketing Insights Thread",
    content: "A comprehensive thread about marketing strategies discussed in r/marketing...",
    excerpt: "A comprehensive thread about marketing strategies discussed in r/marketing...",
    source: "ai-generated" as const,
    sourceDetails: {
      platform: "Reddit" as const,
      originalAuthor: "u/marketing_pro",
      scrapedDate: "1 day ago",
    },
    status: "in-review" as const,
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T11:30:00Z",
    platform: "LinkedIn" as "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog",
    contentType: "thread" as const,
    contentCategory: "Technical" as const,
    tags: ["marketing", "reddit", "insights"],
  },
  {
    id: "4",
    title: "YouTube Video Script: AI Tools for Creators",
    content: "Welcome back to the channel! Today we're diving into the best AI tools that every content creator should know about...",
    excerpt: "Welcome back to the channel! Today we're diving into the best AI tools...",
    source: "manual" as const,
    status: "draft" as const,
    createdAt: "2024-01-12T14:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    platform: "YouTube" as "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog",
    contentType: "video-script" as const,
    contentCategory: "Educational" as const,
    tags: ["video", "ai-tools", "tutorial"],
  },
  {
    id: "5",
    title: "LinkedIn Post: Career Growth Tips",
    content: "Based on insights from top LinkedIn influencers, here are 3 career growth strategies you can implement today...",
    excerpt: "Based on insights from top LinkedIn influencers, here are 3 career growth strategies...",
    source: "ai-generated" as const,
    sourceDetails: {
      platform: "LinkedIn" as const,
      originalAuthor: "Career Coach Jane",
      scrapedDate: "3 hours ago",
    },
    status: "ready-to-publish" as const,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:30:00Z",
    platform: "LinkedIn" as "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog",
    contentType: "post" as const,
    contentCategory: "Advice" as const,
    tags: ["career", "growth", "linkedin"],
  },
  {
    id: "6",
    title: "Tech News Roundup - Weekly Edition",
    content: "This week in tech: AI breakthroughs, startup funding news, and the latest product launches...",
    excerpt: "This week in tech: AI breakthroughs, startup funding news, and the latest...",
    source: "manual" as const,
    status: "draft" as const,
    createdAt: "2024-01-11T16:30:00Z",
    updatedAt: "2024-01-14T10:00:00Z",
    platform: "Blog" as "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog",
    contentType: "article" as const,
    contentCategory: "News" as const,
    tags: ["tech", "news", "weekly"],
  },
];

export default function DraftsPage() {
  // Calculate stats
  const stats = {
    total: mockDrafts.length,
    draft: mockDrafts.filter(d => d.status === "draft").length,
    ready: mockDrafts.filter(d => d.status === "ready-to-publish").length,
    review: mockDrafts.filter(d => d.status === "in-review").length,
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">My Drafts</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/studio">
            <Plus className="w-4 h-4 mr-2" />
            New Draft
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-muted-foreground mt-1">Total Drafts</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.draft}</div>
            <div className="text-sm text-muted-foreground mt-1">Draft</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.ready}</div>
            <div className="text-sm text-muted-foreground mt-1">Ready</div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.review}</div>
            <div className="text-sm text-muted-foreground mt-1">In Review</div>
          </CardContent>
        </Card>
      </div>

      {/* Data Cards with TanStack Table */}
      <DataCards columns={columns} data={mockDrafts} />
    </div>
  );
}
