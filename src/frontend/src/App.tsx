import { StudioPage } from './features/studio/StudioPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <StudioPage />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
