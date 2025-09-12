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

export const canAddStatus = (statusesCreatedToday: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  // Les utilisateurs peuvent ajouter des statuts tant qu'ils ne dépassent pas la limite journalière
  // Les statuts expirent après 24h, mais la limite est par jour (pas totale)
  return statusesCreatedToday < limits.maxStatuses;
};

export const canAddProduct = (currentCount: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  // Les utilisateurs peuvent supprimer des produits pour en ajouter d'autres
  // mais ne peuvent jamais dépasser la limite totale
  return currentCount < limits.maxProducts;
};

// Fonction utilitaire pour calculer les statuts créés aujourd'hui
export const countStatusesCreatedToday = (statuses: any[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return statuses.filter(status => {
    const createdAt = new Date(status.created_at);
    return createdAt >= today && createdAt < tomorrow;
  }).length;
};