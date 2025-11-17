"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


// Mock data for platform runs
const getRunsData = (platform: string) => {
  const runs = [
    {
      id: "run_001",
      timestamp: "Nov 5, 2025 - 09:00 EAT",
      status: "success" as const,
      duration: "2m 34s",
      keywordsCount: 23,
      creatorsCount: 31,
      totalResults: 54,
      postsGenerated: {
        total: 12,
        pending: 8,
        approved: 3,
        rejected: 1
      },
      error: null,
    },
    {
      id: "run_002", 
      timestamp: "Nov 4, 2025 - 09:00 EAT",
      status: "success" as const,
      duration: "2m 12s",
      keywordsCount: 19,
      creatorsCount: 28,
      totalResults: 47,
      postsGenerated: {
        total: 9,
        pending: 5,
        approved: 4,
        rejected: 0
      },
      error: null,
    },
    {
      id: "run_003",
      timestamp: "Nov 3, 2025 - 09:00 EAT", 
      status: "failed" as const,
      duration: "0m 12s",
      keywordsCount: 0,
      creatorsCount: 0,
      totalResults: 0,
      postsGenerated: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      },
      error: "API authentication failed",
    },
    {
      id: "run_004",
      timestamp: "Nov 2, 2025 - 09:00 EAT",
      status: "success" as const,
      duration: "2m 45s",
      keywordsCount: 25,
      creatorsCount: 33,
      totalResults: 58,
      postsGenerated: {
        total: 14,
        pending: 6,
        approved: 7,
        rejected: 1
      },
      error: null,
    },
    {
      id: "run_005",
      timestamp: "Nov 1, 2025 - 09:00 EAT",
      status: "success" as const,
      duration: "2m 18s",
      keywordsCount: 21,
      creatorsCount: 29,
      totalResults: 50,
      postsGenerated: {
        total: 11,
        pending: 4,
        approved: 6,
        rejected: 1
      },
      error: null,
    },
  ];

  return runs;
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

export default function PlatformHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const platform = params.platform as string;
  
  const platformInfo = getPlatformInfo(platform);
  const runs = getRunsData(platform);

  const handleRunClick = (runId: string) => {
    router.push(`/discover/jobs/${platform}/runs/${runId}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-4 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${platformInfo.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
            {platformInfo.icon}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{platformInfo.name} Scraping Runs</h1>
        </div>

        {/* Runs Table */}
        <Card className="bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle>Recent Scraping Runs</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-4">
              {runs.map((run) => (
                <Card 
                  key={run.id} 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border dark:border-gray-700 bg-white dark:bg-gray-900"
                  onClick={() => handleRunClick(run.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {run.status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <Badge 
                          variant={run.status === "success" ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          {run.status.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-sm font-medium">{run.duration}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{run.timestamp}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Keywords:</span>
                        <div className="font-medium">{run.keywordsCount}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{platformInfo.sourceLabel}:</span>
                        <div className="font-medium">{run.creatorsCount}</div>
                      </div>
                    </div>
                    
                    {run.status === "success" && run.postsGenerated.total > 0 && (
                      <div className="mb-3 text-sm">
                        <span className="text-muted-foreground">Posts Generated:</span>
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {run.postsGenerated.total} posts created
                          </span>
                          <div className="flex gap-1 flex-wrap">
                            {run.postsGenerated.pending > 0 && (
                              <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                {run.postsGenerated.pending} pending
                              </Badge>
                            )}
                            {run.postsGenerated.approved > 0 && (
                              <Badge variant="outline" className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                {run.postsGenerated.approved} approved
                              </Badge>
                            )}
                            {run.postsGenerated.rejected > 0 && (
                              <Badge variant="outline" className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                {run.postsGenerated.rejected} rejected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {run.status === "success" ? (
                          <span className="font-medium text-green-600 dark:text-green-400">{run.totalResults} results</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 text-sm">{run.error}</span>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRunClick(run.id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b dark:border-gray-700">
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Timestamp</TableHead>
                    <TableHead className="text-muted-foreground">Duration</TableHead>
                    <TableHead className="text-muted-foreground">Keywords</TableHead>
                    <TableHead className="text-muted-foreground">{platformInfo.sourceLabel}</TableHead>
                    <TableHead className="text-muted-foreground">Total Results</TableHead>
                    <TableHead className="text-muted-foreground">Posts Generated</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.map((run) => (
                    <TableRow 
                      key={run.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700"
                      onClick={() => handleRunClick(run.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {run.status === "success" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <Badge 
                            variant={run.status === "success" ? "default" : "destructive"} 
                            className="text-xs"
                          >
                            {run.status.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{run.timestamp}</span>
                        </div>
                      </TableCell>
                      <TableCell>{run.duration}</TableCell>
                      <TableCell>
                        <span className="font-medium">{run.keywordsCount}</span>
                        {run.status === "success" && (
                          <span className="text-muted-foreground text-sm ml-1">sources</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{run.creatorsCount}</span>
                        {run.status === "success" && (
                          <span className="text-muted-foreground text-sm ml-1">sources</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {run.status === "success" ? (
                          <span className="font-medium text-green-600 dark:text-green-400">{run.totalResults}</span>
                        ) : (
                          <span className="text-red-600 dark:text-red-400 text-sm">{run.error}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {run.status === "success" && run.postsGenerated.total > 0 ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {run.postsGenerated.total} posts
                            </span>
                            <div className="flex gap-1 flex-wrap">
                              {run.postsGenerated.pending > 0 && (
                                <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                  {run.postsGenerated.pending}p
                                </Badge>
                              )}
                              {run.postsGenerated.approved > 0 && (
                                <Badge variant="outline" className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                  {run.postsGenerated.approved}a
                                </Badge>
                              )}
                              {run.postsGenerated.rejected > 0 && (
                                <Badge variant="outline" className="text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                  {run.postsGenerated.rejected}r
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRunClick(run.id);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}