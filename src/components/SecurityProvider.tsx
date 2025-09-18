import { useEffect } from 'react';
import { URL_CONFIG } from '@/utils/urlConfig';
import { SecurityStatus } from './SecurityStatus';

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider = ({ children }: SecurityProviderProps) => {
  useEffect(() => {
    // Initialiser la sécurité au chargement
    URL_CONFIG.initSecurity();
  }, []);

  return (
    <>
      <SecurityStatus />
      {children}
    </>
  );
};