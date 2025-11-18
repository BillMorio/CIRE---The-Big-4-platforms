"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TailwindSimpleEditor from "@/components/tailwind/simple-editor";
import TailwindAdvancedEditor from "@/components/tailwind/advanced-editor";
import {
  ArrowLeft,
  Save,
  Eye,
  Calendar,
  Share2,
  Sparkles,
  FileText,
  Settings,
  MoreVertical,
  Target,
} from "lucide-react";
import { useState } from "react";
import { useBrandCampaignStore } from "@/lib/store";
import { AppTopbar } from "@/components/app-topbar";

// Mock data structure - in real app, this would come from your database
interface PlatformContent {
  content: string;
  lastEdited?: string;
}

interface DraftContent {
  id: string;
  title: string;
  category: string;
  status: string;
  platforms: {
    Twitter?: PlatformContent;
    LinkedIn?: PlatformContent;
    Reddit?: PlatformContent;
    YouTube?: PlatformContent;
    Blog?: PlatformContent;
  };
}

export default function EditorPage() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");
  const source = searchParams.get("source"); // 'draft', 'studio', 'search'
  const { selectedBrand, selectedCampaign } = useBrandCampaignStore();
  
  const [title, setTitle] = useState("Untitled Draft");
  const [platform, setPlatform] = useState<string>("Twitter");
  const [contentCategory, setContentCategory] = useState<string>("Advice");
  const [status, setStatus] = useState<string>("draft");
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mock draft content - replace with actual data fetching
  const [draftContent, setDraftContent] = useState<DraftContent>({
    id: draftId || "new",
    title: "Untitled Draft",
    category: "Advice",
    status: "draft",
    platforms: {
      Twitter: {
        content: "This is sample Twitter content...",
        lastEdited: "2 hours ago"
      },
      // LinkedIn, Reddit, etc. would be undefined until repurposed
    }
  });

  // Check if current platform has content
  const currentPlatformContent = draftContent.platforms[platform as keyof typeof draftContent.platforms];
  const hasContentForPlatform = !!currentPlatformContent;

  // Determine which editor to use based on platform
  const isYouTube = platform === "YouTube";
  const platformLimits: Record<string, number> = {
    Twitter: 280,
    LinkedIn: 3000,
    Reddit: 40000,
    YouTube: 5000, // For video descriptions
    Blog: 10000,
  };

  // Handle platform change
  const handlePlatformChange = (newPlatform: string) => {
    setPlatform(newPlatform);
  };

  // Handle repurpose action
  const handleRepurpose = async () => {
    setIsRepurposing(true);
    
    // Get the original content (prefer Twitter as source, or first available platform)
    const sourceContent = draftContent.platforms.Twitter?.content || 
                         Object.values(draftContent.platforms).find(p => p?.content)?.content || "";
    
    // TODO: Call your AI API to repurpose content for the target platform
    // For now, we'll simulate it
    setTimeout(() => {
      setDraftContent(prev => ({
        ...prev,
        platforms: {
          ...prev.platforms,
          [platform]: {
            content: `Repurposed content for ${platform}: ${sourceContent}`,
            lastEdited: "Just now"
          }
        }
      }));
      setIsRepurposing(false);
    }, 2000);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AppTopbar />
      {/* Action Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-3 md:p-4 max-w-screen-xl mx-auto w-full gap-2">
          {/* Title Input - Responsive */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <FileText className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-8 border-0 bg-transparent px-2 focus-visible:ring-0 focus-visible:ring-offset-0 font-medium text-sm md:text-base w-full"
              placeholder="Untitled Draft"
            />
          </div>
          
          {/* Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Auto-saved
            </Badge>
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>

          {/* Actions - Mobile (Dropdown) */}
          <div className="flex md:hidden items-center gap-2">
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
              <Calendar className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Editor Area */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
            {/* Mobile Settings Button - Fixed at bottom */}
            <div className="md:hidden fixed bottom-4 right-4 z-50">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button 
                    size="lg" 
                    className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    <Settings className="w-6 h-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[85vh]">
                  <div className="mx-auto w-full max-w-sm overflow-auto max-h-[calc(85vh-80px)]">
                    <DrawerHeader>
                      <DrawerTitle>Publishing Settings</DrawerTitle>
                      <DrawerDescription>
                        Configure platform, content type, and publishing options
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                      <SidebarContent 
                        platform={platform}
                        handlePlatformChange={handlePlatformChange}
                        draftContent={draftContent}
                        contentCategory={contentCategory}
                        setContentCategory={setContentCategory}
                        status={status}
                        setStatus={setStatus}
                        source={source}
                        draftId={draftId}
                      />
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
            
            {/* Campaign Context Banner */}
            {selectedCampaign && (
              <Card className="mb-4 md:mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm mb-1">
                        {selectedBrand?.logo} {selectedBrand?.name} • {selectedCampaign.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {selectedCampaign.description}
                      </div>
                      <div className="text-xs bg-purple-50 rounded p-2 border border-purple-100">
                        <strong>Brand Voice:</strong> {selectedCampaign.settings.brandVoice}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Assistant Card */}
            <Card className="mb-4 md:mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm md:text-base mb-1">AI Writing Assistant</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                      Use AI to help you write, edit, and improve your content. Type "/" for commands or select text for AI suggestions.
                    </p>
                    <div className="flex flex-wrap gap-1 md:gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        ✨ Improve writing
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        🎯 Make it shorter
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        📝 Expand ideas
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        🔄 Rephrase
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Editor Based on Platform */}
            <div className="min-h-[400px] md:min-h-[600px] rounded-lg border bg-background p-3 md:p-4 mb-20 md:mb-0">
              {!hasContentForPlatform ? (
                // Show repurpose prompt when no content exists for this platform
                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No content for {platform} yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Use AI to automatically repurpose your content for {platform}. 
                    The AI will adapt the tone, length, and format to match {platform}'s best practices.
                  </p>
                  <Button 
                    onClick={handleRepurpose}
                    disabled={isRepurposing}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {isRepurposing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Repurposing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Repurpose for {platform}
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Source: {Object.keys(draftContent.platforms).find(p => draftContent.platforms[p as keyof typeof draftContent.platforms]) || "Original"}
                  </p>
                </div>
              ) : (
                // Show editor when content exists
                <>
                  {isYouTube ? (
                    <TailwindAdvancedEditor key={`${platform}-${currentPlatformContent?.lastEdited}`} />
                  ) : (
                    <TailwindSimpleEditor
                      key={`${platform}-${currentPlatformContent?.lastEdited}`}
                      platformLimit={platformLimits[platform] || 280}
                      showHashtags={platform !== "LinkedIn"}
                      showMentions={true}
                      initialContent={currentPlatformContent?.content}
                    />
                  )}
                  {/* Platform content info */}
                  <div className="mt-4 text-xs text-muted-foreground flex items-center justify-between">
                    <span>Last edited: {currentPlatformContent?.lastEdited || "Never"}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleRepurpose}
                      disabled={isRepurposing}
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Re-repurpose
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Metadata (Desktop Only) */}
        <div className="hidden md:block w-80 border-l bg-muted/10 overflow-auto">
          <div className="p-6 space-y-6">
            <SidebarContent 
              platform={platform}
              handlePlatformChange={handlePlatformChange}
              draftContent={draftContent}
              contentCategory={contentCategory}
              setContentCategory={setContentCategory}
              status={status}
              setStatus={setStatus}
              source={source}
              draftId={draftId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable sidebar content component
function SidebarContent({
  platform,
  handlePlatformChange,
  draftContent,
  contentCategory,
  setContentCategory,
  status,
  setStatus,
  source,
  draftId
}: {
  platform: string;
  handlePlatformChange: (value: string) => void;
  draftContent: DraftContent;
  contentCategory: string;
  setContentCategory: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  source: string | null;
  draftId: string | null;
}) {
  return (
    <>
      {/* Publishing Settings */}
      <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Publishing Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Platform</label>
                  <Select value={platform} onValueChange={handlePlatformChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Twitter">
                        <div className="flex items-center gap-2">
                          Twitter/X
                          {draftContent.platforms.Twitter && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem value="LinkedIn">
                        <div className="flex items-center gap-2">
                          LinkedIn
                          {draftContent.platforms.LinkedIn && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem value="Reddit">
                        <div className="flex items-center gap-2">
                          Reddit
                          {draftContent.platforms.Reddit && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem value="YouTube">
                        <div className="flex items-center gap-2">
                          YouTube
                          {draftContent.platforms.YouTube && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                        </div>
                      </SelectItem>
                      <SelectItem value="Blog">
                        <div className="flex items-center gap-2">
                          Blog
                          {draftContent.platforms.Blog && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Content Type</label>
                  <Select value={contentCategory} onValueChange={setContentCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Personal Story">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500" />
                          Personal Story
                        </div>
                      </SelectItem>
                      <SelectItem value="Technical">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          Technical
                        </div>
                      </SelectItem>
                      <SelectItem value="Advice">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Advice
                        </div>
                      </SelectItem>
                      <SelectItem value="Promotional">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          Promotional
                        </div>
                      </SelectItem>
                      <SelectItem value="Educational">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          Educational
                        </div>
                      </SelectItem>
                      <SelectItem value="News">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          News
                        </div>
                      </SelectItem>
                      <SelectItem value="Entertainment">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          Entertainment
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="ready-to-publish">Ready to Publish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Source Info (if from AI or search) */}
            {source === "search" && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="text-sm font-semibold mb-2">Source Content</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Repurposed from manual search
                </p>
                <Badge variant="outline" className="text-xs">
                  Twitter @original_author
                </Badge>
              </div>
            )}

            {/* Platform Coverage */}
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="text-sm font-semibold mb-3">Platform Coverage</h4>
              <div className="space-y-2">
                {Object.entries({
                  Twitter: "🐦",
                  LinkedIn: "💼",
                  Reddit: "🤖",
                  YouTube: "📺",
                  Blog: "📝"
                }).map(([platformName, emoji]) => {
                  const hasPlatformContent = !!draftContent.platforms[platformName as keyof typeof draftContent.platforms];
                  return (
                    <div 
                      key={platformName}
                      className={`flex items-center justify-between text-xs p-2 rounded ${
                        platform === platformName ? 'bg-background border' : ''
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{emoji}</span>
                        <span>{platformName}</span>
                      </span>
                      {hasPlatformContent ? (
                        <span className="text-green-600 font-medium">✓ Ready</span>
                      ) : (
                        <span className="text-muted-foreground">Not created</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {draftId && (
              <div className="p-4 rounded-lg bg-muted">
                <h4 className="text-sm font-semibold mb-2">Draft Info</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Created: 2 hours ago</p>
                  <p>Last edited: Just now</p>
                  <p>Word count: 247</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div>
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Post
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Draft
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-600">
                  Delete Draft
                </Button>
              </div>
            </div>
    </>
  );
}
