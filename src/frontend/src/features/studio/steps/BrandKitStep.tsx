import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStudioState } from '../state/useStudioState';
import { validateImageFile } from '../utils/assetValidation';
import { Upload, X, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PRESET_COLORS = [
  { name: 'Coral', hex: '#FF6B6B' },
  { name: 'Ocean', hex: '#4ECDC4' },
  { name: 'Sunset', hex: '#FFE66D' },
  { name: 'Lavender', hex: '#A8DADC' },
  { name: 'Forest', hex: '#2D6A4F' },
  { name: 'Crimson', hex: '#E63946' },
  { name: 'Sky', hex: '#457B9D' },
  { name: 'Amber', hex: '#F4A261' },
];

export function BrandKitStep() {
  const brandKit = useStudioState((state) => state.brandKit);
  const updateBrandKit = useStudioState((state) => state.updateBrandKit);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(
    brandKit.logoDataUrl || null
  );
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
      updateBrandKit({
        logoDataUrl: dataUrl,
        logoName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    updateBrandKit({ logoDataUrl: null, logoName: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleColorSelect = (color: { name: string; hex: string }) => {
    const currentColors = brandKit.colors || [];
    
    // Check if already selected
    const isSelected = currentColors.some((c) => c.hex === color.hex);
    
    if (isSelected) {
      // Remove color
      updateBrandKit({
        colors: currentColors.filter((c) => c.hex !== color.hex),
      });
    } else {
      // Add color (max 4)
      if (currentColors.length < 4) {
        updateBrandKit({
          colors: [...currentColors, color],
        });
      }
    }
  };

  const handleCustomColor = (hex: string) => {
    const currentColors = brandKit.colors || [];
    if (currentColors.length >= 4) return;

    const colorName = `Custom ${currentColors.length + 1}`;
    updateBrandKit({
      colors: [...currentColors, { name: colorName, hex }],
    });
  };

  const selectedColors = brandKit.colors || [];
  const isColorSelected = (hex: string) => selectedColors.some((c) => c.hex === hex);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Identity</CardTitle>
          <CardDescription>
            Upload your logo and select up to 4 brand colors to create on-brand content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-3">
            <Label>Company Logo (Optional)</Label>
            <div className="flex items-start gap-4">
              {logoPreview ? (
                <div className="relative">
                  <div className="w-32 h-32 rounded-lg border-2 border-border bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Upload Logo</span>
                </button>
              )}
              <div className="flex-1 text-sm text-muted-foreground">
                <p>PNG, JPG, or SVG up to 5MB</p>
                <p className="mt-1">Your logo will be included in generated creatives</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Brand Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Brand Colors (Select up to 4)</Label>
              <Badge variant="secondary">
                {selectedColors.length} / 4 selected
              </Badge>
            </div>
            
            {/* Selected Colors */}
            {selectedColors.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedColors.map((color, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card"
                  >
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-sm font-medium">{color.name}</span>
                    <button
                      onClick={() => handleColorSelect(color)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Preset Colors */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {PRESET_COLORS.map((color) => {
                const selected = isColorSelected(color.hex);
                return (
                  <button
                    key={color.hex}
                    onClick={() => handleColorSelect(color)}
                    disabled={!selected && selectedColors.length >= 4}
                    className={`group relative aspect-square rounded-lg border-2 transition-all ${
                      selected
                        ? 'border-primary scale-95'
                        : 'border-transparent hover:border-border hover:scale-105'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Picker */}
            {selectedColors.length < 4 && (
              <div className="flex items-center gap-3">
                <Label htmlFor="custom-color" className="text-sm">
                  Or pick a custom color:
                </Label>
                <input
                  id="custom-color"
                  type="color"
                  onChange={(e) => handleCustomColor(e.target.value)}
                  className="h-10 w-20 rounded border cursor-pointer"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
