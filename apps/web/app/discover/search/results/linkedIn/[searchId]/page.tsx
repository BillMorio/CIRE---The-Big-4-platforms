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
import type { LinkedInPost } from "./columns";
import { DataCards } from "./data-cards";

// Mock data for search results
const mockSearchResults: LinkedInPost[] = [
  {
    id: "1",
    postUrl: "https://www.linkedin.com/posts/sarah-chen_ai-ml-systems",
    author: {
      name: "Sarah Chen",
      headline: "VP of Engineering at TechCorp",
      avatar: "/api/placeholder/40/40",
      initials: "SC",
    },
    content:
      "Just shipped our AI-powered recommendation engine after 6 months of development. Here's what I learned about building scalable ML systems...",
    fullContent:
      "Just shipped our AI-powered recommendation engine after 6 months of development. Here's what I learned about building scalable ML systems: 1) Start simple, 2) Data quality matters more than model complexity, 3) Infrastructure is everything...",
    contentType: "text",
    metrics: {
      likes: 2847,
      comments: 156,
      shares: 89,
      views: 45230,
      engagementRate: 6.8,
    },
    postedAt: "10/29/2025 1:47am",
    viralityScore: 85,
    isTrending: true,
  },
  {
    id: "2",
    postUrl: "https://www.linkedin.com/posts/marcus-johnson_ai-implementation",
    author: {
      name: "Marcus Johnson",
      headline: "AI Product Manager | Ex-Google",
      avatar: "/api/placeholder/40/40",
      initials: "MJ",
    },
    content:
      "The biggest mistake I see companies make with AI implementation is trying to boil the ocean. Start with one specific use case...",
    fullContent:
      "The biggest mistake I see companies make with AI implementation is trying to boil the ocean. Start with one specific use case, prove value, then scale. Here's my framework for AI adoption success...",
    contentType: "video",
    videoLength: "1 min 24 secs",
    metrics: {
      likes: 1923,
      comments: 87,
      shares: 45,
      views: 28450,
      engagementRate: 7.2,
    },
    postedAt: "10/28/2025 2:00am",
    viralityScore: 92,
    isTrending: true,
  },
  {
    id: "3",
    postUrl: "https://www.linkedin.com/posts/amanda-foster_ai-changemanagement",
    author: {
      name: "Dr. Amanda Foster",
      headline: "Chief Data Scientist | MIT PhD",
      avatar: "/api/placeholder/40/40",
      initials: "AF",
    },
    content:
      "Unpopular opinion: Most AI projects fail not because of the technology, but because of poor change management...",
    fullContent:
      "Unpopular opinion: Most AI projects fail not because of the technology, but because of poor change management. Here's how to set your AI initiatives up for success from day one...",
    contentType: "carousel",
    metrics: {
      likes: 3156,
      comments: 234,
      shares: 127,
      views: 62340,
      engagementRate: 5.6,
    },
    postedAt: "10/27/2025 8:00pm",
    viralityScore: 78,
    isTrending: false,
  },
];

export default function SearchResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchId = params.searchId as string;

  // In a real app, you would decode this from the searchId
  const mockQuery = "AI productivity business";

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
                <BreadcrumbPage>LinkedIn Results</BreadcrumbPage>
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
              <span className="font-medium">10</span>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Type:</span>
              <Badge
                variant="destructive"
                className="text-xs bg-red-500/20 text-red-700 backdrop-blur-sm border-2 border-red-300/50"
              >
                Videos
              </Badge>
            </div>
            <div className="flex">
              <span className="text-muted-foreground w-20">Platform:</span>
              <Badge className="bg-[#0077b5] text-xs">LinkedIn</Badge>
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