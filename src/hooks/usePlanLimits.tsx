import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PLAN_LIMITS, canAddStatus, canAddProduct } from '@/utils/planLimits';

interface UsePlanLimitsProps {
  plan: string;
  statusesCreatedToday: number;
  currentProductsCount: number;
}

export const usePlanLimits = ({ 
  plan, 
  statusesCreatedToday, 
  currentProductsCount 
}: UsePlanLimitsProps) => {
  const { toast } = useToast();
  const planLimits = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;

  const checkStatusLimit = (): boolean => {
    const canAdd = canAddStatus(statusesCreatedToday, plan);
    if (!canAdd) {
      toast({
        variant: "destructive",
        title: "Limite quotidienne atteinte",
        description: `Votre plan ${planLimits.name} permet un maximum de ${planLimits.maxStatuses} statuts par jour. Vous avez atteint cette limite aujourd'hui.`,
      });
    }
    return canAdd;
  };

  const checkProductLimit = (): boolean => {
    const canAdd = canAddProduct(currentProductsCount, plan);
    if (!canAdd) {
      toast({
        variant: "destructive",
        title: "Limite atteinte", 
        description: `Votre plan ${planLimits.name} permet un maximum de ${planLimits.maxProducts} produits/services. Vous avez atteint cette limite.`,
      });
    }
    return canAdd;
  };

  const getStatusesRemaining = (): number => {
    return Math.max(0, planLimits.maxStatuses - statusesCreatedToday);
  };

  const getProductsRemaining = (): number => {
    return Math.max(0, planLimits.maxProducts - currentProductsCount);
  };

  return {
    planLimits,
    checkStatusLimit,
    checkProductLimit,
    getStatusesRemaining,
    getProductsRemaining,
    canAddStatus: canAddStatus(statusesCreatedToday, plan),
    canAddProduct: canAddProduct(currentProductsCount, plan),
  };
};