"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, TrendingUp, History, Calendar, Hash, User, Video } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock search history data
const mockSearchHistory = [
  {
    id: "1",
    searchTerm: "AI productivity tools",
    platform: "Reddit",
    maxPosts: 50,
    dateSearched: "2024-11-01T10:30:00Z",
    resultsFound: 42,
    status: "completed",
  },
  {
    id: "2",
    searchTerm: "startup founder stories",
    platform: "LinkedIn",
    maxPosts: 25,
    dateSearched: "2024-10-31T15:45:00Z",
    resultsFound: 18,
    status: "completed",
  },
  {
    id: "3",
    searchTerm: "#entrepreneur mindset",
    platform: "Twitter",
    maxPosts: 100,
    dateSearched: "2024-10-30T09:15:00Z",
    resultsFound: 87,
    status: "completed",
  },
  {
    id: "4",
    searchTerm: "remote work tips",
    platform: "YouTube",
    maxPosts: 30,
    dateSearched: "2024-10-29T14:20:00Z",
    resultsFound: 0,
    status: "failed",
  },
]

// Popular topics by platform
const popularTopics = {
  all: [
    "AI productivity", "Startup growth", "Leadership tips", "Marketing strategies",
    "Personal branding", "Career advice", "Tech trends", "Business insights"
  ],
  reddit: [
    "startup advice", "productivity hacks", "career change", "side hustle",
    "tech careers", "entrepreneur life", "business failures", "success stories"
  ],
  twitter: [
    "#entrepreneur", "#productivity", "#AI", "#startup", "#leadership",
    "#marketing", "#tech", "#business", "#career", "#motivation"
  ],
  linkedin: [
    "leadership development", "career growth", "business strategy", "team management",
    "professional development", "industry insights", "thought leadership", "networking"
  ],
  youtube: [
    "business tutorials", "startup journey", "productivity systems", "marketing guides",
    "tech reviews", "career advice", "entrepreneurship", "skill development"
  ]
}

// Platform-specific scraper configurations
const scraperConfigs = {
  reddit: {
    webhook: "/webhook/reddit-scraper",
    fields: ["keywords", "subreddits", "dateRange", "maxPosts", "sortBy"],
    requiredFields: ["keywords"],
  },
  twitter: {
    webhook: "/webhook/twitter-scraper", 
    fields: ["hashtags", "keywords", "accounts", "maxPosts"],
    requiredFields: ["hashtags"],
  },
  linkedin: {
    webhook: "/webhook/linkedin-scraper",
    fields: ["keywords", "accounts", "maxPosts", "contentType"],
    requiredFields: ["keywords"],
  },
  youtube: {
    webhook: "/webhook/youtube-scraper",
    fields: ["keywords", "channels", "maxPosts", "duration"],
    requiredFields: ["keywords"],
  }
}

