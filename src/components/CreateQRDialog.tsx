import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const qrCodeSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").max(100),
  destination_url: z.string().trim().url("URL inválida").max(2048),
});

interface CreateQRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  userId: string;
}

export const CreateQRDialog = ({ open, onOpenChange, onSuccess, userId }: CreateQRDialogProps) => {
  const [name, setName] = useState("");
  const [destinationUrl, setDestinationUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = qrCodeSchema.safeParse({
        name,
        destination_url: destinationUrl,
      });

      if (!validation.success) {
        const errors = validation.error.errors.map(e => e.message).join(", ");
        toast.error(errors);
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("qr_codes")
        .insert({
          user_id: userId,
          name: validation.data.name,
          destination_url: validation.data.destination_url,
        });

      if (error) throw error;

      toast.success("QR Code criado com sucesso!");
      setName("");
      setDestinationUrl("");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error("Erro ao criar QR Code: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo QR Code</DialogTitle>
          <DialogDescription>
            Crie um QR Code dinâmico que você pode atualizar a qualquer momento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do QR Code</Label>
            <Input
              id="name"
              placeholder="Ex: Cardápio Restaurante"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL de destino</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://exemplo.com"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              disabled={loading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Você poderá alterar esta URL depois sem precisar reimprimir o QR Code
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar QR Code"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
