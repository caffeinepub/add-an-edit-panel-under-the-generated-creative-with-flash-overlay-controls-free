import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStudioState } from '../state/useStudioState';
import { Lightbulb } from 'lucide-react';

const EXAMPLE_PROMPTS = [
  'Launch announcement for our new eco-friendly water bottle line',
  'Summer sale promotion with 30% off all products',
  'Behind-the-scenes look at our manufacturing process',
  'Customer testimonial highlighting product quality',
];

export function BriefStep() {
  const brief = useStudioState((state) => state.brief);
  const updateBrief = useStudioState((state) => state.updateBrief);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Brief</CardTitle>
          <CardDescription>
            Describe your campaign goals, target audience, key messages, and any specific requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="brief">Campaign Description</Label>
            <Textarea
              id="brief"
              placeholder="Example: We're launching a new line of sustainable water bottles. Target audience is eco-conscious millennials. Key message: Stay hydrated, save the planet. Include our tagline 'Drink Responsibly' and emphasize the 100% recycled materials..."
              value={brief}
              onChange={(e) => updateBrief(e.target.value)}
              className="min-h-[200px] resize-y"
              spellCheck
            />
            <p className="text-sm text-muted-foreground">
              Be specific about your goals, audience, tone, and any must-include elements
            </p>
          </div>

          {/* Example Prompts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Need inspiration? Try these examples:</span>
            </div>
            <div className="grid gap-2">
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => updateBrief(prompt)}
                  className="text-left p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
