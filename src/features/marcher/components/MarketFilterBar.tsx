// components/marketplace/MarketFilterBar.tsx
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  libelle: string;
}

interface MarketFilterBarProps {
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: string) => void;
  categories: Category[];
  loading?: boolean;
}

export function MarketFilterBar({ onSearch, onCategoryChange, categories, loading }: MarketFilterBarProps) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSearch = () => onSearch(query);
  const handleClear = () => { setQuery(''); onSearch(''); };

  return (
    <div className="space-y-4 mb-6">
      {/* Barre de recherche avec dégradé au focus */}
      <div className="relative flex items-center group">
        <Input
          type="text"
          placeholder="Rechercher un produit, une catégorie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="h-12 sm:h-14 bg-white/5 border-2 border-white/10 rounded-2xl pl-10 pr-20 text-white placeholder:text-white/30 font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
        />
        <Search className="absolute left-3 w-4 h-4 text-white/40 group-focus-within:text-primary transition-colors" />
        {query && (
          <button onClick={handleClear} className="absolute right-14 p-1 rounded-full hover:bg-white/10 transition">
            <X className="w-3 h-3 text-white/60" />
          </button>
        )}
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="absolute right-1 h-10 sm:h-11 bg-gradient-to-r from-primary to-orange-400 hover:from-primary/80 hover:to-orange-500 text-black font-black uppercase italic rounded-xl px-3 sm:px-4 text-xs sm:text-sm shadow-lg shadow-primary/20 transition-all"
        >
          {loading ? <Search className="animate-spin w-4 h-4" /> : "GO"}
        </Button>
      </div>

      {/* Filtres catégories - version desktop */}
      <div className="hidden sm:flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveCat('all'); onCategoryChange('all'); }}
          className={cn(
            "px-4 py-2 rounded-full text-xs md:text-sm font-black uppercase italic transition-all duration-300",
            activeCat === 'all'
              ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg shadow-primary/40 scale-105"
              : "bg-white/5 text-white/70 hover:bg-white/10 hover:scale-105"
          )}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCat(cat.id); onCategoryChange(cat.id); }}
            className={cn(
              "px-4 py-2 rounded-full text-xs md:text-sm font-black uppercase italic transition-all duration-300",
              activeCat === cat.id
                ? "bg-gradient-to-r from-primary to-orange-400 text-black shadow-lg shadow-primary/40 scale-105"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:scale-105"
            )}
          >
            {cat.libelle}
          </button>
        ))}
      </div>

      {/* Version mobile : dropdown */}
      <div className="sm:hidden">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl border border-white/10"
        >
          <span className="text-white/80 font-bold uppercase text-xs">Catégorie: {activeCat === 'all' ? 'Tous' : activeCat}</span>
          <Filter className="w-4 h-4 text-primary" />
        </button>
        {mobileFilterOpen && (
          <div className="mt-2 p-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 flex flex-wrap gap-2 animate-in slide-in-from-top-2">
            <button
              onClick={() => { setActiveCat('all'); onCategoryChange('all'); setMobileFilterOpen(false); }}
              className="px-3 py-1 rounded-full text-xs font-black uppercase bg-white/10"
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCat(cat.id); onCategoryChange(cat.id); setMobileFilterOpen(false); }}
                className="px-3 py-1 rounded-full text-xs font-black uppercase bg-white/5"
              >
                {cat.libelle}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}