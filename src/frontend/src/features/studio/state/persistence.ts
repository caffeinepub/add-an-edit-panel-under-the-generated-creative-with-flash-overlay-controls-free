import type { StudioState, CreativeSettings } from './studioTypes';

const STORAGE_KEY = 'caffeine-social-studio-state';

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

export function saveState(state: StudioState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error);
  }
}

export function loadState(): StudioState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Ensure backward compatibility: add creativeSettings if missing
    if (!parsed.creativeSettings) {
      parsed.creativeSettings = defaultCreativeSettings;
    } else {
      // Ensure all nested properties exist
      if (!parsed.creativeSettings.logoSettings) {
        parsed.creativeSettings.logoSettings = defaultCreativeSettings.logoSettings;
      }
      if (!parsed.creativeSettings.stylePreset) {
        parsed.creativeSettings.stylePreset = defaultCreativeSettings.stylePreset;
      }
      if (parsed.creativeSettings.seed === undefined) {
        parsed.creativeSettings.seed = defaultCreativeSettings.seed;
      }
      // Add flash overlay settings if missing (backward compatibility)
      if (!parsed.creativeSettings.flashOverlaySettings) {
        parsed.creativeSettings.flashOverlaySettings = defaultCreativeSettings.flashOverlaySettings;
      } else {
        // Ensure all flash overlay properties exist
        const flash = parsed.creativeSettings.flashOverlaySettings;
        if (flash.enabled === undefined) flash.enabled = defaultCreativeSettings.flashOverlaySettings.enabled;
        if (flash.intensity === undefined) flash.intensity = defaultCreativeSettings.flashOverlaySettings.intensity;
        if (flash.amount === undefined) flash.amount = defaultCreativeSettings.flashOverlaySettings.amount;
        if (!flash.layerPosition) flash.layerPosition = defaultCreativeSettings.flashOverlaySettings.layerPosition;
        // Add new flash overlay properties with defaults
        if (!flash.color) flash.color = defaultCreativeSettings.flashOverlaySettings.color;
        if (flash.size === undefined) flash.size = defaultCreativeSettings.flashOverlaySettings.size;
        if (flash.positionX === undefined) flash.positionX = defaultCreativeSettings.flashOverlaySettings.positionX;
        if (flash.positionY === undefined) flash.positionY = defaultCreativeSettings.flashOverlaySettings.positionY;
        if (flash.animationSpeed === undefined) flash.animationSpeed = defaultCreativeSettings.flashOverlaySettings.animationSpeed;
      }
    }
    
    // Add editInstructions if missing (backward compatibility)
    if (parsed.editInstructions === undefined) {
      parsed.editInstructions = '';
    }
    
    return parsed;
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error);
    return null;
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear state from localStorage:', error);
  }
}
