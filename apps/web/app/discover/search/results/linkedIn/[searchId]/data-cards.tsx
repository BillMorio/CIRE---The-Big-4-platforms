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
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const handleAnalyzePost = (postId: string) => {
    router.push(`/linkedin/inspiration/post/${postId}`);
  };

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Global Search */}
        <div className="flex-1">
          <Input
            placeholder="Search posts, authors..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Content Type Filter */}
        <Select
          value={
            (table.getColumn("contentType")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("contentType")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
            <SelectItem value="document">Document</SelectItem>
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
          <SelectContent>
            <SelectItem value="viralityScore">Virality Score</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="comments">Most Comments</SelectItem>
            <SelectItem value="views">Most Views</SelectItem>
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
            const post = row.original as any; // Type assertion for the post data
            return (
              <Card
                key={row.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {post.author.name}
                      </h3>
                      <p className="text-xs text-gray-500">{post.postedAt}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Virality</div>
                      <div className="text-sm font-semibold text-green-600">
                        {post.viralityScore}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        {formatNumber(post.metrics.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        {formatNumber(post.metrics.comments)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-gray-400" />
                        {formatNumber(post.metrics.views)}
                      </span>
                    </div>
                    <div>
                      {post.contentType === "video" && (
                        <Badge
                          variant="destructive"
                          className="bg-red-500/10 text-red-600 border-red-500/20"
                        >
                          Video {post.videoLength && `• ${post.videoLength}`}
                        </Badge>
                      )}
                      {post.contentType === "carousel" && (
                        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                          Carousel
                        </Badge>
                      )}
                      {post.contentType === "text" && (
                        <Badge
                          variant="outline"
                          className="bg-muted/50 text-muted-foreground border-border/50"
                        >
                          Text
                        </Badge>
                      )}
                      {post.contentType === "document" && (
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                          Document
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => handleAnalyzePost(post.id)}
                    className="flex items-baseline justify-end text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition-colors mt-2"
                  >
                    <span className="mr-1">View</span>
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
