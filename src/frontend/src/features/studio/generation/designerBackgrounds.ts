import type { Color, CreativeSettings } from '../state/studioTypes';
import { SeededRandom } from './seededRandom';

export function renderDesignerBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  brandColors: Color[],
  settings: CreativeSettings
): void {
  const rng = new SeededRandom(settings.seed);
  const colors = brandColors.length > 0 ? brandColors : [{ hex: '#6366F1', name: 'default' }];

  // Base background
  ctx.fillStyle = colors[0]?.hex || '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  switch (settings.stylePreset) {
    case 'minimal-geometric':
      renderMinimalGeometric(ctx, width, height, colors, rng);
      break;
    case 'bold-poster':
      renderBoldPoster(ctx, width, height, colors, rng);
      break;
    case 'modern-gradient':
      renderModernGradient(ctx, width, height, colors, rng);
      break;
    case 'abstract-pattern':
      renderAbstractPattern(ctx, width, height, colors, rng);
      break;
    case 'dynamic-shapes':
      renderDynamicShapes(ctx, width, height, colors, rng);
      break;
  }
}

function renderMinimalGeometric(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: Color[],
  rng: SeededRandom
): void {
  // Subtle gradient base
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]?.hex || '#FFFFFF');
  gradient.addColorStop(1, colors[1]?.hex || colors[0]?.hex || '#F3F4F6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Large geometric shapes with transparency
  ctx.globalAlpha = 0.15;
  
  // Circle
  const circleColor = colors[2]?.hex || colors[1]?.hex || '#000000';
  ctx.fillStyle = circleColor;
  ctx.beginPath();
  ctx.arc(width * 0.8, height * 0.3, 300, 0, Math.PI * 2);
  ctx.fill();

  // Triangle
  const triColor = colors[1]?.hex || colors[0]?.hex || '#000000';
  ctx.fillStyle = triColor;
  ctx.beginPath();
  ctx.moveTo(width * 0.1, height * 0.8);
  ctx.lineTo(width * 0.4, height * 0.8);
  ctx.lineTo(width * 0.25, height * 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1.0;
}

function renderBoldPoster(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: Color[],
  rng: SeededRandom
): void {
  // Bold solid background
  ctx.fillStyle = colors[0]?.hex || '#000000';
  ctx.fillRect(0, 0, width, height);

  // Large overlapping shapes
  ctx.globalAlpha = 0.3;

  // Rectangle 1
  ctx.fillStyle = colors[1]?.hex || '#FF0000';
  ctx.fillRect(width * 0.6, 0, width * 0.4, height * 0.5);

  // Rectangle 2
  ctx.fillStyle = colors[2]?.hex || colors[1]?.hex || '#00FF00';
  ctx.fillRect(0, height * 0.5, width * 0.5, height * 0.5);

  // Circle accent
  ctx.fillStyle = colors[3]?.hex || colors[2]?.hex || '#0000FF';
  ctx.beginPath();
  ctx.arc(width * 0.3, height * 0.3, 250, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1.0;

  // Bold lines
  ctx.strokeStyle = colors[1]?.hex || '#FFFFFF';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.7);
  ctx.lineTo(width, height * 0.7);
  ctx.stroke();
}

function renderModernGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: Color[],
  rng: SeededRandom
): void {
  // Multi-stop gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors[0]?.hex || '#6366F1');
  gradient.addColorStop(0.5, colors[1]?.hex || colors[0]?.hex || '#8B5CF6');
  gradient.addColorStop(1, colors[2]?.hex || colors[1]?.hex || '#EC4899');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Radial gradient overlay
  const radial = ctx.createRadialGradient(width * 0.7, height * 0.3, 0, width * 0.7, height * 0.3, 600);
  radial.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
  radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, width, height);

  // Geometric accents
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#FFFFFF';
  
  for (let i = 0; i < 5; i++) {
    const x = rng.next() * width;
    const y = rng.next() * height;
    const size = 100 + rng.next() * 200;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
}

function renderAbstractPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: Color[],
  rng: SeededRandom
): void {
  // Base gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colors[0]?.hex || '#1F2937');
  gradient.addColorStop(1, colors[1]?.hex || colors[0]?.hex || '#111827');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Abstract organic shapes
  ctx.globalAlpha = 0.2;

  for (let i = 0; i < 8; i++) {
    const color = colors[i % colors.length]?.hex || '#FFFFFF';
    ctx.fillStyle = color;
    
    ctx.beginPath();
    const startX = rng.next() * width;
    const startY = rng.next() * height;
    ctx.moveTo(startX, startY);
    
    for (let j = 0; j < 6; j++) {
      const cpX = startX + (rng.next() - 0.5) * 400;
      const cpY = startY + (rng.next() - 0.5) * 400;
      const endX = startX + (rng.next() - 0.5) * 300;
      const endY = startY + (rng.next() - 0.5) * 300;
      ctx.quadraticCurveTo(cpX, cpY, endX, endY);
    }
    
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;

  // Texture overlay
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 1000; i++) {
    ctx.fillStyle = rng.next() > 0.5 ? '#FFFFFF' : '#000000';
    ctx.fillRect(rng.next() * width, rng.next() * height, 2, 2);
  }
  ctx.globalAlpha = 1.0;
}

function renderDynamicShapes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: Color[],
  rng: SeededRandom
): void {
  // Vibrant base
  ctx.fillStyle = colors[0]?.hex || '#0EA5E9';
  ctx.fillRect(0, 0, width, height);

  // Multiple layered shapes
  const shapeCount = 12;
  
  for (let i = 0; i < shapeCount; i++) {
    const color = colors[i % colors.length]?.hex || '#FFFFFF';
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.15 + rng.next() * 0.15;
    
    const shapeType = Math.floor(rng.next() * 3);
    const x = rng.next() * width;
    const y = rng.next() * height;
    const size = 100 + rng.next() * 300;
    
    switch (shapeType) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 1: // Rectangle
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        break;
      case 2: // Triangle
        ctx.beginPath();
        ctx.moveTo(x, y - size / 2);
        ctx.lineTo(x + size / 2, y + size / 2);
        ctx.lineTo(x - size / 2, y + size / 2);
        ctx.closePath();
        ctx.fill();
        break;
    }
  }

  ctx.globalAlpha = 1.0;

  // Dynamic lines
  ctx.strokeStyle = colors[1]?.hex || '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.3;
  
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.moveTo(rng.next() * width, rng.next() * height);
    ctx.lineTo(rng.next() * width, rng.next() * height);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
}
