import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, AlertCircle } from 'lucide-react';
import type { Asset } from '../state/studioTypes';

interface AssetListProps {
  assets: Asset[];
  onRemove: (index: number) => void;
}

export function AssetList({ assets, onRemove }: AssetListProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">
        Reference Images ({assets.length})
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {assets.map((asset, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square rounded-lg border bg-muted overflow-hidden">
              {asset.error ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-destructive p-4">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <span className="text-xs text-center">Failed to load</span>
                </div>
              ) : (
                <img
                  src={asset.dataUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="mt-2 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">{asset.name}</div>
                <Badge variant="secondary" className="text-xs mt-1">
                  {asset.type === 'upload' ? 'Uploaded' : 'URL'}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={() => onRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
