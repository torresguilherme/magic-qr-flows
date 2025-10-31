-- Allow public insert access to qr_scans for tracking
CREATE POLICY "Anyone can log QR scans"
ON public.qr_scans
FOR INSERT
WITH CHECK (true);