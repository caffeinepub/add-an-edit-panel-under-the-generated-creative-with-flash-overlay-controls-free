const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PNG, JPG, or SVG images.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit. Please choose a smaller file.',
    };
  }

  return { valid: true };
}

export function validateImageUrl(url: string): ValidationResult {
  if (!url.trim()) {
    return { valid: false, error: 'URL cannot be empty.' };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return {
        valid: false,
        error: 'URL must start with http:// or https://',
      };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format.' };
  }
}
