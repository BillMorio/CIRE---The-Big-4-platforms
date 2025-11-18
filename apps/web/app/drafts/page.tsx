"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target } from "lucide-react";
import { columns } from "./columns";
import { DataCards } from "./data-cards";
import { useBrandCampaignStore } from "@/lib/store";
import { AppTopbar } from "@/components/app-topbar";

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
  const { selectedBrand, selectedCampaign } = useBrandCampaignStore();
  
  // Calculate stats
  const stats = {
    total: mockDrafts.length,
    draft: mockDrafts.filter(d => d.status === "draft").length,
    ready: mockDrafts.filter(d => d.status === "ready-to-publish").length,
    review: mockDrafts.filter(d => d.status === "in-review").length,
  };

  return (
    <div className="flex flex-1 flex-col">
      <AppTopbar />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-6 p-4 pt-6 max-w-7xl mx-auto w-full">
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
                    Content aligned with campaign objectives and brand voice
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  {selectedCampaign.settings.contentPillars.length} content pillars
                </Badge>
                <Badge variant={selectedCampaign.status === 'active' ? 'default' : 'secondary'}>
                  {selectedCampaign.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
      </div>
    </div>
  );
}
