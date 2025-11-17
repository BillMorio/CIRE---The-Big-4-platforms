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
  ArrowUp,
  MessageCircle,
  ArrowUpDown,
  Filter as FilterIcon,
  Award,
  Pin,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

  const handleAnalyzePost = (postId: string) => {
    router.push(`/reddit/inspiration/post/${postId}`);
  };

  const handleOpenPost = (postUrl: string) => {
    window.open(postUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Global Search */}
        <div className="flex-1">
          <Input
            placeholder="Search posts, subreddits, authors..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Subreddit Filter */}
        <Select
          value={
            (table.getColumn("subreddit")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("subreddit")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Subreddit" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="all">All Subreddits</SelectItem>
            <SelectItem value="programming">r/programming</SelectItem>
            <SelectItem value="MachineLearning">r/MachineLearning</SelectItem>
            <SelectItem value="startup">r/startup</SelectItem>
            <SelectItem value="entrepreneur">r/entrepreneur</SelectItem>
            <SelectItem value="productivity">r/productivity</SelectItem>
          </SelectContent>
        </Select>

        {/* Post Type Filter */}
        <Select
          value={
            (table.getColumn("postType")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("postType")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Post Type" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="text">Text Posts</SelectItem>
            <SelectItem value="link">Link Posts</SelectItem>
            <SelectItem value="image">Image Posts</SelectItem>
            <SelectItem value="video">Video Posts</SelectItem>
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
            <SelectItem value="score">Highest Score</SelectItem>
            <SelectItem value="upvotes">Most Upvotes</SelectItem>
            <SelectItem value="comments">Most Comments</SelectItem>
            <SelectItem value="upvoteRatio">Upvote Ratio</SelectItem>
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
            const post = row.original as any; // Type assertion for the post data
            return (
              <Card
                key={row.id}
                className="hover:shadow-md transition-shadow bg-gradient-to-t from-orange-50/30 to-card shadow-xs dark:from-orange-950/10 dark:bg-card"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="text-xs bg-orange-100 text-orange-700 border-orange-300"
                        >
                          r/{post.subreddit}
                        </Badge>
                        {post.flair && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-blue-100 text-blue-700"
                          >
                            {post.flair}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                        {post.isStickied && <Pin className="inline h-3 w-3 mr-1 text-green-600" />}
                        {post.isLocked && <Lock className="inline h-3 w-3 mr-1 text-gray-500" />}
                        {post.title}
                      </h3>
                      <div className="text-xs text-muted-foreground mt-1">
                        by u/{post.author.username} • {post.postedAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Virality</div>
                      <div className="text-sm font-semibold text-orange-600">
                        {post.viralityScore}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {post.content && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <ArrowUp className="h-3 w-3 text-orange-500" />
                        {formatNumber(post.metrics.score)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        {formatNumber(post.metrics.comments)}
                      </span>
                      {post.metrics.awards > 0 && (
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          {post.metrics.awards}
                        </span>
                      )}
                    </div>
                    <div>
                      {post.postType === "video" && (
                        <Badge
                          variant="destructive"
                          className="text-xs bg-red-500/20 text-red-700 backdrop-blur-sm border-2 border-red-300/50"
                        >
                          Video
                        </Badge>
                      )}
                      {post.postType === "image" && (
                        <Badge className="bg-green-500/20 text-green-700 dark:text-green-300 backdrop-blur-sm border-2 border-green-300/50 text-xs">
                          Image
                        </Badge>
                      )}
                      {post.postType === "link" && (
                        <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-300 backdrop-blur-sm border-2 border-blue-300/50 text-xs">
                          Link
                        </Badge>
                      )}
                      {post.postType === "text" && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100/50 backdrop-blur-sm border-2 border-gray-300/50"
                        >
                          Text
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      {(post.metrics.upvoteRatio * 100).toFixed(0)}% upvoted
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenPost(post.postUrl)}
                        className="text-xs text-orange-600 hover:text-orange-800 cursor-pointer transition-colors"
                      >
                        View on Reddit
                      </button>
                      <span className="text-xs text-gray-400">•</span>
                      <button
                        onClick={() => handleAnalyzePost(post.id)}
                        className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
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