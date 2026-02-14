import type { Color, CopyVariant, CreativeSettings } from '../state/studioTypes';
import { renderDesignerBackground } from './designerBackgrounds';
import { renderLogo } from './logoRenderer';
import { renderFlashOverlays } from './flashOverlayRenderer';

interface GenerateCreativeOptions {
  format: '1080x1080' | '1080x1350';
  brandColors: Color[];
  logoDataUrl: string | null;
  referenceImageDataUrl: string | null;
  copy: CopyVariant | null;
  creativeSettings: CreativeSettings;
}

export async function generateCreative(
  options: GenerateCreativeOptions
): Promise<string> {
  const { format, brandColors, logoDataUrl, referenceImageDataUrl, copy, creativeSettings } = options;

  const [width, height] = format === '1080x1080' ? [1080, 1080] : [1080, 1350];

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Render designer background with layered elements
  renderDesignerBackground(ctx, width, height, brandColors, creativeSettings);

  // Reference image if provided (with controlled opacity and layering)
  if (referenceImageDataUrl) {
    try {
      const img = await loadImage(referenceImageDataUrl);
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > canvasAspect) {
        drawHeight = height * 0.4;
        drawWidth = drawHeight * imgAspect;
        drawX = (width - drawWidth) / 2;
        drawY = height * 0.1;
      } else {
        drawWidth = width * 0.6;
        drawHeight = drawWidth / imgAspect;
        drawX = (width - drawWidth) / 2;
        drawY = height * 0.1;
      }

      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    } catch (error) {
      console.warn('Failed to load reference image:', error);
    }
  }

  // Flash overlays behind logo (if enabled and positioned behind)
  if (creativeSettings.flashOverlaySettings.enabled && 
      creativeSettings.flashOverlaySettings.layerPosition === 'behind-logo') {
    renderFlashOverlays(
      ctx,
      width,
      height,
      creativeSettings.flashOverlaySettings,
      creativeSettings.seed
    );
  }

  // Logo with flexible positioning and visibility treatment
  if (logoDataUrl) {
    try {
      const logo = await loadImage(logoDataUrl);
      await renderLogo(ctx, logo, width, height, creativeSettings.logoSettings);
    } catch (error) {
      console.warn('Failed to load logo:', error);
    }
  }

  // Flash overlays above logo (if enabled and positioned above)
  if (creativeSettings.flashOverlaySettings.enabled && 
      creativeSettings.flashOverlaySettings.layerPosition === 'above-logo') {
    renderFlashOverlays(
      ctx,
      width,
      height,
      creativeSettings.flashOverlaySettings,
      creativeSettings.seed
    );
  }

  // Text content
  if (copy) {
    const textColor = getContrastColor(brandColors[0]?.hex || '#FFFFFF');
    const accentColor = brandColors[2]?.hex || brandColors[1]?.hex || textColor;

    // Headline
    ctx.fillStyle = textColor;
    ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    const headlineY = height * 0.45;
    wrapText(ctx, copy.headline, width / 2, headlineY, width - 120, 90);

    // Body
    ctx.font = '36px system-ui, -apple-system, sans-serif';
    const bodyY = height * 0.6;
    wrapText(ctx, copy.body, width / 2, bodyY, width - 160, 50);

    // CTA
    const ctaY = height - 180;
    const ctaWidth = 400;
    const ctaHeight = 80;
    const ctaX = (width - ctaWidth) / 2;

    ctx.fillStyle = accentColor;
    roundRect(ctx, ctaX, ctaY, ctaWidth, ctaHeight, 40);
    ctx.fill();

    ctx.fillStyle = getContrastColor(accentColor);
    ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(copy.cta, width / 2, ctaY + ctaHeight / 2);
  }

  return canvas.toDataURL('image/png');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY);
      line = words[i] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
