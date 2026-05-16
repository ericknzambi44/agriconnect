// features/admin/views/AdminWallets.tsx
import React from 'react';
import { useAdminWallets } from '../hooks/use-admin-wallets';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Wallet, Lock } from "lucide-react";

export default function AdminWallets() {
  const { wallets, loading, searchTerm, setSearchTerm } = useAdminWallets();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-display font-black italic uppercase tracking-tighter bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
        Portefeuilles
      </h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input placeholder="Rechercher par nom, email, téléphone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 bg-white/5 border-white/10" />
      </div>

      <Card className="bg-black/40 border-white/10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white">Utilisateur</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Téléphone</TableHead>
                <TableHead className="text-white">Solde disponible</TableHead>
                <TableHead className="text-white">Solde bloqué</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets.map(w => (
                <TableRow key={w.id} className="border-white/10">
                  <TableCell className="text-white/80">{w.utilisateur?.nom} {w.utilisateur?.prenom}</TableCell>
                  <TableCell className="text-white/80">{w.utilisateur?.email}</TableCell>
                  <TableCell className="text-white/80">{w.utilisateur?.numero_tel || '-'}</TableCell>
                  <TableCell className="text-emerald-400 font-bold">{w.solde_disponible} {w.devise}</TableCell>
                  <TableCell className="text-orange-400">{w.solde_bloque} {w.devise}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}