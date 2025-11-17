"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bot,
  User,
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Check,
  X,
  ExternalLink,
  Clock,
  Tag,
} from "lucide-react";

// Mock data for individual draft
const mockDraft = {
  id: "1",
  title: "Top 5 Productivity Hacks from Twitter Experts",
  content: `After analyzing hundreds of productivity tweets, here are the top 5 strategies that consistently appear from the most successful people on Twitter:

1. **Time Blocking**: Schedule specific time blocks for different types of work. Many successful founders swear by this method.

2. **The 2-Minute Rule**: If something takes less than 2 minutes, do it immediately. This prevents small tasks from piling up.

3. **Deep Work Sessions**: Dedicate 90-120 minute blocks to focused, distraction-free work on your most important tasks.

4. **Weekly Reviews**: Spend 30 minutes every Sunday reviewing the past week and planning the next. This keeps you aligned with your goals.

5. **Energy Management**: Work on your most important tasks when your energy is highest. For most people, this is in the morning.

These strategies have been tested by thousands of successful entrepreneurs and creators. Try implementing one this week and see the difference it makes!`,
  excerpt: "After analyzing hundreds of productivity tweets, here are the top 5 strategies...",
  source: "ai-generated" as const,
  sourceDetails: {
    platform: "Twitter" as const,
    originalPost: "https://twitter.com/productivity_guru/status/123456789",
    originalAuthor: "@productivity_guru",
    scrapedDate: "2024-01-15T08:30:00Z",
  },
  status: "draft" as const,
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z",
  createdBy: "user-123",
  platform: "Twitter" as const,
  contentType: "post" as const,
  tags: ["productivity", "tips", "twitter", "time-management"],
  category: "Business",
};

export default function DraftDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [status, setStatus] = useState(mockDraft.status);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "ready-to-publish":
        return <Badge className="bg-green-500 text-white">Ready to Publish</Badge>;
      case "in-review":
        return <Badge variant="outline" className="text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">In Review</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/drafts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Drafts
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {mockDraft.source === "ai-generated" ? (
                    <Bot className="w-5 h-5 text-blue-500" />
                  ) : (
                    <User className="w-5 h-5 text-purple-500" />
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {mockDraft.source === "ai-generated" ? "AI Generated" : "Manual"}
                    </span>
                    {mockDraft.source === "ai-generated" && mockDraft.sourceDetails && (
                      <div className="text-xs text-muted-foreground">
                        from {mockDraft.sourceDetails.platform}
                      </div>
                    )}
                  </div>
                </div>
                {getStatusBadge(status)}
              </div>
              <h1 className="text-3xl font-bold">{mockDraft.title}</h1>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                {mockDraft.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="flex-1 sm:flex-none">
                  <Link href={`/studio?draft=${mockDraft.id}`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit in Studio
                  </Link>
                </Button>
                {status === "draft" && (
                  <Button 
                    onClick={() => setStatus("ready-to-publish")}
                    className="flex-1 sm:flex-none"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark as Ready
                  </Button>
                )}
                {status === "ready-to-publish" && (
                  <Button className="flex-1 sm:flex-none">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                )}
                <Button variant="destructive" className="flex-1 sm:flex-none">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Platform</div>
                <div className="font-medium">{mockDraft.platform}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Content Type</div>
                <div className="font-medium capitalize">{mockDraft.contentType}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Category</div>
                <div className="font-medium">{mockDraft.category}</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Created</div>
                <div className="text-sm flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {formatDate(mockDraft.createdAt)}
                </div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-1">Last Updated</div>
                <div className="text-sm flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  {formatDate(mockDraft.updatedAt)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Source Info (for AI-generated) */}
          {mockDraft.source === "ai-generated" && mockDraft.sourceDetails && (
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-500" />
                  Source Information
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Original Platform</div>
                  <div className="font-medium">{mockDraft.sourceDetails.platform}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Original Author</div>
                  <div className="font-medium">{mockDraft.sourceDetails.originalAuthor}</div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Scraped Date</div>
                  <div className="text-sm">{formatDate(mockDraft.sourceDetails.scrapedDate)}</div>
                </div>
                {mockDraft.sourceDetails.originalPost && (
                  <>
                    <Separator />
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={mockDraft.sourceDetails.originalPost} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Original Post
                      </a>
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockDraft.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
