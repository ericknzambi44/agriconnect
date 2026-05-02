// src/features/admin/hooks/use-admin-core.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabase';
import { toast } from 'sonner';

export const useAdminCore = () => {
  const [admin, setAdmin] = useState<any | null>(null);
  const [isSyncing, setIsSyncing] = useState(true);
  const navigate = useNavigate();

  const verifyProtocol = useCallback(async () => {
    setIsSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAdmin(null);
        setIsSyncing(false);
        return;
      }

      // Tentative de récupération du rôle
      const { data, error } = await supabase
        .from('utilisateurs')
        .select(`id, email, nom, prenom, role:role_id ( admin_role )`)
        .eq('id', session.user.id)
        .single();

      if (error) {
        // C'est ici que l'erreur CORS ou RLS est captée
        console.error("Erreur de protocole :", error);
        throw new Error("Impossible de vérifier vos privilèges.");
      }

      const roleData = Array.isArray(data?.role) ? data.role[0] : data?.role;

      if (roleData?.admin_role === 'admin') {
        setAdmin({ ...data, role: roleData });
        // REDIRECTION SEULEMENT SI ON EST SUR LE LOGIN
        if (window.location.pathname === '/admin/login') {
          navigate('/admin/overview');
        }
      } else {
        // C'EST UN CLIENT, ON L'EXPULSE DE LA ZONE ADMIN
        toast.error("ACCÈS REFUSÉ : Privilèges insuffisants.");
        await supabase.auth.signOut();
        setAdmin(null);
        navigate('/admin/login');
      }
    } catch (err) {
      setAdmin(null);
      // Ne pas rediriger en boucle si c'est une erreur réseau
    } finally {
      setIsSyncing(false);
    }
  }, [navigate]);

  useEffect(() => {
    verifyProtocol();
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') await verifyProtocol();
      if (event === 'SIGNED_OUT') {
        setAdmin(null);
        navigate('/admin/login');
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, [verifyProtocol, navigate]);

  return { admin, isSyncing, isAuthenticated: !!admin, logout: () => supabase.auth.signOut() };
};