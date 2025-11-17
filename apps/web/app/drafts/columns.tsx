"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type Draft = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  source: "ai-generated" | "manual";
  sourceDetails?: {
    platform: "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog";
    originalAuthor?: string;
    scrapedDate?: string;
  };
  status: "draft" | "ready-to-publish" | "in-review";
  createdAt: string;
  updatedAt: string;
  platform?: "Twitter" | "Reddit" | "LinkedIn" | "YouTube" | "Blog";
  contentType: "post" | "article" | "thread" | "video-script";
  contentCategory: "Personal Story" | "Technical" | "Advice" | "Promotional" | "Educational" | "News" | "Entertainment";
  tags?: string[];
};

export const columns: ColumnDef<Draft>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "platform",
    header: "Platform",
  },
  {
    accessorKey: "contentCategory",
    header: "Content Type",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
  },
];
