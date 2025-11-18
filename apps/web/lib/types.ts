// Brand and Campaign Type Definitions

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'archived';
  settings: CampaignSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignSettings {
  // Scraping Configuration
  searchKeywords: string[];
  creatorsToTrack: CreatorToTrack[];
  platforms: Platform[];
  
  // Brand Voice & AI
  brandVoice: string;
  toneGuidelines: string;
  contentPillars: string[];
  
  // Content Preferences
  targetAudience: string;
  contentTypes: ContentType[];
  excludedTopics: string[];
  
  // Publishing Preferences
  preferredPostingTimes?: string[];
  hashtagStrategy?: string;
}

export interface CreatorToTrack {
  id: string;
  name: string;
  platform: Platform;
  handle: string;
  addedAt: string;
}

export type Platform = 'Twitter' | 'LinkedIn' | 'Reddit' | 'YouTube' | 'Blog';

export type ContentType = 'Tutorial' | 'Announcement' | 'Thought Leadership' | 'Case Study' | 'Tips & Tricks' | 'News' | 'Story';

// Brand/Campaign Context Type
export interface BrandCampaignContextType {
  selectedBrand: Brand | null;
  selectedCampaign: Campaign | null;
  brands: Brand[];
  campaigns: Campaign[];
  setSelectedBrand: (brand: Brand) => void;
  setSelectedCampaign: (campaign: Campaign) => void;
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt'>) => void;
  addCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCampaignSettings: (campaignId: string, settings: Partial<CampaignSettings>) => void;
}
