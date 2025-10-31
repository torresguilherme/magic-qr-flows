import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, X, Send } from "lucide-react";
import { toast } from "sonner";

export const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [hasProvidedName, setHasProvidedName] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'system' }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendToWebhook = async (userMessage: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://n8n.neurogrid.com.br/webhook-test/qrcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          message: userMessage,
          timestamp: new Date().toISOString(),
          source: "qr-code-app"
        }),
      });

      if (!response.ok) throw new Error("Erro ao enviar mensagem");

      setMessages(prev => [
        ...prev,
        { text: userMessage, sender: 'user' },
        { text: "Mensagem enviada! Nossa equipe responderá em breve.", sender: 'system' }
      ]);
      setMessage("");
      toast.success("Mensagem enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      toast.error("Por favor, digite seu nome");
      return;
    }
    setHasProvidedName(true);
    setMessages([{ text: `Olá ${userName}! Como podemos ajudar?`, sender: 'system' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendToWebhook(message);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Suporte QR Code</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages or Name Form */}
          <div className="flex-1 overflow-y-auto p-4">
            {!hasProvidedName ? (
              <div className="space-y-4 mt-8">
                <div className="text-center text-muted-foreground mb-6">
                  <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Bem-vindo ao Suporte!</p>
                  <p className="text-sm mt-2">
                    Por favor, informe seu nome para começarmos.
                  </p>
                </div>
                <form onSubmit={handleNameSubmit} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Seu nome</Label>
                    <Input
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Digite seu nome..."
                      autoFocus
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Continuar
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          {hasProvidedName && (
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua dúvida..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={isLoading || !message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}
    </>
  );
};
