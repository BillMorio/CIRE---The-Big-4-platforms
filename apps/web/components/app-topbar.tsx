"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { MobileBreadcrumb } from "@/components/mobile-breadcrumb";

export function AppTopbar() {
  const pathname = usePathname();

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = () => {
    const segments = pathname.split('/').filter(Boolean);
    const items = [];

    if (segments.length === 0) return [];

    // Always start with root
    if (segments[0] === 'discover') {
      // If we're on /discover root, don't show breadcrumbs
      if (segments.length === 1) return [{ label: 'Discover' }];
      
      items.push({ label: 'Discover', href: '/discover' });

      // Handle /discover/search
      if (segments[1] === 'search') {
        items.push({ label: 'Manual Search' });
      }
      
      // Handle /discover/jobs
      else if (segments[1] === 'jobs') {
        items.push({ label: 'Scraping Jobs', href: '/discover/jobs' });
        
        // Handle /discover/jobs/[platform]
        if (segments[2]) {
          const platform = segments[2];
          const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
          
          // Handle /discover/jobs/[platform]/history
          if (segments[3] === 'history') {
            items.push({ label: `${platformName} Runs` });
          }
          
          // Handle /discover/jobs/[platform]/runs/[runId]
          else if (segments[3] === 'runs' && segments[4]) {
            items.push({ 
              label: `${platformName} Runs`, 
              href: `/discover/jobs/${platform}/history` 
            });
            items.push({ 
              label: 'Run Details',
              href: `/discover/jobs/${platform}/runs/${segments[4]}`
            });
            
            // Handle /discover/jobs/[platform]/runs/[runId]/creators/[creator]
            if (segments[5] === 'creators' && segments[6]) {
              const creator = decodeURIComponent(segments[6]);
              items.push({ label: creator });
            }
            // Handle /discover/jobs/[platform]/runs/[runId]/keywords/[keyword]
            else if (segments[5] === 'keywords' && segments[6]) {
              const keyword = decodeURIComponent(segments[6]);
              items.push({ label: keyword });
            }
          }
        }
      }
    }

    return items;
  };

  // Get back button info
  const getBackButton = () => {
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length <= 1) return null;

    if (pathname.startsWith('/editor')) {
      // Check for source param from URL
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const source = params.get('source');
        
        if (source === 'draft') return { href: '/drafts', label: 'Back to Drafts' };
        if (source === 'search') return { href: '/discover/search', label: 'Back to Search' };
        if (source === 'studio') return { href: '/studio', label: 'Back to Studio' };
      }
      return { href: '/drafts', label: 'Back to Drafts' };
    }

    if (pathname.startsWith('/discover/search')) {
      return { href: '/discover', label: 'Back to Trending' };
    }
    
    if (pathname === '/discover/jobs') {
      return { href: '/discover', label: 'Back to Discover' };
    }
    
    if (pathname.includes('/jobs/') && pathname.includes('/history')) {
      return { href: '/discover/jobs', label: 'Back to Jobs' };
    }
    
    if (pathname.includes('/runs/') && !pathname.includes('/creators/') && !pathname.includes('/keywords/')) {
      const platform = segments[2];
      return { href: `/discover/jobs/${platform}/history`, label: 'Back to Runs' };
    }
    
    if (pathname.includes('/creators/') || pathname.includes('/keywords/')) {
      const platform = segments[2];
      const runId = segments[4];
      return { href: `/discover/jobs/${platform}/runs/${runId}`, label: 'Back to Run Details' };
    }
    
    return null;
  };

  const breadcrumbItems = getBreadcrumbItems();
  const backButton = getBackButton();

  // Only show topbar on discover, drafts, ai-generated, and editor routes
  const showTopbar = pathname.startsWith('/discover') || pathname.startsWith('/drafts') || pathname.startsWith('/ai-generated') || pathname.startsWith('/editor');
  if (!showTopbar) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center gap-2 px-4 bg-gray-50 border-b border-gray-200 flex-shrink-0 rounded-bl-3xl">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-4" />
      {breadcrumbItems.length > 0 && (
        <MobileBreadcrumb
          items={breadcrumbItems}
          className="flex-1 min-w-0"
        />
      )}
      {backButton && (
        <Button variant="outline" size="sm" asChild className="ml-auto">
          <Link href={backButton.href}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backButton.label}
          </Link>
        </Button>
      )}
    </header>
  );
}