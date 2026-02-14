export interface Color {
  name: string;
  hex: string;
}

export interface BrandKit {
  logoDataUrl: string | null;
  logoName: string | null;
  colors: Color[];
}

export interface Asset {
  type: 'upload' | 'url';
  name: string;
  dataUrl: string;
  url?: string;
  error?: boolean;
}

export interface CopyVariant {
  headline: string;
  body: string;
  cta: string;
  hashtags?: string;
}

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
export type LogoVisibilityTreatment = 'shadow' | 'outline' | 'badge' | 'none';
export type StylePreset = 'minimal-geometric' | 'bold-poster' | 'modern-gradient' | 'abstract-pattern' | 'dynamic-shapes';
export type FlashLayerPosition = 'behind-logo' | 'above-logo';

export interface LogoSettings {
  position: LogoPosition;
  scale: number; // 0.5 to 2.0
  padding: number; // pixels from edge
  visibilityTreatment: LogoVisibilityTreatment;
}

export interface FlashOverlaySettings {
  enabled: boolean;
  intensity: number; // 0.0 to 1.0
  amount: number; // 1 to 10
  layerPosition: FlashLayerPosition;
  color: string; // hex color for tint
  size: number; // 0.5 to 2.0 scale multiplier
  positionX: number; // -0.5 to 0.5 offset
  positionY: number; // -0.5 to 0.5 offset
  animationSpeed: number; // 0.5 to 2.0 visual effect multiplier
}

export interface CreativeSettings {
  stylePreset: StylePreset;
  seed: number;
  logoSettings: LogoSettings;
  flashOverlaySettings: FlashOverlaySettings;
}

export interface StudioState {
  brandKit: BrandKit;
  brief: string;
  assets: Asset[];
  copyVariants: CopyVariant[];
  selectedCopy: CopyVariant | null;
  creativeSettings: CreativeSettings;
  editInstructions: string;
}
