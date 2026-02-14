import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudioState } from '../state/useStudioState';
import { generateCopyVariants } from '../generation/copyGenerator';
import { Sparkles, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Tone = 'professional' | 'friendly' | 'bold';
type Length = 'short' | 'medium' | 'long';

export function CopyVariantsPanel() {
  const brief = useStudioState((state) => state.brief);
  const copyVariants = useStudioState((state) => state.copyVariants);
  const selectedCopy = useStudioState((state) => state.selectedCopy);
  const setSelectedCopy = useStudioState((state) => state.setSelectedCopy);
  const updateSelectedCopy = useStudioState((state) => state.updateSelectedCopy);
  
  const [tone, setTone] = useState<Tone>('professional');
  const [length, setLength] = useState<Length>('medium');
  const [variants, setVariants] = useState(copyVariants || []);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateCopyVariants(brief, tone, length);
      setVariants(generated);
      setIsGenerating(false);
    }, 800);
  };

  const handleSelectVariant = (index: number) => {
    setSelectedCopy(variants[index]);
  };

  const selectedIndex = variants.findIndex(
    (v) =>
      selectedCopy &&
      v.headline === selectedCopy.headline &&
      v.body === selectedCopy.body
  );

  const hasValidBrief = brief.trim().length > 10;

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Tone</Label>
          <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Length</Label>
          <Select value={length} onValueChange={(v) => setLength(v as Length)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleGenerate}
            disabled={!hasValidBrief || isGenerating}
            className="w-full gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Copy'}
          </Button>
        </div>
      </div>

      {!hasValidBrief && (
        <Alert>
          <AlertDescription>
            Please provide a campaign brief in the previous step to generate copy.
          </AlertDescription>
        </Alert>
      )}

      {/* Variants */}
      {variants.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base">Select a variant to customize:</Label>
            <Badge variant="secondary">{variants.length} variants</Badge>
          </div>

          <div className="grid gap-4">
            {variants.map((variant, index) => {
              const isSelected = index === selectedIndex;
              return (
                <Card
                  key={index}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-primary' : 'hover:border-primary'
                  }`}
                  onClick={() => handleSelectVariant(index)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Headline</div>
                        <div className="font-semibold text-lg">{variant.headline}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Body</div>
                        <div className="text-sm">{variant.body}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Call to Action</div>
                        <div className="text-sm font-medium">{variant.cta}</div>
                      </div>
                      {variant.hashtags && (
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Hashtags</div>
                          <div className="text-sm text-primary">{variant.hashtags}</div>
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit Selected */}
      {selectedCopy && (
        <div className="space-y-4 pt-6 border-t">
          <Label className="text-base">Customize Selected Copy:</Label>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-headline">Headline</Label>
              <Textarea
                id="edit-headline"
                value={selectedCopy.headline}
                onChange={(e) =>
                  updateSelectedCopy({ headline: e.target.value })
                }
                className="min-h-[60px]"
                spellCheck
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-body">Body</Label>
              <Textarea
                id="edit-body"
                value={selectedCopy.body}
                onChange={(e) =>
                  updateSelectedCopy({ body: e.target.value })
                }
                className="min-h-[100px]"
                spellCheck
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-cta">Call to Action</Label>
              <Textarea
                id="edit-cta"
                value={selectedCopy.cta}
                onChange={(e) =>
                  updateSelectedCopy({ cta: e.target.value })
                }
                className="min-h-[60px]"
                spellCheck
              />
            </div>

            {selectedCopy.hashtags && (
              <div className="space-y-2">
                <Label htmlFor="edit-hashtags">Hashtags</Label>
                <Textarea
                  id="edit-hashtags"
                  value={selectedCopy.hashtags}
                  onChange={(e) =>
                    updateSelectedCopy({ hashtags: e.target.value })
                  }
                  className="min-h-[60px]"
                  spellCheck
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
