import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QrCode, BarChart3, RefreshCw, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-qr.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">QR Codes Dinâmicos</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Seu QR Code, seus termos.{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Agora com superpoderes.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Crie um QR Code uma única vez e mude o destino dele sempre que quiser. Mas não é só isso: 
              veja exatamente quantas pessoas escanearam seu código e de onde elas vieram. Atualize seu 
              cardápio, promova um novo evento ou troque o link do seu portfólio, tudo isso enquanto mede 
              seu sucesso em tempo real!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                variant="hero" 
                size="xl" 
                className="group"
                onClick={() => navigate("/auth")}
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Gerar meu QR Code Mágico!
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground pt-4">
              Para começar a mágica, basta criar sua conta gratuita. Você ganha{" "}
              <span className="font-semibold text-primary">5 créditos</span> na hora para experimentar 
              todo o poder dos nossos QR Codes dinâmicos e ver seus scans acontecerem!
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Superpoderes para seus QR Codes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Muito mais que um simples QR Code. Uma ferramenta completa para gerenciar 
              e medir suas campanhas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <QrCode className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">QR Codes Dinâmicos</h3>
              <p className="text-muted-foreground leading-relaxed">
                Crie uma vez, atualize sempre. Mude o destino do seu QR Code sem precisar 
                reimprimir ou redistribuir.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics em Tempo Real</h3>
              <p className="text-muted-foreground leading-relaxed">
                Veja quantas pessoas escanearam, quando escanearam e de onde vieram. 
                Dados precisos para suas decisões.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <RefreshCw className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Atualização Instantânea</h3>
              <p className="text-muted-foreground leading-relaxed">
                Mudou de ideia? Sem problemas. Atualize seu destino em segundos e 
                veja as mudanças funcionarem imediatamente.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Como funciona?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Em apenas três passos simples, você está pronto para começar
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Crie sua conta gratuita</h3>
                <p className="text-muted-foreground">
                  Comece com 5 créditos grátis. Sem cartão de crédito necessário.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Gere seu QR Code</h3>
                <p className="text-muted-foreground">
                  Adicione o destino inicial e personalize como quiser. Baixe e use onde precisar.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Acompanhe e atualize</h3>
                <p className="text-muted-foreground">
                  Veja os scans acontecerem em tempo real e mude o destino quando quiser.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate("/auth")}
            >
              <Sparkles className="w-5 h-5" />
              Começar agora gratuitamente
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">
              © 2024 QR Code Mágico. Transformando códigos em experiências.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
