import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useStudioState } from '../state/useStudioState';
import { generateCreative } from '../generation/canvasGenerator';
import { editImage } from '../generation/placeholderImageEditor';
import { Download, Sparkles, RefreshCw, Settings2, Zap, Wand2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReferenceImageSelector } from './ReferenceImageSelector';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import type { LogoPosition, LogoVisibilityTreatment, StylePreset, FlashLayerPosition } from '../state/studioTypes';

type Format = '1080x1080' | '1080x1350';

export function CreativePreview() {
  const brandKit = useStudioState((state) => state.brandKit);
  const assets = useStudioState((state) => state.assets);
  const selectedCopy = useStudioState((state) => state.selectedCopy);
  const creativeSettings = useStudioState((state) => state.creativeSettings);
  const editInstructions = useStudioState((state) => state.editInstructions);
  const updateCreativeSettings = useStudioState((state) => state.updateCreativeSettings);
  const regenerateCreative = useStudioState((state) => state.regenerateCreative);
  const updateEditInstructions = useStudioState((state) => state.updateEditInstructions);
  
  const [format, setFormat] = useState<Format>('1080x1080');
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProgress, setEditProgress] = useState(0);
  const [logoControlsOpen, setLogoControlsOpen] = useState(false);
  const [flashControlsOpen, setFlashControlsOpen] = useState(false);

  const hasLogo = brandKit.logoDataUrl !== null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setEditedUrl(null); // Clear edited version when regenerating
    
    setTimeout(async () => {
      const selectedAsset = selectedAssetIndex !== null ? assets[selectedAssetIndex] : null;
      
      const dataUrl = await generateCreative({
        format,
        brandColors: brandKit.colors || [],
        logoDataUrl: brandKit.logoDataUrl || null,
        referenceImageDataUrl: selectedAsset?.dataUrl || null,
        copy: selectedCopy,
        creativeSettings,
      });
      
      setPreviewUrl(dataUrl);
      setIsGenerating(false);
    }, 1000);
  };

  const handleRegenerate = () => {
    regenerateCreative();
  };

  const handleEdit = async () => {
    if (!previewUrl || !editInstructions.trim()) return;
    
    setIsEditing(true);
    setEditProgress(0);
    
    try {
      const edited = await editImage({
        imageDataUrl: previewUrl,
        instructions: editInstructions,
        onProgress: (percentage) => setEditProgress(percentage),
      });
      
      setEditedUrl(edited);
    } catch (error) {
      console.error('Failed to edit image:', error);
    } finally {
      setIsEditing(false);
      setEditProgress(0);
    }
  };

  // Auto-regenerate when seed changes
  useEffect(() => {
    if (previewUrl && selectedCopy) {
      handleGenerate();
    }
  }, [creativeSettings.seed]);

  const handleDownload = (url: string, suffix: string = '') => {
    if (!url) return;

    const link = document.createElement('a');
    link.href = url;
    link.download = `creative-${format}${suffix}-${Date.now()}.png`;
    link.click();
  };

  const canGenerate = selectedCopy !== null;
  const canEdit = previewUrl !== null && editInstructions.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Format</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1080x1080">Square (1080×1080)</SelectItem>
              <SelectItem value="1080x1350">Portrait (1080×1350)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Style Preset</Label>
          <Select 
            value={creativeSettings.stylePreset} 
            onValueChange={(v) => updateCreativeSettings({ stylePreset: v as StylePreset })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minimal-geometric">Minimal Geometric</SelectItem>
              <SelectItem value="bold-poster">Bold Poster</SelectItem>
              <SelectItem value="modern-gradient">Modern Gradient</SelectItem>
              <SelectItem value="abstract-pattern">Abstract Pattern</SelectItem>
              <SelectItem value="dynamic-shapes">Dynamic Shapes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            className="flex-1 gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
          <Button
            onClick={handleRegenerate}
            disabled={!previewUrl || isGenerating}
            variant="outline"
            size="icon"
            title="Regenerate with new variation"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reference Image Selector */}
      {assets.length > 0 && (
        <ReferenceImageSelector
          assets={assets}
          selectedIndex={selectedAssetIndex}
          onSelect={setSelectedAssetIndex}
        />
      )}

      {/* Advanced Controls */}
      <div className="space-y-3">
        {/* Logo Controls */}
        {hasLogo && (
          <Collapsible open={logoControlsOpen} onOpenChange={setLogoControlsOpen}>
            <Card className="p-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  <span className="font-medium">Logo Controls</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {logoControlsOpen ? 'Hide' : 'Show'}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select
                      value={creativeSettings.logoSettings.position}
                      onValueChange={(v) =>
                        updateCreativeSettings({
                          logoSettings: { ...creativeSettings.logoSettings, position: v as LogoPosition },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility Treatment</Label>
                    <Select
                      value={creativeSettings.logoSettings.visibilityTreatment}
                      onValueChange={(v) =>
                        updateCreativeSettings({
                          logoSettings: {
                            ...creativeSettings.logoSettings,
                            visibilityTreatment: v as LogoVisibilityTreatment,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shadow">Shadow</SelectItem>
                        <SelectItem value="outline">Outline</SelectItem>
                        <SelectItem value="badge">Badge</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Scale: {creativeSettings.logoSettings.scale.toFixed(1)}x</Label>
                  <Slider
                    value={[creativeSettings.logoSettings.scale]}
                    onValueChange={([v]) =>
                      updateCreativeSettings({
                        logoSettings: { ...creativeSettings.logoSettings, scale: v },
                      })
                    }
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Padding: {creativeSettings.logoSettings.padding}px</Label>
                  <Slider
                    value={[creativeSettings.logoSettings.padding]}
                    onValueChange={([v]) =>
                      updateCreativeSettings({
                        logoSettings: { ...creativeSettings.logoSettings, padding: v },
                      })
                    }
                    min={20}
                    max={120}
                    step={10}
                  />
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Flash Overlay Controls */}
        <Collapsible open={flashControlsOpen} onOpenChange={setFlashControlsOpen}>
          <Card className="p-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="font-medium">Flash Overlays</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {flashControlsOpen ? 'Hide' : 'Show'}
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable Flash Effects</Label>
                <Switch
                  checked={creativeSettings.flashOverlaySettings.enabled}
                  onCheckedChange={(checked) =>
                    updateCreativeSettings({
                      flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, enabled: checked },
                    })
                  }
                />
              </div>

              {creativeSettings.flashOverlaySettings.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Intensity: {(creativeSettings.flashOverlaySettings.intensity * 100).toFixed(0)}%</Label>
                    <Slider
                      value={[creativeSettings.flashOverlaySettings.intensity]}
                      onValueChange={([v]) =>
                        updateCreativeSettings({
                          flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, intensity: v },
                        })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Amount: {creativeSettings.flashOverlaySettings.amount}</Label>
                    <Slider
                      value={[creativeSettings.flashOverlaySettings.amount]}
                      onValueChange={([v]) =>
                        updateCreativeSettings({
                          flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, amount: Math.round(v) },
                        })
                      }
                      min={1}
                      max={10}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Size: {creativeSettings.flashOverlaySettings.size.toFixed(1)}x</Label>
                    <Slider
                      value={[creativeSettings.flashOverlaySettings.size]}
                      onValueChange={([v]) =>
                        updateCreativeSettings({
                          flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, size: v },
                        })
                      }
                      min={0.5}
                      max={2.0}
                      step={0.1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Animation Speed: {creativeSettings.flashOverlaySettings.animationSpeed.toFixed(1)}x</Label>
                    <Slider
                      value={[creativeSettings.flashOverlaySettings.animationSpeed]}
                      onValueChange={([v]) =>
                        updateCreativeSettings({
                          flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, animationSpeed: v },
                        })
                      }
                      min={0.5}
                      max={2.0}
                      step={0.1}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Position X: {creativeSettings.flashOverlaySettings.positionX.toFixed(2)}</Label>
                      <Slider
                        value={[creativeSettings.flashOverlaySettings.positionX]}
                        onValueChange={([v]) =>
                          updateCreativeSettings({
                            flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, positionX: v },
                          })
                        }
                        min={-0.5}
                        max={0.5}
                        step={0.05}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Position Y: {creativeSettings.flashOverlaySettings.positionY.toFixed(2)}</Label>
                      <Slider
                        value={[creativeSettings.flashOverlaySettings.positionY]}
                        onValueChange={([v]) =>
                          updateCreativeSettings({
                            flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, positionY: v },
                          })
                        }
                        min={-0.5}
                        max={0.5}
                        step={0.05}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Color Tint</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={creativeSettings.flashOverlaySettings.color}
                        onChange={(e) =>
                          updateCreativeSettings({
                            flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, color: e.target.value },
                          })
                        }
                        className="w-20 h-10 cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={creativeSettings.flashOverlaySettings.color}
                        onChange={(e) =>
                          updateCreativeSettings({
                            flashOverlaySettings: { ...creativeSettings.flashOverlaySettings, color: e.target.value },
                          })
                        }
                        className="flex-1"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Layer Position</Label>
                    <Select
                      value={creativeSettings.flashOverlaySettings.layerPosition}
                      onValueChange={(v) =>
                        updateCreativeSettings({
                          flashOverlaySettings: {
                            ...creativeSettings.flashOverlaySettings,
                            layerPosition: v as FlashLayerPosition,
                          },
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="behind-logo">Behind Logo</SelectItem>
                        <SelectItem value="above-logo">Above Logo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>

      {/* Preview */}
      {!canGenerate && (
        <Alert>
          <AlertDescription>
            Select a copy variant from the Marketing Copy tab to generate a creative.
          </AlertDescription>
        </Alert>
      )}

      {previewUrl && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Creative</h3>
              <Button onClick={() => handleDownload(previewUrl)} variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
            <div className="relative bg-muted rounded-lg overflow-hidden">
              <img src={previewUrl} alt="Generated creative" className="w-full h-auto" />
            </div>

            {/* Edit Section */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                <h4 className="font-semibold">Edit Creative</h4>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-instructions">
                  Describe what you want to change
                </Label>
                <Textarea
                  id="edit-instructions"
                  placeholder="For example: change the background color, adjust the text, move elements, amplify logo, etc."
                  value={editInstructions}
                  onChange={(e) => updateEditInstructions(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={handleEdit}
                disabled={!canEdit || isEditing}
                className="w-full gap-2"
              >
                <Wand2 className="w-4 h-4" />
                {isEditing ? 'Editing...' : 'Edit'}
              </Button>
              {isEditing && (
                <div className="space-y-2">
                  <Progress value={editProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing: {Math.round(editProgress)}%
                  </p>
                </div>
              )}
            </div>

            {/* Edited Result */}
            {editedUrl && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Edited Result</h4>
                  <Button onClick={() => handleDownload(editedUrl, '-edited')} variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Edited
                  </Button>
                </div>
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  <img src={editedUrl} alt="Edited creative" className="w-full h-auto" />
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
