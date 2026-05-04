import { useOnboardingTour, TourStep } from "@/hooks/useOnboardingTour";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface OnboardingTourProps {
  tourId: string;
  steps: TourStep[];
}

export const OnboardingTour = ({ tourId, steps }: OnboardingTourProps) => {
  const { isActive, currentStep, totalSteps, step, next, prev, completeTour } =
    useOnboardingTour(tourId, steps);

  if (!isActive || !step) return null;

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-[90vw] max-w-md mx-auto">
        {/* Card */}
        <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-primary to-[#7E69AB] p-6 text-primary-foreground">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium opacity-90">
                  Étape {currentStep + 1}/{totalSteps}
                </span>
              </div>
              <button
                onClick={completeTour}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/20 mb-4" />
            <div className="text-4xl mb-3">{step.icon}</div>
            <h3 className="text-xl font-bold">{step.title}</h3>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-muted-foreground leading-relaxed text-sm">
              {step.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={prev}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStep
                      ? "w-6 bg-primary"
                      : i < currentStep
                      ? "w-2 bg-primary/50"
                      : "w-2 bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button size="sm" onClick={next} className="gap-1">
              {isLast ? "Commencer !" : "Suivant"}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Skip link */}
        <button
          onClick={completeTour}
          className="block mx-auto mt-4 text-sm text-white/60 hover:text-white/90 transition-colors"
        >
          Passer le guide
        </button>
      </div>
    </div>
  );
};
