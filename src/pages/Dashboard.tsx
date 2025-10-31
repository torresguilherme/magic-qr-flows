import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, Plus, QrCode, BarChart3, Sparkles } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        // Defer profile fetch with setTimeout
        setTimeout(() => {
          fetchProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Você saiu com sucesso");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">QR Code Mágico</span>
              </div>
            </div>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Olá, {profile?.full_name || "Usuário"}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Você tem <span className="font-semibold text-primary">{profile?.credits || 0} créditos</span> disponíveis
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">QR Codes ativos</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Scans totais</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{profile?.credits || 0}</p>
                <p className="text-sm text-muted-foreground">Créditos restantes</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Empty State */}
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <QrCode className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Crie seu primeiro QR Code</h2>
              <p className="text-muted-foreground">
                Comece gerando um QR Code dinâmico que você pode atualizar a qualquer momento
              </p>
            </div>
            <Button variant="hero" size="xl">
              <Plus className="w-5 h-5 mr-2" />
              Criar QR Code
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
