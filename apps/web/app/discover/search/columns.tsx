"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

// This type defines the shape of our search history data
export type SearchHistory = {
  id: string;
  searchTerm: string;
  maxPosts: number;
  contentType: "all" | "text" | "video" | "carousel";
  dateSearched: string;
  resultsFound: number;
  status: "completed" | "running" | "failed";
};

export const columns: ColumnDef<SearchHistory>[] = [
  {
    accessorKey: "searchTerm",
    header: "Search Term",
    cell: ({ row }) => {
      const searchTerm = row.getValue("searchTerm") as string;
      return (
        <div className="font-medium max-w-[200px] truncate">{searchTerm}</div>
      );
    },
  },
  {
    accessorKey: "contentType",
    header: "Content Type",
    cell: ({ row }) => {
      const contentType = row.getValue("contentType") as string;
      const variants = {
        all: "secondary",
        text: "default",
        video: "destructive",
        carousel: "outline",
      } as const;

      return (
        <Badge variant={variants[contentType as keyof typeof variants]}>
          {contentType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "maxPosts",
    header: () => <div className="text-right">Max Posts</div>,
    cell: ({ row }) => {
      const maxPosts = row.getValue("maxPosts") as number;
      return <div className="text-right font-medium">{maxPosts}</div>;
    },
  },
  {
    accessorKey: "resultsFound",
    header: () => <div className="text-right">Results Found</div>,
    cell: ({ row }) => {
      const resultsFound = row.getValue("resultsFound") as number;
      return <div className="text-right">{resultsFound}</div>;
    },
  },
  {
    accessorKey: "dateSearched",
    header: "Date Searched",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateSearched"));
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()} at{" "}
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variants = {
        completed: "default",
        running: "secondary",
        failed: "destructive",
      } as const;

      return (
        <Badge variant={variants[status as keyof typeof variants]}>
          {status}
        </Badge>
      );
    },
  },
];
