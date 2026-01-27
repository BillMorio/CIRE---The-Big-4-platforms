"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Plus, Target } from "lucide-react";
import { useBrandCampaignStore } from "@/lib/store";
import { AppTopbar } from "@/components/app-topbar";

// Mock scheduled content data
const mockScheduledContent = [
  {
    id: "1",
    title: "Top 5 Productivity Hacks",
    platform: "Twitter" as const,
    scheduledDate: "2024-01-20",
    scheduledTime: "09:00",
    status: "scheduled" as const,
    contentType: "post" as const,
  },
  {
    id: "2",
    title: "AI in Content Creation",
    platform: "LinkedIn" as const,
    scheduledDate: "2024-01-20",
    scheduledTime: "14:00",
    status: "scheduled" as const,
    contentType: "article" as const,
  },
  {
    id: "3",
    title: "Marketing Insights Thread",
    platform: "Reddit" as const,
    scheduledDate: "2024-01-21",
    scheduledTime: "10:30",
    status: "scheduled" as const,
    contentType: "post" as const,
  },
  {
    id: "4",
    title: "Weekly Newsletter",
    platform: "Blog" as const,
    scheduledDate: "2024-01-22",
    scheduledTime: "08:00",
    status: "scheduled" as const,
    contentType: "article" as const,
  },
  {
    id: "5",
    title: "Product Launch Announcement",
    platform: "Twitter" as const,
    scheduledDate: "2024-01-23",
    scheduledTime: "15:00",
    status: "scheduled" as const,
    contentType: "post" as const,
  },
];

export default function CalendarPage() {
  const { selectedBrand, selectedCampaign, brands, campaigns } = useBrandCampaignStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const brand = brands.find(b => b.id === selectedBrand);
  const campaign = campaigns.find(c => c.id === selectedCampaign);

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getContentForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return mockScheduledContent.filter(content => content.scheduledDate === dateStr);
  };

  const stats = {
    scheduled: mockScheduledContent.length,
    thisWeek: 3,
    thisMonth: mockScheduledContent.length,
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6">
          
          {/* Campaign Context Banner */}
          {campaign && brand && (
            <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-medium truncate">{campaign.name}</span>
                  <span className="hidden sm:inline text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground truncate">{brand.name}</span>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">Content Calendar</h1>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "calendar" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="flex-1 sm:flex-none"
              >
                <Calendar className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Calendar</span>
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">List</span>
                <span className="sm:hidden">List</span>
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none">
                <Plus className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Schedule</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Card className="border border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold">{stats.scheduled}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">Scheduled</div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold">{stats.thisWeek}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">This Week</div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold">{stats.thisMonth}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1">This Month</div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar View */}
          {viewMode === "calendar" && (
            <Card className="border border-border overflow-hidden">
              <CardContent className="p-3 sm:p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-base sm:text-xl font-semibold">
                    <span className="hidden sm:inline">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                    <span className="sm:hidden">{monthNames[currentDate.getMonth()].slice(0, 3)} {currentDate.getFullYear()}</span>
                  </h2>
                  <div className="flex gap-1 sm:gap-2">
                    <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid - with overflow container */}
                <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
                  <div className="min-w-[280px] grid grid-cols-7 gap-1 sm:gap-2">
                    {/* Day headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                      <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2">
                        <span className="hidden sm:inline">{day}</span>
                        <span className="sm:hidden">{day.slice(0, 1)}</span>
                      </div>
                    ))}

                    {/* Calendar days */}
                    {days.map((day, index) => {
                      const dayContent = getContentForDate(day);
                      const today = isToday(day);
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-[60px] sm:min-h-[100px] border rounded p-1 sm:p-2 ${
                            day ? 'bg-card hover:bg-accent cursor-pointer' : 'bg-muted'
                          } ${today ? 'border-primary border-2' : 'border-border'}`}
                        >
                          {day && (
                            <>
                              <div className={`text-xs sm:text-sm font-medium mb-1 ${today ? 'font-bold' : ''}`}>
                                {day.getDate()}
                              </div>
                              <div className="space-y-0.5 sm:space-y-1">
                                {dayContent.slice(0, 2).map(content => (
                                  <div
                                    key={content.id}
                                    className="text-[10px] sm:text-xs p-1 sm:p-1.5 rounded border border-border bg-muted hover:bg-accent"
                                  >
                                    <div className="font-medium truncate">{content.title}</div>
                                    <div className="text-muted-foreground mt-0.5 hidden sm:block">{content.scheduledTime}</div>
                                  </div>
                                ))}
                                {dayContent.length > 2 && (
                                  <div className="text-[10px] sm:text-xs text-muted-foreground px-1">
                                    +{dayContent.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Content List - Always visible */}
          <Card className="border border-border">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Upcoming Content</h2>
              <div className="space-y-2 sm:space-y-3">
                {mockScheduledContent.map(content => (
                  <div
                    key={content.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border border-border rounded-lg hover:bg-accent"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{content.title}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {content.scheduledDate} at {content.scheduledTime}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="border-border text-xs">
                        {content.platform}
                      </Badge>
                      <Badge variant="outline" className="border-border text-xs">
                        {content.contentType}
                      </Badge>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

    </div>
  );
}
