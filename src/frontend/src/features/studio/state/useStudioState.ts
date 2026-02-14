import { create } from 'zustand';
import type { StudioState, BrandKit, Asset, CopyVariant, CreativeSettings } from './studioTypes';
import { saveState, loadState as loadPersistedState } from './persistence';

interface StudioStore extends StudioState {
  updateBrandKit: (updates: Partial<BrandKit>) => void;
  updateBrief: (brief: string) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (index: number) => void;
  setSelectedCopy: (copy: CopyVariant) => void;
  updateSelectedCopy: (updates: Partial<CopyVariant>) => void;
  updateCreativeSettings: (updates: Partial<CreativeSettings>) => void;
  regenerateCreative: () => void;
  updateEditInstructions: (instructions: string) => void;
  loadState: () => void;
}

const defaultCreativeSettings: CreativeSettings = {
  stylePreset: 'modern-gradient',
  seed: Math.floor(Math.random() * 1000000),
  logoSettings: {
    position: 'top-left',
    scale: 1.0,
    padding: 60,
    visibilityTreatment: 'shadow',
  },
  flashOverlaySettings: {
    enabled: false,
    intensity: 0.6,
    amount: 3,
    layerPosition: 'behind-logo',
    color: '#FFFFFF',
    size: 1.0,
    positionX: 0,
    positionY: 0,
    animationSpeed: 1.0,
  },
};

const initialState: StudioState = {
  brandKit: {
    logoDataUrl: null,
    logoName: null,
    colors: [],
  },
  brief: '',
  assets: [],
  copyVariants: [],
  selectedCopy: null,
  creativeSettings: defaultCreativeSettings,
  editInstructions: '',
};

export const useStudioState = create<StudioStore>((set, get) => ({
  ...initialState,

  updateBrandKit: (updates) => {
    set((state) => {
      const newBrandKit = { ...state.brandKit, ...updates };
      const newState = {
        brandKit: newBrandKit,
        brief: state.brief,
        assets: state.assets,
        copyVariants: state.copyVariants,
        selectedCopy: state.selectedCopy,
        creativeSettings: state.creativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { brandKit: newBrandKit };
    });
  },

  updateBrief: (brief) => {
    set((state) => {
      const newState = {
        brandKit: state.brandKit,
        brief,
        assets: state.assets,
        copyVariants: state.copyVariants,
        selectedCopy: state.selectedCopy,
        creativeSettings: state.creativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { brief };
    });
  },

  addAsset: (asset) => {
    set((state) => {
      const newAssets = [...state.assets, asset];
      const newState = {
        brandKit: state.brandKit,
        brief: state.brief,
        assets: newAssets,
        copyVariants: state.copyVariants,
        selectedCopy: state.selectedCopy,
        creativeSettings: state.creativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { assets: newAssets };
    });
  },

  removeAsset: (index) => {
    set((state) => {
      const newAssets = state.assets.filter((_, i) => i !== index);
      const newState = {
        brandKit: state.brandKit,
        brief: state.brief,
        assets: newAssets,
        copyVariants: state.copyVariants,
        selectedCopy: state.selectedCopy,
        creativeSettings: state.creativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { assets: newAssets };
    });
  },

  setSelectedCopy: (copy) => {
    set((state) => {
      const newState = {
        brandKit: state.brandKit,
        brief: state.brief,
        assets: state.assets,
        copyVariants: state.copyVariants,
        selectedCopy: copy,
        creativeSettings: state.creativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { selectedCopy: copy };
    });
  },

  updateSelectedCopy: (updates) => {
    set((state) => {
      if (!state.selectedCopy) return {};
      const newSelectedCopy = { ...state.selectedCopy, ...updates };
      const newState = {
        brandKit: state.brandKit,
        brief: state.brief,
        assets: state.assets,
        copyVariants: state.copyVariants,
        selectedCopy: newSelectedCopy,
        creativeSettings: state.creativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { selectedCopy: newSelectedCopy };
    });
  },

  updateCreativeSettings: (updates) => {
    set((state) => {
      // Handle nested updates for flashOverlaySettings
      const newCreativeSettings = {
        ...state.creativeSettings,
        ...updates,
      };
      
      // If updates contain partial flashOverlaySettings, merge them
      if (updates.flashOverlaySettings) {
        newCreativeSettings.flashOverlaySettings = {
          ...state.creativeSettings.flashOverlaySettings,
          ...updates.flashOverlaySettings,
        };
      }
      
      // If updates contain partial logoSettings, merge them
      if (updates.logoSettings) {
        newCreativeSettings.logoSettings = {
          ...state.creativeSettings.logoSettings,
          ...updates.logoSettings,
        };
      }
      
      const newState = {
        brandKit: state.brandKit,
        brief: state.brief,
        assets: state.assets,
        copyVariants: state.copyVariants,
        selectedCopy: state.selectedCopy,
        creativeSettings: newCreativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { creativeSettings: newCreativeSettings };
    });
  },

  regenerateCreative: () => {
    set((state) => {
      const newSeed = Math.floor(Math.random() * 1000000);
      const newCreativeSettings = { ...state.creativeSettings, seed: newSeed };
      const newState = {
        brandKit: state.brandKit,
        brief: state.brief,
        assets: state.assets,
        copyVariants: state.copyVariants,
        selectedCopy: state.selectedCopy,
        creativeSettings: newCreativeSettings,
        editInstructions: state.editInstructions,
      };
      saveState(newState);
      return { creativeSettings: newCreativeSettings };
    });
  },

  updateEditInstructions: (instructions) => {
    set((state) => {
      const newState = {
        brandKit: state.brandKit,
        brief: state.brief,
        assets: state.assets,
        copyVariants: state.copyVariants,
        selectedCopy: state.selectedCopy,
        creativeSettings: state.creativeSettings,
        editInstructions: instructions,
      };
      saveState(newState);
      return { editInstructions: instructions };
    });
  },

  loadState: () => {
    const loaded = loadPersistedState();
    if (loaded) {
      set(loaded);
    }
  },
}));
