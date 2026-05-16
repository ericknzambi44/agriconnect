// features/admin/views/AdminLogin.tsx
import React, { useState } from 'react';
import { supabase } from '@/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Échec de connexion", { description: error.message });
    } else {
      toast.success("Connexion réussie");
      navigate('/admin/overview');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 border-white/10 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/20 border border-primary/40">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-display font-black italic uppercase tracking-tighter text-white">
            Admin<span className="text-primary">Connect</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input type="email" placeholder="Email admin" value={email} onChange={e => setEmail(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white" required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-orange-400 text-black">
              {loading ? <Loader2 className="animate-spin" /> : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}