import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Redirect = () => {
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const redirect = async () => {
      if (!id) {
        setError(true);
        return;
      }

      try {
        // Fetch QR code data
        const { data: qrCode, error: fetchError } = await supabase
          .from("qr_codes")
          .select("destination_url, is_active")
          .eq("id", id)
          .single();

        if (fetchError || !qrCode || !qrCode.is_active) {
          setError(true);
          return;
        }

        // Log the scan (fire and forget)
        supabase
          .from("qr_scans")
          .insert({
            qr_code_id: id,
            user_agent: navigator.userAgent,
          })
          .then(() => {
            // Update scan count
            supabase.rpc("increment_scan_count", { qr_id: id });
          });

        // Redirect to destination
        window.location.href = qrCode.destination_url;
      } catch (err) {
        setError(true);
      }
    };

    redirect();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold mb-4">QR Code não encontrado</h1>
          <p className="text-muted-foreground">
            Este QR Code não existe ou está desativado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
};

export default Redirect;
