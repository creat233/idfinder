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
  return currentCount < limits.maxStatuses;
};

export const canAddProduct = (currentCount: number, plan: string): boolean => {
  const limits = getPlanLimits(plan);
  return currentCount < limits.maxProducts;
};