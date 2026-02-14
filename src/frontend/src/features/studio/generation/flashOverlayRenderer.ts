import { SeededRandom } from './seededRandom';

export interface FlashOverlaySettings {
  enabled: boolean;
  intensity: number; // 0.0 to 1.0
  amount: number; // 1 to 10
  layerPosition: 'behind-logo' | 'above-logo';
  color: string; // hex color for tint
  size: number; // 0.5 to 2.0 scale multiplier
  positionX: number; // -0.5 to 0.5 offset
  positionY: number; // -0.5 to 0.5 offset
  animationSpeed: number; // 0.5 to 2.0 visual effect multiplier
}

interface FlashInstance {
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: 'burst' | 'glare' | 'flare' | 'streak';
  opacity: number;
}

export function renderFlashOverlays(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  settings: FlashOverlaySettings,
  seed: number
): void {
  if (!settings.enabled || settings.amount === 0) {
    return;
  }

  const rng = new SeededRandom(seed + 999); // Salt to differentiate from background seed
  const instances: FlashInstance[] = [];

  // Apply position offsets
  const offsetX = settings.positionX * width;
  const offsetY = settings.positionY * height;

  // Generate flash instances deterministically
  for (let i = 0; i < settings.amount; i++) {
    const type = ['burst', 'glare', 'flare', 'streak'][rng.nextInt(0, 3)] as FlashInstance['type'];
    
    instances.push({
      x: rng.nextFloat(0.1, 0.9) * width + offsetX,
      y: rng.nextFloat(0.1, 0.9) * height + offsetY,
      size: rng.nextFloat(80, 300) * (settings.intensity * 0.5 + 0.5) * settings.size,
      rotation: rng.nextFloat(0, Math.PI * 2) * settings.animationSpeed,
      type,
      opacity: rng.nextFloat(0.3, 0.8) * settings.intensity,
    });
  }

  // Parse color for tinting
  const tintColor = hexToRgb(settings.color);

  // Render each flash instance
  ctx.save();
  instances.forEach((flash) => {
    ctx.save();
    ctx.translate(flash.x, flash.y);
    ctx.rotate(flash.rotation);
    ctx.globalAlpha = flash.opacity;

    switch (flash.type) {
      case 'burst':
        renderBurst(ctx, flash.size, tintColor);
        break;
      case 'glare':
        renderGlare(ctx, flash.size, tintColor);
        break;
      case 'flare':
        renderFlare(ctx, flash.size, tintColor);
        break;
      case 'streak':
        renderStreak(ctx, flash.size, tintColor);
        break;
    }

    ctx.restore();
  });
  ctx.restore();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

function applyTint(baseColor: string, tint: { r: number; g: number; b: number }, alpha: number): string {
  // Extract base color values and blend with tint
  const match = baseColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return baseColor;
  
  const baseR = parseInt(match[1]);
  const baseG = parseInt(match[2]);
  const baseB = parseInt(match[3]);
  const baseA = match[4] ? parseFloat(match[4]) : 1;
  
  // Blend with tint (50/50 mix)
  const r = Math.round((baseR + tint.r) / 2);
  const g = Math.round((baseG + tint.g) / 2);
  const b = Math.round((baseB + tint.b) / 2);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha * baseA})`;
}

function renderBurst(ctx: CanvasRenderingContext2D, size: number, tint: { r: number; g: number; b: number }): void {
  const rays = 12;
  const innerRadius = size * 0.1;
  const outerRadius = size;

  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius);
  gradient.addColorStop(0, applyTint('rgba(255, 255, 255, 0.9)', tint, 0.9));
  gradient.addColorStop(0.3, applyTint('rgba(255, 255, 200, 0.6)', tint, 0.6));
  gradient.addColorStop(0.7, applyTint('rgba(255, 255, 150, 0.2)', tint, 0.2));
  gradient.addColorStop(1, applyTint('rgba(255, 255, 100, 0)', tint, 0));

  ctx.fillStyle = gradient;
  ctx.beginPath();
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    const nextAngle = ((i + 1) / rays) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;

    ctx.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
    ctx.lineTo(Math.cos(midAngle) * innerRadius, Math.sin(midAngle) * innerRadius);
  }
  ctx.closePath();
  ctx.fill();
}

function renderGlare(ctx: CanvasRenderingContext2D, size: number, tint: { r: number; g: number; b: number }): void {
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
  gradient.addColorStop(0, applyTint('rgba(255, 255, 255, 1)', tint, 1));
  gradient.addColorStop(0.2, applyTint('rgba(255, 255, 240, 0.8)', tint, 0.8));
  gradient.addColorStop(0.5, applyTint('rgba(255, 255, 200, 0.4)', tint, 0.4));
  gradient.addColorStop(1, applyTint('rgba(255, 255, 150, 0)', tint, 0));

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fill();

  // Add bright center
  const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3);
  centerGradient.addColorStop(0, applyTint('rgba(255, 255, 255, 1)', tint, 1));
  centerGradient.addColorStop(1, applyTint('rgba(255, 255, 255, 0)', tint, 0));
  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

function renderFlare(ctx: CanvasRenderingContext2D, size: number, tint: { r: number; g: number; b: number }): void {
  // Lens flare with multiple circles
  const circles = [
    { offset: 0, size: 1, opacity: 1 },
    { offset: 0.3, size: 0.6, opacity: 0.7 },
    { offset: 0.6, size: 0.4, opacity: 0.5 },
    { offset: 0.9, size: 0.3, opacity: 0.4 },
  ];

  circles.forEach((circle) => {
    const x = circle.offset * size * 0.5;
    const circleSize = size * circle.size;

    const gradient = ctx.createRadialGradient(x, 0, 0, x, 0, circleSize);
    gradient.addColorStop(0, applyTint(`rgba(255, 255, 255, ${circle.opacity})`, tint, circle.opacity));
    gradient.addColorStop(0.4, applyTint(`rgba(255, 240, 200, ${circle.opacity * 0.6})`, tint, circle.opacity * 0.6));
    gradient.addColorStop(1, applyTint(`rgba(255, 220, 150, 0)`, tint, 0));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, 0, circleSize, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderStreak(ctx: CanvasRenderingContext2D, size: number, tint: { r: number; g: number; b: number }): void {
  const length = size * 2;
  const width = size * 0.3;

  const gradient = ctx.createLinearGradient(-length / 2, 0, length / 2, 0);
  gradient.addColorStop(0, applyTint('rgba(255, 255, 255, 0)', tint, 0));
  gradient.addColorStop(0.3, applyTint('rgba(255, 255, 240, 0.8)', tint, 0.8));
  gradient.addColorStop(0.5, applyTint('rgba(255, 255, 255, 1)', tint, 1));
  gradient.addColorStop(0.7, applyTint('rgba(255, 255, 240, 0.8)', tint, 0.8));
  gradient.addColorStop(1, applyTint('rgba(255, 255, 255, 0)', tint, 0));

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, length / 2, width / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Add bright center line
  const centerGradient = ctx.createLinearGradient(-length / 2, 0, length / 2, 0);
  centerGradient.addColorStop(0, applyTint('rgba(255, 255, 255, 0)', tint, 0));
  centerGradient.addColorStop(0.5, applyTint('rgba(255, 255, 255, 1)', tint, 1));
  centerGradient.addColorStop(1, applyTint('rgba(255, 255, 255, 0)', tint, 0));

  ctx.fillStyle = centerGradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, length / 2, width / 4, 0, 0, Math.PI * 2);
  ctx.fill();
}
