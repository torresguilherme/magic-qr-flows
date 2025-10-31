-- Create function to increment scan count
CREATE OR REPLACE FUNCTION increment_scan_count(qr_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE qr_codes
  SET scan_count = scan_count + 1
  WHERE id = qr_id;
END;
$$;