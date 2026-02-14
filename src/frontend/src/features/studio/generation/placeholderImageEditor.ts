/**
 * Placeholder image editor module.
 * 
 * This module simulates an image editing process without calling external services.
 * Replace this implementation with a real REST API integration when ready.
 * 
 * Expected API integration pattern:
 * - Accept: image data URL + text instructions
 * - Return: edited image data URL
 * - Handle: progress callbacks, errors, timeouts
 */

export interface EditImageOptions {
  imageDataUrl: string;
  instructions: string;
  onProgress?: (percentage: number) => void;
}

export async function editImage(options: EditImageOptions): Promise<string> {
  const { imageDataUrl, instructions, onProgress } = options;
  
  // Simulate processing time with progress updates
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (onProgress) {
      onProgress((i / steps) * 100);
    }
  }
  
  // Placeholder: Return the original image with a subtle overlay to indicate "edited"
  // In production, this would be replaced with actual API call
  return await applyPlaceholderEdit(imageDataUrl, instructions);
}

async function applyPlaceholderEdit(imageDataUrl: string, instructions: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Add a subtle visual indicator that this is an "edited" version
      // (In production, this entire function would be replaced with API response)
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      // Add a small "EDITED" watermark in corner
      ctx.save();
      ctx.font = 'bold 24px system-ui';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('EDITED', canvas.width - 20, canvas.height - 20);
      ctx.restore();
      
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for editing'));
    };
    
    img.src = imageDataUrl;
  });
}
