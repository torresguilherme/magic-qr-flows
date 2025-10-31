-- Allow public read access to qr_codes for redirect functionality
CREATE POLICY "Anyone can read QR codes for redirect"
ON public.qr_codes
FOR SELECT
USING (is_active = true);