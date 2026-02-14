import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssetList } from '../components/AssetList';
import { ImageUrlInput } from '../components/ImageUrlInput';
import { useStudioState } from '../state/useStudioState';
import { validateImageFile } from '../utils/assetValidation';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AssetsStep() {
  const assets = useStudioState((state) => state.assets);
  const addAsset = useStudioState((state) => state.addAsset);
  const removeAsset = useStudioState((state) => state.removeAsset);
  
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError(null);

    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || 'Invalid file');
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        addAsset({
          type: 'upload',
          name: file.name,
          dataUrl,
        });
      };
      reader.readAsDataURL(file);
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reference Assets</CardTitle>
          <CardDescription>
            Upload images or add URLs to guide the visual style of your content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
              <TabsTrigger value="url">Add from URL</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-3">
                <label htmlFor="file-upload">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB each
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadError && (
                  <Alert variant="destructive">
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              <ImageUrlInput onAdd={addAsset} />
            </TabsContent>
          </Tabs>

          {/* Asset List */}
          {assets.length > 0 && (
            <div className="mt-6">
              <AssetList assets={assets} onRemove={removeAsset} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
