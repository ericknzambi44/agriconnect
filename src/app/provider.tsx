/**
 * @file provider.tsx
 * @description Configuration globale de TanStack Query pour GarageVision.
 * @version 5.x
 * * Stratégie Senior :
 * - staleTime : On garde les données fraîches pendant 1min pour éviter les requêtes inutiles.
 * - retry : En cas d'échec (micro-coupure), on réessaye 3 fois avec un délai progressif.
 * - refetchOnWindowFocus : Désactivé pour économiser de la bande passante en environnement instable.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // On utilise useState pour garantir que le QueryClient est créé une seule fois
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, 
        gcTime: 1000 * 60 * 60 * 24, // Garder en cache (Garbage Collection) pendant 24h
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false, 
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools : Uniquement visible en mode développement */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};