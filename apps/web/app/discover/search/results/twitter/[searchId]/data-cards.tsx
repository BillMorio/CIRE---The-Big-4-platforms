"use client";

import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Eye,
  Heart,
  Repeat2,
  MessageCircle,
  ArrowUpDown,
  Filter as FilterIcon,
  Bookmark,
  Quote,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface DataCardsProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataCards<TData, TValue>({
  columns,
  data,
}: DataCardsProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "viralityScore", desc: true }, // Default sort by virality
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 12, // Show 12 cards per page
      },
    },
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleAnalyzeTweet = (tweetId: string) => {
    router.push(`/twitter/inspiration/tweet/${tweetId}`);
  };

  const handleOpenTweet = (tweetUrl: string) => {
    window.open(tweetUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Global Search */}
        <div className="flex-1">
          <Input
            placeholder="Search tweets, hashtags, users..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Tweet Type Filter */}
        <Select
          value={
            (table.getColumn("tweetType")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("tweetType")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Tweet Type" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="text">Text Tweets</SelectItem>
            <SelectItem value="image">Image Tweets</SelectItem>
            <SelectItem value="video">Video Tweets</SelectItem>
            <SelectItem value="quote">Quote Tweets</SelectItem>
            <SelectItem value="thread">Thread Tweets</SelectItem>
            <SelectItem value="retweet">Retweets</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select
          value={sorting[0]?.id ?? "viralityScore"}
          onValueChange={(value) => {
            setSorting([{ id: value, desc: true }]);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="viralityScore">Virality Score</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="retweets">Most Retweeted</SelectItem>
            <SelectItem value="replies">Most Replies</SelectItem>
            <SelectItem value="engagementRate">Engagement Rate</SelectItem>
            <SelectItem value="postedAt">Most Recent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {table.getRowModel().rows.length} of {data.length} results
        </div>
        {(globalFilter || columnFilters.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setGlobalFilter("");
              setColumnFilters([]);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const tweet = row.original as any; // Type assertion for the tweet data
            return (
              <Card
                key={row.id}
                className="hover:shadow-md transition-shadow bg-gradient-to-t from-sky-50/30 to-card shadow-xs dark:from-sky-950/10 dark:bg-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Image
                        src={tweet.author.avatar}
                        alt={`@${tweet.author.username}`}
                        width={32}
                        height={32}
                        className="rounded-full"
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-sm truncate">
                            {tweet.author.displayName}
                          </span>
                          {tweet.author.verified && (
                            <CheckCircle className="h-3 w-3 text-blue-500" />
                          )}
                          {tweet.author.blueCheckmark && (
                            <CheckCircle className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{tweet.author.username} • {formatNumber(tweet.author.followers)} followers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Virality</div>
                      <div className="text-sm font-semibold text-sky-600">
                        {tweet.viralityScore}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="text-sm leading-relaxed">
                    {tweet.content}
                  </div>

                  {/* Hashtags */}
                  {tweet.hashtags && tweet.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tweet.hashtags.slice(0, 3).map((hashtag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs bg-sky-100 text-sky-700 border-sky-300"
                        >
                          #{hashtag}
                        </Badge>
                      ))}
                      {tweet.hashtags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          +{tweet.hashtags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        {formatNumber(tweet.metrics.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        {formatNumber(tweet.metrics.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="h-3 w-3 text-green-500" />
                        {formatNumber(tweet.metrics.retweets)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        {formatNumber(tweet.metrics.replies)}
                      </span>
                    </div>
                    <div>
                      {tweet.tweetType === "video" && (
                        <Badge
                          variant="destructive"
                          className="text-xs bg-red-500/20 text-red-700 backdrop-blur-sm border-2 border-red-300/50"
                        >
                          Video
                        </Badge>
                      )}
                      {tweet.tweetType === "image" && (
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 backdrop-blur-sm border-2 border-green-300/50 text-xs">
                          Image
                        </Badge>
                      )}
                      {tweet.tweetType === "quote" && (
                        <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-300 backdrop-blur-sm border-2 border-purple-300/50 text-xs">
                          Quote
                        </Badge>
                      )}
                      {tweet.tweetType === "thread" && (
                        <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 backdrop-blur-sm border-2 border-blue-300/50 text-xs">
                          Thread
                        </Badge>
                      )}
                      {tweet.tweetType === "text" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100/50 backdrop-blur-sm border-2 border-gray-300/50"
                        >
                          Text
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div>{tweet.postedAt}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenTweet(tweet.tweetUrl)}
                        className="text-sky-600 hover:text-sky-800 cursor-pointer transition-colors"
                      >
                        View Tweet
                      </button>
                      <span className="text-gray-400">•</span>
                      <button
                        onClick={() => handleAnalyzeTweet(tweet.id)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
                      >
                        Analyze
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm">
                    Try adjusting your filters or search query
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}