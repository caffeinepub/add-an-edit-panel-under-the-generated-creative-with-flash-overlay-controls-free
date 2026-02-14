import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateImageUrl } from '../utils/assetValidation';
import { loadImageFromUrl } from '../utils/imageLoading';
import { Plus } from 'lucide-react';
import type { Asset } from '../state/studioTypes';

interface ImageUrlInputProps {
  onAdd: (asset: Asset) => void;
}

export function ImageUrlInput({ onAdd }: ImageUrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    setError(null);
    
    const validation = validateImageUrl(url);
    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setIsLoading(true);
    
    try {
      const dataUrl = await loadImageFromUrl(url);
      const fileName = url.split('/').pop() || 'image';
      
      onAdd({
        type: 'url',
        name: fileName,
        dataUrl,
        url,
      });
      
      setUrl('');
    } catch (err) {
      setError('Failed to load image from URL. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="image-url">Image URL</Label>
      <div className="flex gap-2">
        <Input
          id="image-url"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button
          onClick={handleAdd}
          disabled={!url || isLoading}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {isLoading ? 'Loading...' : 'Add'}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <p className="text-xs text-muted-foreground">
        Add direct links to images (must start with https://)
      </p>
    </div>
  );
}
