import type { StylePreset } from '../state/studioTypes';

export interface StylePresetConfig {
  name: string;
  description: string;
  characteristics: {
    layerCount: number;
    complexity: 'low' | 'medium' | 'high';
    colorUsage: 'minimal' | 'balanced' | 'vibrant';
  };
}

export const STYLE_PRESETS: Record<StylePreset, StylePresetConfig> = {
  'minimal-geometric': {
    name: 'Minimal Geometric',
    description: 'Clean, simple geometric shapes with subtle transparency',
    characteristics: {
      layerCount: 3,
      complexity: 'low',
      colorUsage: 'minimal',
    },
  },
  'bold-poster': {
    name: 'Bold Poster',
    description: 'High-contrast, bold shapes inspired by vintage posters',
    characteristics: {
      layerCount: 4,
      complexity: 'medium',
      colorUsage: 'vibrant',
    },
  },
  'modern-gradient': {
    name: 'Modern Gradient',
    description: 'Smooth gradients with soft geometric accents',
    characteristics: {
      layerCount: 5,
      complexity: 'medium',
      colorUsage: 'balanced',
    },
  },
  'abstract-pattern': {
    name: 'Abstract Pattern',
    description: 'Organic shapes and textures for artistic compositions',
    characteristics: {
      layerCount: 8,
      complexity: 'high',
      colorUsage: 'balanced',
    },
  },
  'dynamic-shapes': {
    name: 'Dynamic Shapes',
    description: 'Energetic overlapping shapes with dynamic lines',
    characteristics: {
      layerCount: 12,
      complexity: 'high',
      colorUsage: 'vibrant',
    },
  },
};
