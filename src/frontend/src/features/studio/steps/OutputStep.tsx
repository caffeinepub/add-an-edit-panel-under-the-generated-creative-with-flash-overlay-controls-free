import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyVariantsPanel } from '../components/CopyVariantsPanel';
import { CreativePreview } from '../components/CreativePreview';
import { ResultsChecklist } from '../components/ResultsChecklist';

export function OutputStep() {
  const [activeTab, setActiveTab] = useState<'copy' | 'creatives'>('copy');

  return (
    <div className="space-y-6">
      {/* Summary Checklist */}
      <ResultsChecklist />

      {/* Main Output */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
          <CardDescription>
            Create marketing copy and visual creatives for your campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'copy' | 'creatives')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="copy">Marketing Copy</TabsTrigger>
              <TabsTrigger value="creatives">Visual Creatives</TabsTrigger>
            </TabsList>

            <TabsContent value="copy" className="space-y-4 mt-6">
              <CopyVariantsPanel />
            </TabsContent>

            <TabsContent value="creatives" className="space-y-4 mt-6">
              <CreativePreview />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
