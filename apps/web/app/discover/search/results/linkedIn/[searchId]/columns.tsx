"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LinkedInPost = {
  id: string;
  postUrl: string;
  author: {
    name: string;
    headline: string;
    avatar: string;
    initials: string;
  };
  content: string;
  fullContent: string;
  contentType: "text" | "video" | "carousel" | "document";
  videoLength?: string;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    engagementRate: number;
  };
  postedAt: string;
  viralityScore: number;
  isTrending: boolean;
};

export const columns: ColumnDef<LinkedInPost>[] = [
  {
    accessorKey: "viralityScore",
    id: "viralityScore",
    header: "Virality Score",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.likes,
    id: "likes",
    header: "Likes",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.comments,
    id: "comments",
    header: "Comments",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.views,
    id: "views",
    header: "Views",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.engagementRate,
    id: "engagementRate",
    header: "Engagement Rate",
    enableSorting: true,
  },
  {
    accessorKey: "content",
    id: "content",
    header: "Content",
    enableGlobalFilter: true,
  },
  {
    accessorFn: (row) => row.author.name,
    id: "authorName",
    header: "Author",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "contentType",
    id: "contentType",
    header: "Content Type",
    enableColumnFilter: true,
  },
  {
    accessorKey: "postedAt",
    id: "postedAt",
    header: "Posted At",
    enableSorting: true,
  },
];
