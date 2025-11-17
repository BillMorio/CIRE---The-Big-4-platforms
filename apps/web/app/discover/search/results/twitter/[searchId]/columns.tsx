"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type Tweet = {
  id: string;
  tweetUrl: string;
  content: string;
  fullContent: string;
  author: {
    username: string;
    displayName: string;
    avatar: string;
    followers: number;
    verified: boolean;
    blueCheckmark: boolean;
  };
  tweetType: "text" | "image" | "video" | "quote" | "retweet" | "thread";
  media?: {
    type: "image" | "video" | "gif";
    url: string;
    thumbnail?: string;
  }[];
  metrics: {
    views: number;
    likes: number;
    retweets: number;
    quotes: number;
    replies: number;
    bookmarks: number;
    engagementRate: number;
  };
  postedAt: string;
  viralityScore: number;
  isTrending: boolean;
  hashtags: string[];
  mentions: string[];
  isReply: boolean;
  replyToId?: string;
  threadId?: string;
};

export const columns: ColumnDef<Tweet>[] = [
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
    accessorFn: (row) => row.metrics.retweets,
    id: "retweets",
    header: "Retweets",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.replies,
    id: "replies",
    header: "Replies",
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
    accessorFn: (row) => row.author.username,
    id: "authorUsername",
    header: "Author",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "tweetType",
    id: "tweetType",
    header: "Tweet Type",
    enableColumnFilter: true,
  },
  {
    accessorKey: "postedAt",
    id: "postedAt",
    header: "Posted At",
    enableSorting: true,
  },
];