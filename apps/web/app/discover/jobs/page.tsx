"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MobileBreadcrumb } from "@/components/mobile-breadcrumb";
import { AppTopbar } from "@/components/app-topbar";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  History,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Mock data for scraping jobs
const scrapingJobs = [
  {
    id: "twitter",
    platform: "Twitter",
    status: "active" as const,
    lastRun: "Today at 09:00 (2 hours ago)",
    nextRun: "Tomorrow at 09:00 (in 22 hours)",
    results: {
      keywords: { count: 23, examples: ["AI", "automation", "etc."] },
      creators: { count: 31, examples: ["@james", "@ryanhol", "etc."] },
      total: 47,
      duplicates: 7,
    },
    postsGenerated: {
      total: 12,
      pending: 8,
      approved: 3,
      rejected: 1
    },
    health: { percentage: 95, successful: 19, total: 20 },
    icon: "𝕏",
    color: "bg-black",
  },
  {
    id: "reddit",
    platform: "Reddit",
    status: "active" as const,
    lastRun: "Today at 09:15 (2 hours ago)",
    nextRun: "Tomorrow at 09:15 (in 22 hours)",
    results: {
      keywords: { count: 15, examples: [] },
      subreddits: { count: 28, examples: [] },
      total: 43,
      duplicates: 0,
    },
    postsGenerated: {
      total: 9,
      pending: 5,
      approved: 4,
      rejected: 0
    },
    health: { percentage: 100, successful: 20, total: 20 },
    icon: "r",
    color: "bg-orange-500",
  },
  {
    id: "linkedin",
    platform: "LinkedIn",
    status: "error" as const,
    lastRun: "Today at 09:05 (FAILED)",
    nextRun: "Tomorrow at 09:05",
    error: "Rate limit exceeded - LinkedIn API quota",
    previousRun: "Yesterday - 34 items found ✓",
    results: {
      keywords: { count: 0, examples: [] },
      profiles: { count: 0, examples: [] },
      total: 0,
      duplicates: 0,
    },
    postsGenerated: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    health: { percentage: 85, successful: 17, total: 20, trending: "declining" },
    icon: "in",
    color: "bg-blue-600",
  },
  {
    id: "youtube",
    platform: "YouTube",
    status: "active" as const,
    lastRun: "Today at 09:30 (1 hour ago)",
    nextRun: "Tomorrow at 09:30 (in 23 hours)",
    results: {
      keywords: { count: 18, examples: ["AI tutorials", "productivity"] },
      channels: { count: 22, examples: ["@TechChannel", "@ProductivityGuru"] },
      total: 40,
      duplicates: 2,
    },
    postsGenerated: {
      total: 7,
      pending: 4,
      approved: 2,
      rejected: 1
    },
    health: { percentage: 90, successful: 18, total: 20 },
    icon: "▶",
    color: "bg-red-600",
  },
];

