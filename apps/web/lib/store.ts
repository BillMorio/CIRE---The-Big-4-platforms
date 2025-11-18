"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Brand, Campaign, BrandCampaignContextType, CampaignSettings } from './types';
import { mockBrands, mockCampaigns } from './mock-data';

interface BrandCampaignStore extends BrandCampaignContextType {
  initialized: boolean;
  initialize: () => void;
}

export const useBrandCampaignStore = create<BrandCampaignStore>()(
  persist(
    (set, get) => ({
      selectedBrand: null,
      selectedCampaign: null,
      brands: [],
      campaigns: [],
      initialized: false,

      // Initialize with mock data on first load
      initialize: () => {
        const state = get();
        if (!state.initialized) {
          set({
            brands: mockBrands,
            campaigns: mockCampaigns,
            selectedBrand: mockBrands[0],
            selectedCampaign: mockCampaigns[0],
            initialized: true,
          });
        }
      },

      setSelectedBrand: (brand: Brand) => {
        set({ selectedBrand: brand });
        
        // Auto-select first campaign of the brand
        const brandCampaigns = get().campaigns.filter(c => c.brandId === brand.id);
        if (brandCampaigns.length > 0) {
          set({ selectedCampaign: brandCampaigns[0] });
        } else {
          set({ selectedCampaign: null });
        }
      },

      setSelectedCampaign: (campaign: Campaign) => {
        set({ selectedCampaign: campaign });
        
        // Ensure the campaign's brand is selected
        const brand = get().brands.find(b => b.id === campaign.brandId);
        if (brand && brand.id !== get().selectedBrand?.id) {
          set({ selectedBrand: brand });
        }
      },

      addBrand: (brandData: Omit<Brand, 'id' | 'createdAt'>) => {
        const newBrand: Brand = {
          ...brandData,
          id: `brand-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          brands: [...state.brands, newBrand],
        }));
      },

      addCampaign: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newCampaign: Campaign = {
          ...campaignData,
          id: `campaign-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          campaigns: [...state.campaigns, newCampaign],
        }));
      },

      updateCampaignSettings: (campaignId: string, settings: Partial<CampaignSettings>) => {
        set((state) => ({
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === campaignId
              ? {
                  ...campaign,
                  settings: { ...campaign.settings, ...settings },
                  updatedAt: new Date().toISOString(),
                }
              : campaign
          ),
          // Update selectedCampaign if it's the one being modified
          selectedCampaign:
            state.selectedCampaign?.id === campaignId
              ? {
                  ...state.selectedCampaign,
                  settings: { ...state.selectedCampaign.settings, ...settings },
                  updatedAt: new Date().toISOString(),
                }
              : state.selectedCampaign,
        }));
      },
    }),
    {
      name: 'brand-campaign-storage',
      // Only persist selected IDs, not the full objects
      partialize: (state) => ({
        selectedBrand: state.selectedBrand,
        selectedCampaign: state.selectedCampaign,
        initialized: state.initialized,
      }),
    }
  )
);

// Hook to get campaigns for the selected brand
export const useSelectedBrandCampaigns = () => {
  const selectedBrand = useBrandCampaignStore((state) => state.selectedBrand);
  const campaigns = useBrandCampaignStore((state) => state.campaigns);
  
  if (!selectedBrand) return [];
  return campaigns.filter((c) => c.brandId === selectedBrand.id);
};
