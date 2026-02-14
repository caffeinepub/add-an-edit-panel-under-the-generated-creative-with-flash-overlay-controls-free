import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BrandKitStep } from './steps/BrandKitStep';
import { BriefStep } from './steps/BriefStep';
import { AssetsStep } from './steps/AssetsStep';
import { OutputStep } from './steps/OutputStep';
import { useStudioState } from './state/useStudioState';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Step = 'brand' | 'brief' | 'assets' | 'output';

const STEPS: { id: Step; label: string; description: string }[] = [
  { id: 'brand', label: 'Brand Kit', description: 'Upload logo & choose colors' },
  { id: 'brief', label: 'Brief', description: 'Describe your campaign' },
  { id: 'assets', label: 'Assets', description: 'Add reference images' },
  { id: 'output', label: 'Generate', description: 'Create your content' },
];

export function StudioPage() {
  const [currentStep, setCurrentStep] = useState<Step>('brand');
  const loadState = useStudioState((state) => state.loadState);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const canGoNext = currentStepIndex < STEPS.length - 1;
  const canGoPrev = currentStepIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep(STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentStep(STEPS[currentStepIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: Step) => {
    setCurrentStep(stepId);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    className="flex flex-col items-center group"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground scale-110'
                          : isCompleted
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      } group-hover:scale-105`}
                    >
                      {index + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-sm font-medium ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-muted-foreground hidden sm:block">
                        {step.description}
                      </div>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-colors ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 'brand' && <BrandKitStep />}
          {currentStep === 'brief' && <BriefStep />}
          {currentStep === 'assets' && <AssetsStep />}
          {currentStep === 'output' && <OutputStep />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            className="gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
