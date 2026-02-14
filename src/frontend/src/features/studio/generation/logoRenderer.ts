import type { LogoSettings } from '../state/studioTypes';

export async function renderLogo(
  ctx: CanvasRenderingContext2D,
  logo: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
  settings: LogoSettings
): Promise<void> {
  const baseSize = 120;
  const logoSize = baseSize * settings.scale;
  const logoAspect = logo.width / logo.height;
  const logoWidth = logoSize;
  const logoHeight = logoSize / logoAspect;

  // Calculate position
  let logoX: number;
  let logoY: number;

  switch (settings.position) {
    case 'top-left':
      logoX = settings.padding;
      logoY = settings.padding;
      break;
    case 'top-right':
      logoX = canvasWidth - logoWidth - settings.padding;
      logoY = settings.padding;
      break;
    case 'bottom-left':
      logoX = settings.padding;
      logoY = canvasHeight - logoHeight - settings.padding;
      break;
    case 'bottom-right':
      logoX = canvasWidth - logoWidth - settings.padding;
      logoY = canvasHeight - logoHeight - settings.padding;
      break;
    case 'center':
      logoX = (canvasWidth - logoWidth) / 2;
      logoY = (canvasHeight - logoHeight) / 2;
      break;
  }

  // Apply visibility treatment
  ctx.save();

  switch (settings.visibilityTreatment) {
    case 'shadow':
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      break;

    case 'outline':
      // Draw white outline
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 8;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      ctx.globalCompositeOperation = 'source-over';
      
      // Draw outline by drawing the logo multiple times with offset
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const offsetX = Math.cos(angle) * 4;
        const offsetY = Math.sin(angle) * 4;
        ctx.drawImage(logo, logoX + offsetX, logoY + offsetY, logoWidth, logoHeight);
      }
      break;

    case 'badge':
      // Draw semi-transparent background badge
      const badgePadding = 20;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.roundRect(
        logoX - badgePadding,
        logoY - badgePadding,
        logoWidth + badgePadding * 2,
        logoHeight + badgePadding * 2,
        12
      );
      ctx.fill();
      break;

    case 'none':
      // No treatment
      break;
  }

  // Draw the logo
  ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

  ctx.restore();
}
