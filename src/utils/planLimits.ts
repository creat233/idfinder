// Plan limits configuration
export const PLAN_LIMITS = {
  free: {
    maxStatuses: 0,
    maxProducts: 0,
    name: 'Gratuit'
  },
  essential: {
    maxStatuses: 15,
    maxProducts: 20,
    name: 'Essentiel'
  },
  premium: {
    maxStatuses: 30,
    maxProducts: 50,
    name: 'Premium'
  },
  ultimate: {
    maxStatuses: 50,
    maxProducts: 100,
    name: 'Ultimate'
  }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export const getPlanLimits = (plan: string) => {
  return PLAN_LIMITS[plan as PlanType] || PLAN_LIMITS.free;
};

export const canAddStatus = (currentCount: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  // Les utilisateurs peuvent ajouter des statuts tant qu'ils ne dépassent pas la limite totale
  // Les statuts expirent après 24h, permettant l'ajout de nouveaux
  return currentCount < limits.maxStatuses;
};

export const canAddProduct = (currentCount: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  // Les utilisateurs peuvent supprimer des produits pour en ajouter d'autres
  // mais ne peuvent jamais dépasser la limite totale
  return currentCount < limits.maxProducts;
};