export default function JobsStatusPage() {
  const router = useRouter();
  const [isScrapersExpanded, setIsScrapersExpanded] = useState(true);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 text-white text-xs font-medium">
            ACTIVE
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="text-xs font-medium">
            ERROR
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs font-medium">
            IDLE
          </Badge>
        );
    }
  };

  const getPlatformBackground = (platform: string) => {
    switch(platform.toLowerCase()) {
      case 'twitter': return 'bg-blue-50 dark:bg-blue-950/20';
      case 'reddit': return 'bg-orange-50 dark:bg-orange-950/20';
      case 'linkedin': return 'bg-blue-50 dark:bg-blue-950/20';
      case 'youtube': return 'bg-red-50 dark:bg-red-950/20';
      default: return 'bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getOverallScraperStatus = () => {
    const activeJobs = scrapingJobs.filter(job => job.status === 'active').length;
    const errorJobs = scrapingJobs.filter(job => job.status === 'error').length;
    const totalJobs = scrapingJobs.length;

    if (errorJobs === 0) {
      return {
        text: `All ${totalJobs} scrapers operational`,
        color: "text-green-600 dark:text-green-400",
        badge: { 
          text: "Healthy", 
          variant: "default", 
          className: "bg-green-500 text-white" 
        }
      };
    } else if (errorJobs === 1) {
      return {
        text: `${activeJobs}/${totalJobs} scrapers operational`,
        color: "text-yellow-600 dark:text-yellow-400",
        badge: { 
          text: "1 Issue", 
          variant: "outline", 
          className: "text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" 
        }
      };
    } else {
      return {
        text: `${activeJobs}/${totalJobs} scrapers operational`,
        color: "text-red-600 dark:text-red-400",
        badge: { 
          text: `${errorJobs} Issues`, 
          variant: "outline", 
          className: "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
        }
      };
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <AppTopbar />
      <div className="flex-1 overflow-auto bg-background">
        <div className="flex flex-col gap-4 p-4 pt-4 max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Scraping Jobs Status</h1>
          </div>

          {/* Platform Scrapers Status Section */}
          <div 
            className="cursor-pointer hover:bg-accent rounded-lg p-3 -mx-3 transition-colors mb-6"
            onClick={() => setIsScrapersExpanded(!isScrapersExpanded)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold">Platform Scrapers Status</h2>
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-sm text-muted-foreground">
                  {isScrapersExpanded ? 'Collapse' : 'Expand'}
                </span>
                {isScrapersExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
            
            {/* Mobile-friendly status summary when collapsed */}
            {!isScrapersExpanded && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className={`text-sm font-medium ${getOverallScraperStatus().color}`}>
                    {getOverallScraperStatus().text}
                  </span>
                  <Badge 
                    variant={getOverallScraperStatus().badge.variant as "default" | "secondary" | "destructive" | "outline"}
                    className={`${getOverallScraperStatus().badge.className} w-fit`}
                  >
                    {getOverallScraperStatus().badge.text}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Jobs Grid - Collapsible */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isScrapersExpanded ? 'opacity-100 max-h-none' : 'opacity-0 max-h-0'
          }`}>
            <div className="grid gap-4 md:gap-6">
              {scrapingJobs.map((job) => (
              <Card key={job.id} className={`${getPlatformBackground(job.platform)} border-l-4 border-l-border`}>
              <CardHeader className="pb-3 md:pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${job.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {job.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{job.platform}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(job.status)}
                        {getStatusBadge(job.status)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 md:space-y-4">
                {/* Timing Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                  <div>
                    <span className="font-medium">Last Run:</span>
                    <div className="text-muted-foreground mt-1">{job.lastRun}</div>
                  </div>
                  <div>
                    <span className="font-medium">Next Run:</span>
                    <div className="text-muted-foreground mt-1">{job.nextRun}</div>
                  </div>
                </div>

                {/* Error Info (if exists) */}
                {job.status === "error" && job.error && (
                  <div className="bg-muted border border-border rounded-lg p-3">
                    <div className="text-red-800 dark:text-red-200 font-medium text-sm">Error:</div>
                    <div className="text-red-700 dark:text-red-300 text-sm mt-1">{job.error}</div>
                    {job.previousRun && (
                      <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        <span className="font-medium">Previous Run:</span> {job.previousRun}
                      </div>
                    )}
                  </div>
                )}

                {/* Latest Run Results - Mobile friendly like history page */}
                {job.status === "active" && (
                  <div>
                    <h4 className="font-medium text-sm mb-4">Latest Run Results:</h4>
                    
                    {/* Mobile Card View */}
                    <div className="block md:hidden">
                      <Card className={`border ${
                        job.platform === "Twitter" ? "border-gray-700 dark:border-gray-600 bg-gray-900/5 dark:bg-gray-100/5" :
                        job.platform === "Reddit" ? "border-orange-200 dark:border-orange-800 bg-orange-500/5 dark:bg-orange-500/10" :
                        job.platform === "LinkedIn" ? "border-blue-200 dark:border-blue-800 bg-blue-600/5 dark:bg-blue-600/10" :
                        job.platform === "YouTube" ? "border-red-200 dark:border-red-800 bg-red-600/5 dark:bg-red-600/10" :
                        "border-gray-200 dark:border-gray-700 bg-gray-500/5 dark:bg-gray-500/10"
                      }`}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <Badge className="text-xs bg-green-500 text-white">SUCCESS</Badge>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">2m 34s</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-5">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{job.lastRun}</span>
                          </div>
                          
                          <div className="flex items-center gap-6 mb-5 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">{job.results.keywords.count}</span>
                              <span className="text-muted-foreground ml-1">keywords</span>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                {(job.results as any).creators?.count || 
                                 (job.results as any).subreddits?.count || 
                                 (job.results as any).profiles?.count || 
                                 (job.results as any).channels?.count || 0}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                {job.platform === "Twitter" ? "creators" : 
                                 job.platform === "Reddit" ? "subreddits" : 
                                 job.platform === "LinkedIn" ? "profiles" : "channels"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4 text-sm">
                            {job.postsGenerated.total > 0 ? (
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  {job.postsGenerated.total} posts created
                                </span>
                                <div className="flex gap-1 flex-wrap">
                                  {job.postsGenerated.pending > 0 && (
                                    <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                      {job.postsGenerated.pending} pending
                                    </Badge>
                                  )}
                                  {job.postsGenerated.approved > 0 && (
                                    <Badge variant="outline" className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                      {job.postsGenerated.approved} approved
                                    </Badge>
                                  )}
                                  {job.postsGenerated.rejected > 0 && (
                                    <Badge variant="outline" className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                      {job.postsGenerated.rejected} rejected
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="font-medium text-muted-foreground">No posts generated</div>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">{job.results.total}</span>
                            <span className="text-sm text-muted-foreground ml-2">new results</span>
                          </div>
                          
                          <div className="pt-4 border-t dark:border-gray-700">
                            <Button variant="outline" size="default" asChild className="w-full">
                              <Link href={`/discover/jobs/${job.id}/history`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Desktop Side by Side View */}
                    <div className="hidden md:block">
                      <div className="grid grid-cols-2 gap-6">
                        <Card className={`border ${
                          job.platform === "Twitter" ? "border-gray-700 dark:border-gray-600 bg-gray-900/5 dark:bg-gray-100/5" :
                          job.platform === "Reddit" ? "border-orange-200 dark:border-orange-800 bg-orange-500/5 dark:bg-orange-500/10" :
                          job.platform === "LinkedIn" ? "border-blue-200 dark:border-blue-800 bg-blue-600/5 dark:bg-blue-600/10" :
                          job.platform === "YouTube" ? "border-red-200 dark:border-red-800 bg-red-600/5 dark:bg-red-600/10" :
                          "border-gray-200 dark:border-gray-700 bg-gray-500/5 dark:bg-gray-500/10"
                        }`}>
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <Badge className="text-xs bg-green-500 text-white">SUCCESS</Badge>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">2m 34s</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-5">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{job.lastRun}</span>
                          </div>
                          
                          <div className="flex items-center gap-6 mb-5 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">{job.results.keywords.count}</span>
                              <span className="text-muted-foreground ml-1">keywords</span>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                {(job.results as any).creators?.count || 
                                 (job.results as any).subreddits?.count || 
                                 (job.results as any).profiles?.count || 
                                 (job.results as any).channels?.count || 0}
                              </span>
                              <span className="text-muted-foreground ml-1">
                                {job.platform === "Twitter" ? "creators" : 
                                 job.platform === "Reddit" ? "subreddits" : 
                                 job.platform === "LinkedIn" ? "profiles" : "channels"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4 text-sm">
                            {job.postsGenerated.total > 0 ? (
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                  {job.postsGenerated.total} posts created
                                </span>
                                <div className="flex gap-1 flex-wrap">
                                  {job.postsGenerated.pending > 0 && (
                                    <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                      {job.postsGenerated.pending} pending
                                    </Badge>
                                  )}
                                  {job.postsGenerated.approved > 0 && (
                                    <Badge variant="outline" className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                      {job.postsGenerated.approved} approved
                                    </Badge>
                                  )}
                                  {job.postsGenerated.rejected > 0 && (
                                    <Badge variant="outline" className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                      {job.postsGenerated.rejected} rejected
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="font-medium text-muted-foreground">No posts generated</div>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">{job.results.total}</span>
                            <span className="text-sm text-muted-foreground ml-2">new results</span>
                          </div>
                          
                          <div className="pt-4 border-t dark:border-gray-700">
                            <Button variant="outline" size="default" asChild className="w-full">
                              <Link href={`/discover/jobs/${job.id}/history`}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Health Status Card - Desktop */}
                      <Card className={`border ${
                        job.platform === "Twitter" ? "bg-gray-900/5 dark:bg-gray-100/5 border-gray-200 dark:border-gray-700" :
                        job.platform === "Reddit" ? "bg-orange-500/5 dark:bg-orange-500/10 border-orange-200 dark:border-orange-800" :
                        job.platform === "LinkedIn" ? "bg-blue-600/5 dark:bg-blue-600/10 border-blue-200 dark:border-blue-800" :
                        job.platform === "YouTube" ? "bg-red-600/5 dark:bg-red-600/10 border-red-200 dark:border-red-800" :
                        "bg-gray-500/5 dark:bg-gray-500/10 border-gray-200 dark:border-gray-700"
                      }`}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-medium text-lg">Health Status</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-2xl ${
                                job.health.percentage >= 95 ? "text-green-600 dark:text-green-400" :
                                job.health.percentage >= 85 ? "text-yellow-600 dark:text-yellow-400" : 
                                "text-red-600 dark:text-red-400"
                              }`}>
                                {job.health.percentage}%
                              </span>
                              {job.health.trending === "declining" && (
                                <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                  declining
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Success Rate:</span>
                              <span className="font-medium">{job.health.successful}/{job.health.total} runs</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Last Success:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">2 hours ago</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Avg Response:</span>
                              <span className="font-medium">1.2s</span>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Uptime:</span>
                              <span className="font-medium">99.8%</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t dark:border-gray-700">
                            <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                              job.health.percentage >= 95 ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300" :
                              job.health.percentage >= 85 ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300" : 
                              "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                            }`}>
                              {job.health.percentage >= 95 ? "Excellent" :
                               job.health.percentage >= 85 ? "Good" : "Needs Attention"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Health Status - Mobile */}
                <div className={`md:hidden rounded-lg p-3 border ${
                  job.platform === "Twitter" ? "bg-gray-900/5 dark:bg-gray-100/5 border-gray-200 dark:border-gray-700" :
                  job.platform === "Reddit" ? "bg-orange-500/5 dark:bg-orange-500/10 border-orange-200 dark:border-orange-800" :
                  job.platform === "LinkedIn" ? "bg-blue-600/5 dark:bg-blue-600/10 border-blue-200 dark:border-blue-800" :
                  job.platform === "YouTube" ? "bg-red-600/5 dark:bg-red-600/10 border-red-200 dark:border-red-800" :
                  "bg-gray-500/5 dark:bg-gray-500/10 border-gray-200 dark:border-gray-700"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">Health:</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-lg ${
                        job.health.percentage >= 95 ? "text-green-600 dark:text-green-400" :
                        job.health.percentage >= 85 ? "text-yellow-600 dark:text-yellow-400" : 
                        "text-red-600 dark:text-red-400"
                      }`}>
                        {job.health.percentage}%
                      </span>
                      {job.health.trending === "declining" && (
                        <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                          declining
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {job.health.successful}/{job.health.total} successful runs this month
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <Button variant="default" size="default" asChild className="bg-black hover:bg-gray-800 text-white font-medium w-full">
                    <Link href={`/discover/jobs/${job.id}/history`}>
                      <History className="w-4 h-4 mr-2" />
                      View All Runs
                    </Link>
                  </Button>
                  {job.status === "error" && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link href={`/discover/jobs/${job.id}/errors`}>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        View Error Details
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
              </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}