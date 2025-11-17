"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { columns, SearchHistory } from "./columns";
import { DataTable } from "./data-table";

// Mock search history data with detailed attributes
const mockSearchHistory: SearchHistory[] = [
  {
    id: "1",
    searchTerm: "AI trends",
    maxPosts: 50,
    contentType: "all",
    dateSearched: "2024-10-29T10:30:00Z",
    resultsFound: 42,
    status: "completed",
  },
  {
    id: "2",
    searchTerm: "leadership development",
    maxPosts: 25,
    contentType: "text",
    dateSearched: "2024-10-28T15:45:00Z",
    resultsFound: 18,
    status: "completed",
  },
  {
    id: "3",
    searchTerm: "startup growth strategies",
    maxPosts: 100,
    contentType: "all",
    dateSearched: "2024-10-27T09:15:00Z",
    resultsFound: 87,
    status: "completed",
  },
  {
    id: "4",
    searchTerm: "remote work culture",
    maxPosts: 30,
    contentType: "video",
    dateSearched: "2024-10-26T14:20:00Z",
    resultsFound: 0,
    status: "failed",
  },
  {
    id: "5",
    searchTerm: "digital transformation",
    maxPosts: 75,
    contentType: "carousel",
    dateSearched: "2024-10-25T11:00:00Z",
    resultsFound: 63,
    status: "completed",
  },
];

// Popular topics as simple badges
const popularTopics = [
  "Artificial Intelligence",
  "Leadership Development",
  "Startup Ecosystem",
  "Remote Work Culture",
  "Digital Marketing",
  "Career Growth",
  "Personal Branding",
  "Tech Innovation",
  "Entrepreneurship",
  "Data Science",
  "Product Management",
  "Business Strategy",
];

export default function TrendingIdeasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllTopics, setShowAllTopics] = useState(false);
  const router = useRouter();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results page
      router.push(
        `/linkedin/inspiration/search/${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const handlePopularTopicClick = (topic: string) => {
    setSearchQuery(topic);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-2xl sm:text-3xl font-bold">
            Find Trending Posts
          </h1>
        </div>
        <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover trending topics and content ideas for your LinkedIn posts.
          Search for any topic to find high-performing content and insights.
        </p>
      </div>

      {/* Search Section */}
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for a topic... (e.g., AI, leadership, startups)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              size="lg"
              className="px-6 w-full sm:w-auto"
            >
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Topics Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Popular Topics</h2>
        <div className="flex flex-wrap gap-2">
          {(showAllTopics ? popularTopics : popularTopics.slice(0, 6)).map(
            (topic, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 text-sm cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handlePopularTopicClick(topic)}
              >
                {topic}
              </Badge>
            )
          )}
          {!showAllTopics && popularTopics.length > 6 && (
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setShowAllTopics(true)}
            >
              ...
            </Badge>
          )}
          {showAllTopics && (
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setShowAllTopics(false)}
            >
              Show Less
            </Badge>
          )}
        </div>
      </div>

      {/* Recent Searches Table Section */}
      <div className="mt-12 space-y-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">My Recent Searches</h2>
        </div>
        <DataTable columns={columns} data={mockSearchHistory} />
      </div>
    </div>
  );
}
