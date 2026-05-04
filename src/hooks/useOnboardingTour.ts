import { useState, useEffect, useCallback } from "react";

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  icon: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

const TOUR_STORAGE_KEY = "finder-id-onboarding-completed";

export const useOnboardingTour = (tourId: string, steps: TourStep[]) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const completed = localStorage.getItem(`${TOUR_STORAGE_KEY}-${tourId}`);
    if (!completed) {
      const timer = setTimeout(() => setIsActive(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [tourId]);

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      completeTour();
    }
  }, [currentStep, steps.length]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const completeTour = useCallback(() => {
    localStorage.setItem(`${TOUR_STORAGE_KEY}-${tourId}`, "true");
    setIsActive(false);
    setCurrentStep(0);
  }, [tourId]);

  const restartTour = useCallback(() => {
    localStorage.removeItem(`${TOUR_STORAGE_KEY}-${tourId}`);
    setCurrentStep(0);
    setIsActive(true);
  }, [tourId]);

  return {
    isActive,
    currentStep,
    totalSteps: steps.length,
    step: steps[currentStep],
    next,
    prev,
    completeTour,
    restartTour,
  };
};