export default function ManualSearchPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("reddit")
  const [showAllTopics, setShowAllTopics] = useState(false)
  const router = useRouter()

  // Platform-specific form state
  const [formData, setFormData] = useState({
    // Reddit specific
    keywords: "",
    subreddits: "",
    dateRange: { from: null, to: null },
    sortBy: "hot",
    
    // Twitter specific  
    hashtags: "",
    accounts: "",
    
    // LinkedIn specific
    contentType: "all",
    
    // YouTube specific
    channels: "",
    duration: "any",
    
    // Common
    maxPosts: "50"
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSearch = async () => {
    const config = scraperConfigs[selectedPlatform as keyof typeof scraperConfigs]
    if (!config) return

    // Validate required fields
    const missingFields = config.requiredFields.filter(field => !formData[field as keyof typeof formData])
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(", ")}`)
      return
    }

    // Prepare payload based on platform
    const payload = {
      platform: selectedPlatform,
      maxPosts: parseInt(formData.maxPosts),
      timestamp: new Date().toISOString(),
      ...getPlattformSpecificPayload()
    }

    console.log(`Triggering ${config.webhook} with payload:`, payload)
    
    // TODO: Implement actual webhook call
    // try {
    //   const response = await fetch(config.webhook, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload)
    //   })
    //   const result = await response.json()
    //   // Handle response...
    // } catch (error) {
    //   console.error('Scraper webhook failed:', error)
    // }
  }

  const getPlattformSpecificPayload = () => {
    switch (selectedPlatform) {
      case "reddit":
        return {
          keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
          subreddits: formData.subreddits.split(",").map(s => s.trim()).filter(Boolean),
          dateRange: formData.dateRange,
          sortBy: formData.sortBy
        }
      case "twitter":
        return {
          hashtags: formData.hashtags.split(",").map(h => h.trim()).filter(Boolean),
          keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
          accounts: formData.accounts.split(",").map(a => a.trim()).filter(Boolean)
        }
      case "linkedin":
        return {
          keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
          accounts: formData.accounts.split(",").map(a => a.trim()).filter(Boolean),
          contentType: formData.contentType
        }
      case "youtube":
        return {
          keywords: formData.keywords.split(",").map(k => k.trim()).filter(Boolean),
          channels: formData.channels.split(",").map(c => c.trim()).filter(Boolean),
          duration: formData.duration
        }
      default:
        return {}
    }
  }

  const handlePopularTopicClick = (topic: string) => {
    if (selectedPlatform === 'twitter' && topic.startsWith('#')) {
      handleInputChange("hashtags", topic)
    } else {
      handleInputChange("keywords", topic)
    }
  }

  const currentTopics = popularTopics[selectedPlatform as keyof typeof popularTopics] || popularTopics.all
  const displayTopics = showAllTopics ? currentTopics : currentTopics.slice(0, 6)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPlatformBadge = (platform: string) => {
    const colors = {
      Reddit: "bg-orange-500",
      Twitter: "bg-blue-500", 
      LinkedIn: "bg-blue-600",
      YouTube: "bg-red-600"
    }
    return (
      <Badge className={`${colors[platform as keyof typeof colors] || "bg-gray-500"} text-white`}>
        {platform}
      </Badge>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col gap-2 mb-8 items-center text-center">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gradient pb-2">
              Content Search
            </h1>
            <p className="technical-label text-sm opacity-60 max-w-2xl">Manual Extraction Protocol // Multi-Node Discovery</p>
        </div>

        {/* Search Configuration */}
        <Card className="w-full max-w-6xl mx-auto">
          <CardHeader className="pb-4 border-b border-white/5">
            <CardTitle className="flex items-center gap-3 text-base sm:text-lg">
              {selectedPlatform === 'reddit' && <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(255,69,0,0.5)]">r</div>}
              {selectedPlatform === 'twitter' && <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-black text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]">𝕏</div>}
              {selectedPlatform === 'linkedin' && <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(0,119,181,0.5)]">in</div>}
              {selectedPlatform === 'youtube' && <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(255,0,0,0.5)]">▶</div>}
              <span className="truncate technical-label text-base opacity-100 font-black tracking-widest text-white/40">
                {selectedPlatform.toUpperCase()} SEARCH_PARAMETER_CONFIG
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            {/* Platform Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-3">
                <Label htmlFor="platform" className="text-sm font-medium">Platform *</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    <SelectItem value="reddit">Reddit</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxPosts" className="text-sm font-medium">Max Posts</Label>
                <Select value={formData.maxPosts} onValueChange={(value) => handleInputChange("maxPosts", value)}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[1000]">
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reddit-specific inputs */}
            {selectedPlatform === 'reddit' && (
              <div className="space-y-4 border rounded-xl p-4 sm:p-6 glass-reddit overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keywords" className="text-sm font-medium">Keywords *</Label>
                    <Input
                      placeholder="AI, machine learning, productivity"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subreddits" className="text-sm font-medium">Subreddits (optional)</Label>
                    <Input
                      placeholder="r/MachineLearning, r/productivity"
                      value={formData.subreddits}
                      onChange={(e) => handleInputChange("subreddits", e.target.value)}
                      className="mt-1 w-full"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortBy" className="text-sm font-medium">Sort By</Label>
                    <Select value={formData.sortBy} onValueChange={(value) => handleInputChange("sortBy", value)}>
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[1000]">
                        <SelectItem value="hot">Hot</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="rising">Rising</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dateRange" className="text-sm font-medium">Date Range (optional)</Label>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">Advanced date filtering available</div>
                  </div>
                </div>
              </div>
            )}

            {/* Twitter-specific inputs */}
            {selectedPlatform === 'twitter' && (
              <div className="space-y-4 border rounded-xl p-4 sm:p-6 glass-twitter overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hashtags" className="text-sm font-medium">Hashtags *</Label>
                    <div className="relative mt-1">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="#AI, #productivity, #startup"
                        value={formData.hashtags}
                        onChange={(e) => handleInputChange("hashtags", e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="keywords" className="text-sm font-medium">Keywords (optional)</Label>
                    <Input
                      placeholder="machine learning, productivity tips"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      className="mt-1 w-full"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accounts" className="text-sm font-medium">Target Accounts (optional)</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="@elonmusk, @naval, @paulg"
                      value={formData.accounts}
                      onChange={(e) => handleInputChange("accounts", e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* LinkedIn-specific inputs */}
            {selectedPlatform === 'linkedin' && (
              <div className="space-y-4 border rounded-xl p-4 sm:p-6 glass-linkedin overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keywords" className="text-sm font-medium">Keywords *</Label>
                    <Input
                      placeholder="leadership, business strategy, career growth"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                  <Label htmlFor="contentType" className="text-sm font-medium">Content Type</Label>
                  <Select value={formData.contentType} onValueChange={(value) => handleInputChange("contentType", value)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                        <SelectItem value="all">All Content</SelectItem>
                        <SelectItem value="posts">Posts Only</SelectItem>
                        <SelectItem value="articles">Articles Only</SelectItem>
                        <SelectItem value="videos">Videos Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="accounts" className="text-sm font-medium">Target Profiles (optional)</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="CEO names, influencer profiles"
                      value={formData.accounts}
                      onChange={(e) => handleInputChange("accounts", e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* YouTube-specific inputs */}
            {selectedPlatform === 'youtube' && (
              <div className="space-y-4 border rounded-xl p-4 sm:p-6 glass-youtube overflow-hidden">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keywords" className="text-sm font-medium">Keywords *</Label>
                    <Input
                      placeholder="tutorial, how to, business tips"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      className="mt-1 w-full"
                    />
                  </div>
                  <div>
                  <Label htmlFor="duration" className="text-sm font-medium">Video Duration</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[1000]">
                        <SelectItem value="any">Any Duration</SelectItem>
                        <SelectItem value="short">Short (&lt; 4 minutes)</SelectItem>
                        <SelectItem value="medium">Medium (4-20 minutes)</SelectItem>
                        <SelectItem value="long">Long (&gt; 20 minutes)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="channels" className="text-sm font-medium">Target Channels (optional)</Label>
                  <div className="relative mt-1">
                    <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Channel names or IDs"
                      value={formData.channels}
                      onChange={(e) => handleInputChange("channels", e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="flex justify-center sm:justify-end">
              <Button
                onClick={handleSearch}
                size="lg"
                className={cn(
                  "px-6 sm:px-8 w-full sm:w-auto rounded-xl transition-all duration-500",
                  selectedPlatform === 'reddit' && "bg-orange-500 hover:bg-orange-600 shadow-[0_0_20px_rgba(255,69,0,0.3)]",
                  selectedPlatform === 'twitter' && "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
                  selectedPlatform === 'linkedin' && "bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(0,119,181,0.3)]",
                  selectedPlatform === 'youtube' && "bg-red-600 hover:bg-red-700 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                )}
                disabled={!formData.keywords && !formData.hashtags}
              >
                <Search className="w-4 h-4 mr-2" />
                START EXTRACTION_SEQUENCE
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Popular Topics Section */}
        <div className="space-y-4 w-full">
          <h2 className="technical-label text-base opacity-40 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            POPULAR {selectedPlatform === 'all' ? '' : selectedPlatform.toUpperCase()} TOPICS
          </h2>
          <div className="flex flex-wrap gap-2 w-full overflow-hidden">
            {displayTopics.map((topic, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer hover:bg-accent transition-colors shrink-0"
                onClick={() => handlePopularTopicClick(topic)}
              >
                {topic}
              </Badge>
            ))}
            {!showAllTopics && currentTopics.length > 6 && (
              <Badge
                variant="outline"
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer hover:bg-accent transition-colors shrink-0"
                onClick={() => setShowAllTopics(true)}
              >
                +{currentTopics.length - 6} more
              </Badge>
            )}
            {showAllTopics && (
              <Badge
                variant="outline"
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-pointer hover:bg-accent transition-colors shrink-0"
                onClick={() => setShowAllTopics(false)}
              >
                Show Less
              </Badge>
            )}
          </div>
        </div>

        {/* Search History */}
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <h2 className="technical-label text-base opacity-40">RECENT SEARCH_HISTORY</h2>
          </div>
          
          <div className="grid gap-3 w-full">
            {mockSearchHistory.map((search) => (
              <Card key={search.id} className="hover:shadow-sm transition-shadow w-full">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{search.searchTerm}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(search.dateSearched).toLocaleDateString()} • {search.resultsFound} results
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      {getPlatformBadge(search.platform)}
                      {getStatusBadge(search.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePopularTopicClick(search.searchTerm)}
                        className="text-xs sm:text-sm"
                      >
                        Search Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </div>
  )
}