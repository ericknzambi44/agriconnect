import { useMemo } from 'react';
import { MarketAnnonce } from './useMarketplace';

export function useMarketSearch(annonces: MarketAnnonce[], query: string) {
  return useMemo(() => {
    if (!query.trim()) return annonces;

    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/);

    return annonces
      .map(annonce => {
        const name = (annonce.produit?.nom_prod || "").toLowerCase();
        const cat = (annonce.produit?.categorie?.libelle_categorie || "").toLowerCase();
        const combined = `${name} ${cat}`;
        
        let score = 0;

        // 1. Correspondance exacte (Priorité max)
        if (name === normalizedQuery) score += 100;
        
        // 2. Commence par la requête
        else if (name.startsWith(normalizedQuery)) score += 80;

        // 3. Inclusion de mots
        else {
          queryWords.forEach(word => {
            if (combined.includes(word)) score += 40;
            
            // 4. Logique "Fuzzy" simplifiée (Recherche de sous-séquences)
            // Permet de trouver "patate" avec "patatu" ou "ptat"
            if (fuzzyMatch(word, combined)) score += 20;
          });
        }

        return { annonce, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.annonce);
  }, [annonces, query]);
}

// Fonction utilitaire pour la correspondance floue
function fuzzyMatch(query: string, target: string): boolean {
  let i = 0;
  let j = 0;
  while (i < query.length && j < target.length) {
    if (query[i] === target[j]) i++;
    j++;
  }
  return i === query.length;
}