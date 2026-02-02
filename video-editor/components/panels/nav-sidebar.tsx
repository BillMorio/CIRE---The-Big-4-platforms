"use client";

import { useState } from "react";
import { 
  LayoutGrid, 
  FileText, 
  FolderOpen, 
  Settings, 
  Download,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface NavSidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export function NavSidebar({ activeItem = "studio", onItemClick }: NavSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { id: "studio", label: "Studio", icon: <LayoutGrid className="w-5 h-5" /> },
    { id: "scripts", label: "Scripts", icon: <FileText className="w-5 h-5" /> },
    { id: "assets", label: "Assets", icon: <FolderOpen className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
    { id: "export", label: "Export", icon: <Download className="w-5 h-5" /> },
  ];

  return (
    <aside 
      className={cn(
        "h-full border-r border-border bg-card/50 flex flex-col transition-all duration-300 ease-in-out shrink-0",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo / Brand */}
      <div className={cn(
        "h-14 border-b border-border flex items-center px-4 gap-3",
        isCollapsed && "justify-center px-0"
      )}>
        <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
          <LayoutGrid className="w-4 h-4 text-primary" />
        </div>
        {!isCollapsed && (
          <span className="font-bold text-sm tracking-tight">Video Editor</span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-medium",
              activeItem === item.id 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            {item.icon}
            {!isCollapsed && (
              <span className="technical-label text-[11px] uppercase tracking-wider">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full flex items-center gap-2 text-muted-foreground hover:text-foreground",
            isCollapsed && "justify-center"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-[10px] technical-label uppercase tracking-wider">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
