-- Add is_dynamic column to qr_codes table
ALTER TABLE public.qr_codes 
ADD COLUMN is_dynamic BOOLEAN NOT NULL DEFAULT true;