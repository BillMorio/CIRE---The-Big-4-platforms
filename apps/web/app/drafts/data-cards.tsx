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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  User,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpDown,
  Filter as FilterIcon,
} from "lucide-react";
import Link from "next/link";

interface DataCardsProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataCards<TData, TValue>({
  columns,
  data,
}: DataCardsProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "updatedAt", desc: true }, // Default sort by most recent
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
        pageSize: 12,
      },
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary" className="text-xs">Draft</Badge>;
      case "ready-to-publish":
        return <Badge variant="outline" className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">Ready to Publish</Badge>;
      case "in-review":
        return <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">In Review</Badge>;
      default:
        return null;
    }
  };

  const getSourceIcon = (source: string) => {
    return source === "ai-generated" ? 
      <Bot className="w-4 h-4 text-blue-500" /> : 
      <User className="w-4 h-4 text-purple-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Global Search */}
        <div className="flex-1">
          <Input
            placeholder="Search drafts by title or content..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={
            (table.getColumn("status")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("status")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="ready-to-publish">Ready to Publish</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
          </SelectContent>
        </Select>

        {/* Source Filter */}
        <Select
          value={
            (table.getColumn("source")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("source")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <FilterIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="ai-generated">AI Generated</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select
          value={sorting[0]?.id ?? "updatedAt"}
          onValueChange={(value) => {
            setSorting([{ id: value, desc: true }]);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="z-[1000]">
            <SelectItem value="updatedAt">Most Recent</SelectItem>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {table.getRowModel().rows.length} of {data.length} drafts
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const draft = row.original as any;
            return (
              <Card 
                key={row.id} 
                className="hover:shadow-lg transition-shadow bg-gradient-to-r from-gray-900/5 to-gray-900/10 dark:from-gray-100/5 dark:to-gray-100/10 border-gray-200 dark:border-gray-700"
              >
                <CardContent className="p-5">
                  {/* Header with source icon, platform badge, and status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getSourceIcon(draft.source)}
                      {draft.platform && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            draft.platform === "Twitter" ? "bg-gray-900/10 dark:bg-gray-100/10 text-gray-900 dark:text-gray-100 border-gray-900/20 dark:border-gray-100/20" :
                            draft.platform === "Reddit" ? "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/20 dark:border-orange-500/30" :
                            draft.platform === "LinkedIn" ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-600/20 dark:border-blue-600/30" :
                            draft.platform === "YouTube" ? "bg-red-600/10 dark:bg-red-600/20 text-red-700 dark:text-red-300 border-red-600/20 dark:border-red-600/30" :
                            "bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/20 dark:border-gray-500/30"
                          }`}
                        >
                          {draft.platform}
                        </Badge>
                      )}
                      {getStatusBadge(draft.status)}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Title */}
                  <Link href={`/drafts/${draft.id}`}>
                    <h3 className="font-semibold text-base mb-2 line-clamp-2 hover:underline cursor-pointer">
                      {draft.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {draft.excerpt}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs mb-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(draft.updatedAt)}</span>
                    </div>
                    {draft.source === "ai-generated" && draft.sourceDetails && (
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          draft.sourceDetails.platform === "Twitter" ? "bg-gray-900/10 dark:bg-gray-100/10 text-gray-900 dark:text-gray-100 border-gray-900/20 dark:border-gray-100/20" :
                          draft.sourceDetails.platform === "Reddit" ? "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/20 dark:border-orange-500/30" :
                          draft.sourceDetails.platform === "LinkedIn" ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 border-blue-600/20 dark:border-blue-600/30" :
                          draft.sourceDetails.platform === "YouTube" ? "bg-red-600/10 dark:bg-red-600/20 text-red-700 dark:text-red-400 border-red-600/20 dark:border-red-600/30" :
                          "bg-gray-500/10 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/30"
                        }`}
                      >
                        {draft.sourceDetails.platform} {draft.sourceDetails.originalAuthor}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" asChild className="flex-1">
                      <Link href={`/drafts/${draft.id}`}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    {draft.status === "draft" && (
                      <Button size="sm" variant="outline" className="flex-1">
                        Mark Ready
                      </Button>
                    )}
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
                  <p className="text-lg font-medium">No drafts found</p>
                  <p className="text-sm">
                    Try adjusting your filters or create a new draft
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
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
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per page:</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-9 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
