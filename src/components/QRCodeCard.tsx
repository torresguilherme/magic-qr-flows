import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit2, Download, Trash2, ExternalLink, Save, X } from "lucide-react";
import { z } from "zod";

const urlSchema = z.string().trim().url("URL inválida").max(2048);

interface QRCodeCardProps {
  qrCode: {
    id: string;
    name: string;
    destination_url: string;
    scan_count: number;
    is_active: boolean;
    is_dynamic: boolean;
    created_at: string;
  };
  onUpdate: () => void;
  onDelete: () => void;
}

export const QRCodeCard = ({ qrCode, onUpdate, onDelete }: QRCodeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(qrCode.destination_url);
  const [loading, setLoading] = useState(false);

  // Se for dinâmico, usa redirecionador. Se for estático, vai direto para o link
  const qrCodeUrl = qrCode.is_dynamic 
    ? `${window.location.origin}/r/${qrCode.id}`
    : qrCode.destination_url;

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const validation = urlSchema.safeParse(newUrl);

      if (!validation.success) {
        toast.error("URL inválida");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("qr_codes")
        .update({ destination_url: validation.data })
        .eq("id", qrCode.id);

      if (error) throw error;

      toast.success("QR Code atualizado com sucesso!");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast.error("Erro ao atualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este QR Code?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", qrCode.id);

      if (error) throw error;

      toast.success("QR Code excluído com sucesso!");
      onDelete();
    } catch (error: any) {
      toast.error("Erro ao excluir: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById(`qr-${qrCode.id}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${qrCode.name.replace(/\s+/g, "-")}-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* QR Code Display */}
        <div className="flex-shrink-0">
          <div className="bg-white p-4 rounded-lg border-2 border-border">
            <QRCodeSVG
              id={`qr-${qrCode.id}`}
              value={qrCodeUrl}
              size={180}
              level="H"
              includeMargin
            />
          </div>
          {!qrCode.is_dynamic && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Estático
            </p>
          )}
        </div>

        {/* Info and Controls */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-1">{qrCode.name}</h3>
            <p className="text-sm text-muted-foreground">
              {qrCode.scan_count} scans • Criado em{" "}
              {new Date(qrCode.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`url-${qrCode.id}`}>URL de destino</Label>
                <Input
                  id={`url-${qrCode.id}`}
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdate} disabled={loading} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setNewUrl(qrCode.destination_url);
                  }}
                  disabled={loading}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1">Destino atual:</p>
                <a
                  href={qrCode.destination_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 break-all"
                >
                  {qrCode.destination_url}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              </div>

              <div className="flex flex-wrap gap-2">
                {qrCode.is_dynamic && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Alterar destino
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQRCode}
                  disabled={loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
