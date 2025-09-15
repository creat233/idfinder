
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const useAutoRefresh = (intervalMs: number = 30000) => {
  // Hook désactivé pour éviter les rechargements automatiques
  // qui interrompent l'expérience utilisateur
  return;
};
