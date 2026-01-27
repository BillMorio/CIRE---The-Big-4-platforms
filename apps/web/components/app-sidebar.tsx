"use client"

import * as React from "react"
import {
  BarChart3,
  Bot,
  Calendar,
  Command,
  FileText,
  Home,
  LifeBuoy,
  PenTool,
  Search,
  Send,
  Settings2,
  ChevronsUpDown,
  Check,
  Video,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command as CommandPrimitive,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useBrandCampaignStore, useSelectedBrandCampaigns } from "@/lib/store"
import { cn } from "@/lib/utils"

const data = {
  user: {
    name: "Content Creator",
    email: "user@cire.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Discover",
      url: "/discover",
      icon: Search,
    },
    {
      title: "My Drafts",
      url: "/drafts",
      icon: FileText,
    },
    {
      title: "Studio",
      url: "/studio",
      icon: PenTool,
    },
    {
      title: "YouTube Studio",
      url: "/studio/youtube/new",
      icon: Video,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  navScrapers: [
    {
      title: "Jobs",
      url: "/jobs",
      icon: BarChart3,
    },
    {
      title: "Status",
      url: "/scrapers",
      icon: Bot,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [brandOpen, setBrandOpen] = React.useState(false);
  const [campaignOpen, setCampaignOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  const {
    selectedBrand,
    selectedCampaign,
    brands,
    setSelectedBrand,
    setSelectedCampaign,
    initialize,
  } = useBrandCampaignStore();
  
  const brandCampaigns = useSelectedBrandCampaigns();

  // Initialize and hydrate store on mount
  React.useEffect(() => {
    // Hydrate persisted state
    useBrandCampaignStore.persist.rehydrate();
    initialize();
    setMounted(true);
  }, [initialize]);

  // Don't render brand/campaign selectors until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <Sidebar variant="inset" {...props}>
        <SidebarHeader className="border-b border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xl">
                  🏢
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Loading...</span>
                  <span className="truncate text-xs text-muted-foreground">Brand/Company</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar variant="inset" {...props} className="glass border-r">
      <SidebarHeader className="border-b p-4">
        <SidebarMenu className="gap-3">
          <SidebarMenuItem>
            {/* Brand Selector */}
            <Popover open={brandOpen} onOpenChange={setBrandOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="rounded-xl border hover:bg-accent/50 transition-all data-[state=open]:bg-accent/50"
                >
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-accent/30 text-xl shadow-glow">
                    {selectedBrand?.logo || "🏢"}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-black tracking-tight text-foreground">
                      {selectedBrand?.name || "Select Brand"}
                    </span>
                    <span className="technical-label">
                      Organization
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <CommandPrimitive>
                  <CommandInput placeholder="Search brands..." />
                  <CommandList>
                    <CommandEmpty>No brands found.</CommandEmpty>
                    <CommandGroup>
                      {brands.map((brand) => (
                        <CommandItem
                          key={brand.id}
                          value={brand.name}
                          onSelect={() => {
                            setSelectedBrand(brand);
                            setBrandOpen(false);
                          }}
                        >
                          <span className="mr-2 text-lg">{brand.logo || "🏢"}</span>
                          <div className="flex-1">
                            <div className="font-medium">{brand.name}</div>
                            {brand.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {brand.description}
                              </div>
                            )}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedBrand?.id === brand.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandPrimitive>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>

          <SidebarMenuItem>
            {/* Campaign Selector */}
            <Popover open={campaignOpen} onOpenChange={setCampaignOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="rounded-xl border border-border/50 hover:bg-accent/50 transition-all"
                >
                  <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-accent/30 text-foreground shadow-glow">
                    <FileText className="size-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                    <span className="truncate font-black tracking-tight text-foreground">
                      {selectedCampaign?.name || "Select Campaign"}
                    </span>
                    <span className="technical-label">
                      {selectedCampaign?.status === 'active' ? 'Operational' : 'Paused'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <CommandPrimitive>
                  <CommandInput placeholder="Search campaigns..." />
                  <CommandList>
                    <CommandEmpty>No campaigns found.</CommandEmpty>
                    <CommandGroup>
                      {brandCampaigns.map((campaign) => (
                        <CommandItem
                          key={campaign.id}
                          value={campaign.name}
                          onSelect={() => {
                            setSelectedCampaign(campaign);
                            setCampaignOpen(false);
                          }}
                        >
                          <div className="flex-1">
                            <div className="font-medium">{campaign.name}</div>
                            {campaign.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {campaign.description}
                              </div>
                            )}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedCampaign?.id === campaign.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </CommandPrimitive>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain items={data.navScrapers} label="Scraper Results" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
