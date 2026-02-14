import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudioState } from '../state/useStudioState';
import { CheckCircle2, Circle } from 'lucide-react';

export function ResultsChecklist() {
  const brandKit = useStudioState((state) => state.brandKit);
  const brief = useStudioState((state) => state.brief);
  const assets = useStudioState((state) => state.assets);

  const hasLogo = !!brandKit.logoDataUrl;
  const colorCount = brandKit.colors?.length || 0;
  const hasColors = colorCount > 0;
  const hasAssets = assets.length > 0;
  const hasBrief = brief.trim().length > 10;

  const items = [
    { label: 'Campaign Brief', completed: hasBrief },
    { label: `${colorCount} Brand Color${colorCount !== 1 ? 's' : ''}`, completed: hasColors },
    { label: 'Logo', completed: hasLogo },
    { label: `${assets.length} Reference Image${assets.length !== 1 ? 's' : ''}`, completed: hasAssets },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Brand Kit Summary:</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
                <span className={`text-sm ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
