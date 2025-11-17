"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type RedditPost = {
  id: string;
  postUrl: string;
  title: string;
  content: string;
  fullContent: string;
  subreddit: string;
  subredditUrl: string;
  author: {
    username: string;
    avatar: string;
    karma: number;
    accountAge: string;
  };
  postType: "text" | "link" | "image" | "video";
  metrics: {
    upvotes: number;
    downvotes: number;
    score: number;
    upvoteRatio: number;
    comments: number;
    awards: number;
    engagementRate: number;
  };
  postedAt: string;
  viralityScore: number;
  isTrending: boolean;
  flair?: string;
  isStickied: boolean;
  isLocked: boolean;
};

export const columns: ColumnDef<RedditPost>[] = [
  {
    accessorKey: "viralityScore",
    id: "viralityScore",
    header: "Virality Score",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.score,
    id: "score",
    header: "Score",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.upvotes,
    id: "upvotes",
    header: "Upvotes",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.comments,
    id: "comments",
    header: "Comments",
    enableSorting: true,
  },
  {
    accessorFn: (row) => row.metrics.upvoteRatio,
    id: "upvoteRatio",
    header: "Upvote Ratio",
    enableSorting: true,
  },
  {
    accessorKey: "title",
    id: "title",
    header: "Title",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "subreddit",
    id: "subreddit",
    header: "Subreddit",
    enableGlobalFilter: true,
    enableColumnFilter: true,
  },
  {
    accessorFn: (row) => row.author.username,
    id: "authorUsername",
    header: "Author",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "postType",
    id: "postType",
    header: "Post Type",
    enableColumnFilter: true,
  },
  {
    accessorKey: "postedAt",
    id: "postedAt",
    header: "Posted At",
    enableSorting: true,
  },
];