"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type YouTubeVideo = {
  id: string;
  videoUrl: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: {
    default: string;
    medium: string;
    high: string;
  };
  channel: {
    name: string;
    channelUrl: string;
    avatar: string;
    subscribers: number;
    verified: boolean;
  };
  duration: string;
  durationSeconds: number;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagementRate: number;
  };
  publishedAt: string;
  viralityScore: number;
  isTrending: boolean;
  category: string;
  tags: string[];
  quality: "HD" | "4K" | "SD";
};

export const columns: ColumnDef<YouTubeVideo>[] = [
  {
    accessorKey: "viralityScore",
    id: "viralityScore",
    header: "Virality Score",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.views,
    id: "views",
    header: "Views",
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
    accessorFn: (row) => row.metrics.engagementRate,
    id: "engagementRate",
    header: "Engagement Rate",
    enableSorting: true,
  },
  {
    accessorKey: "title",
    id: "title",
    header: "Title",
    enableGlobalFilter: true,
  },
  {
    accessorFn: (row) => row.channel.name,
    id: "channelName",
    header: "Channel",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "duration",
    id: "duration",
    header: "Duration",
    enableSorting: true,
  },
  {
    accessorKey: "category",
    id: "category",
    header: "Category",
    enableColumnFilter: true,
  },
  {
    accessorKey: "publishedAt",
    id: "publishedAt",
    header: "Published At",
    enableSorting: true,
  },
];