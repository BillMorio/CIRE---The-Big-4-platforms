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
  MessageCircle,
  ArrowUpDown,
  Filter as FilterIcon,
  Play,
  Clock,
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

  const formatDuration = (duration: string) => {
    // Convert from formats like "PT4M13S" or return as-is if already formatted
    return duration.replace("PT", "").replace("M", ":").replace("S", "");
  };

  const handleAnalyzeVideo = (videoId: string) => {
    router.push(`/youtube/inspiration/video/${videoId}`);
  };

  const handleWatchVideo = (videoUrl: string) => {
    window.open(videoUrl, "_blank");
  };

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Global Search */}
        <div className="flex-1">
          <Input
            placeholder="Search videos, channels..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("category")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Entertainment">Entertainment</SelectItem>
            <SelectItem value="Music">Music</SelectItem>
            <SelectItem value="Gaming">Gaming</SelectItem>
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
            <SelectItem value="comments">Most Comments</SelectItem>
            <SelectItem value="engagementRate">Engagement Rate</SelectItem>
            <SelectItem value="publishedAt">Most Recent</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
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
            const video = row.original as any; // Type assertion for the video data
            return (
              <Card
                key={row.id}
                className="hover:shadow-md transition-shadow bg-gradient-to-t from-red-50/30 to-card shadow-xs dark:from-red-950/10 dark:bg-card group"
              >
                <CardHeader className="pb-3">
                  {/* Thumbnail with Play Button Overlay */}
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <Image
                      src={video.thumbnail.medium}
                      alt={video.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full h-10 w-10 p-0"
                        onClick={() => handleWatchVideo(video.videoUrl)}
                      >
                        <Play className="h-4 w-4" fill="white" />
                      </Button>
                    </div>
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(video.duration)}
                    </div>
                    {/* Quality Badge */}
                    {video.quality !== "SD" && (
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/80 text-white text-xs border-0"
                        >
                          {video.quality}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm line-clamp-2 leading-tight">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Image
                          src={video.channel.avatar}
                          alt={video.channel.name}
                          width={20}
                          height={20}
                          className="rounded-full"
                          unoptimized
                        />
                        <span className="text-xs text-muted-foreground truncate">
                          {video.channel.name}
                        </span>
                        {video.channel.verified && (
                          <CheckCircle className="h-3 w-3 text-gray-500" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Virality</div>
                        <div className="text-sm font-semibold text-red-600">
                          {video.viralityScore}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        {formatNumber(video.metrics.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        {formatNumber(video.metrics.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        {formatNumber(video.metrics.comments)}
                      </span>
                    </div>
                    <div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-gray-100/50 backdrop-blur-sm border-2 border-gray-300/50"
                      >
                        {video.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {video.publishedAt}
                  </div>

                  <div
                    onClick={() => handleAnalyzeVideo(video.videoId)}
                    className="flex items-baseline justify-end text-xs text-red-600 hover:text-red-800 cursor-pointer transition-colors"
                  >
                    <span className="mr-1">Analyze</span>
                    <svg
                      className="h-3 w-3 flex-shrink-0 translate-y-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
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