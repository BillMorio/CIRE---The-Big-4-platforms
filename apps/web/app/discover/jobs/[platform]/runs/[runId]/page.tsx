"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Hash, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for a specific run
const getRunDetails = (platform: string, runId: string) => {
  const baseRunData = {
    id: runId,
    timestamp: "Nov 5, 2025 - 09:00 EAT",
    duration: "2m 34s",
    status: "success" as const,
    keywords: [
      { name: "AI automation", resultsCount: 12 },
      { name: "productivity tools", resultsCount: 8 },
      { name: "machine learning", resultsCount: 6 },
      { name: "remote work", resultsCount: 4 },
      { name: "startup", resultsCount: 3 },
    ],
    creators: [] as Array<{ name: string; resultsCount: number }>,
  };

  // Platform-specific creator data
  if (platform === "twitter") {
    baseRunData.creators = [
      { name: "@james", resultsCount: 15 },
      { name: "@ryanhol", resultsCount: 12 },
      { name: "@dankoe", resultsCount: 8 },
      { name: "@naval", resultsCount: 5 },
      { name: "@elonmusk", resultsCount: 3 },
    ];
  } else if (platform === "reddit") {
    baseRunData.creators = [
      { name: "r/programming", resultsCount: 18 },
      { name: "r/entrepreneur", resultsCount: 10 },
      { name: "r/MachineLearning", resultsCount: 8 },
      { name: "r/startups", resultsCount: 6 },
      { name: "r/productivity", resultsCount: 4 },
    ];
  } else if (platform === "linkedin") {
    baseRunData.creators = [
      { name: "Sarah Chen", resultsCount: 12 },
      { name: "Marcus Johnson", resultsCount: 9 },
      { name: "Amanda Foster", resultsCount: 7 },
      { name: "David Kim", resultsCount: 5 },
      { name: "Rachel Martinez", resultsCount: 4 },
    ];
  } else if (platform === "youtube") {
    baseRunData.creators = [
      { name: "TechGuru Pro", resultsCount: 14 },
      { name: "AI Insights", resultsCount: 11 },
      { name: "Startup Journey", resultsCount: 8 },
      { name: "Code Academy", resultsCount: 6 },
      { name: "Product Hunt", resultsCount: 3 },
    ];
  }

  return baseRunData;
};

const getPlatformInfo = (platform: string) => {
  const platformMap = {
    twitter: { name: "Twitter", icon: "𝕏", color: "bg-black", sourceLabel: "Creators" },
    reddit: { name: "Reddit", icon: "r", color: "bg-orange-500", sourceLabel: "Subreddits" },
    linkedin: { name: "LinkedIn", icon: "in", color: "bg-blue-600", sourceLabel: "Profiles" },
    youtube: { name: "YouTube", icon: "▶", color: "bg-red-600", sourceLabel: "Channels" },
  };
  return platformMap[platform as keyof typeof platformMap] || { name: platform, icon: "?", color: "bg-gray-500", sourceLabel: "Sources" };
};

export default function RunDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const platform = params.platform as string;
  const runId = params.runId as string;
  
  const platformInfo = getPlatformInfo(platform);
  const runDetails = getRunDetails(platform, runId);

  const handleKeywordClick = (keyword: string) => {
    router.push(`/discover/jobs/${platform}/runs/${runId}/keywords/${encodeURIComponent(keyword)}`);
  };

  const handleCreatorClick = (creator: string) => {
    router.push(`/discover/jobs/${platform}/runs/${runId}/creators/${encodeURIComponent(creator)}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
              {platformInfo.icon}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{platformInfo.name} Run Details</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-muted-foreground">
                <span>{runDetails.timestamp}</span>
                <span className="hidden sm:inline">•</span>
                <span>{runDetails.duration}</span>
                <span className="hidden sm:inline">•</span>
                <span>Run ID: {runId}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keywords Section */}
          <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Keywords ({runDetails.keywords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {runDetails.keywords.map((keyword, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:shadow-sm dark:hover:bg-gray-800 cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-600"
                    onClick={() => handleKeywordClick(keyword.name)}
                  >
                    <div className="flex items-center gap-3">
                      <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">{keyword.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {keyword.resultsCount} results
                      </Badge>
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creators/Sources Section */}
          <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                {platformInfo.sourceLabel} ({runDetails.creators.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {runDetails.creators.map((creator, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:shadow-sm dark:hover:bg-gray-800 cursor-pointer transition-all hover:border-purple-300 dark:hover:border-purple-600"
                    onClick={() => handleCreatorClick(creator.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        {platformInfo.icon}
                      </div>
                      <span className="font-medium">{creator.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {creator.resultsCount} results
                      </Badge>
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Run Summary */}
        <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
          <CardHeader>
            <CardTitle>Run Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{runDetails.keywords.length}</div>
                <div className="text-sm text-muted-foreground">Keywords Searched</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{runDetails.creators.length}</div>
                <div className="text-sm text-muted-foreground">{platformInfo.sourceLabel} Monitored</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {runDetails.keywords.reduce((sum, k) => sum + k.resultsCount, 0) + 
                   runDetails.creators.reduce((sum, c) => sum + c.resultsCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Results Found</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{runDetails.duration}</div>
                <div className="text-sm text-muted-foreground">Execution Time</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">How to view scraped content</h4>
                <p className="text-blue-800 text-sm">
                  Click on any keyword or {platformInfo.sourceLabel.toLowerCase()} above to see the actual posts and content that were scraped for that source during this run.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}