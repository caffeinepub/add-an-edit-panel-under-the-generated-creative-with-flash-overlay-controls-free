import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';
import type { Asset } from '../state/studioTypes';

interface ReferenceImageSelectorProps {
  assets: Asset[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
}

export function ReferenceImageSelector({
  assets,
  selectedIndex,
  onSelect,
}: ReferenceImageSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Reference Image (Optional)</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onSelect(null)}
          className={`relative aspect-square rounded-lg border-2 transition-all ${
            selectedIndex === null
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            None
          </div>
          {selectedIndex === null && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          )}
        </button>

        {assets.map((asset, index) => {
          const isSelected = index === selectedIndex;
          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-all ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img
                src={asset.dataUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
