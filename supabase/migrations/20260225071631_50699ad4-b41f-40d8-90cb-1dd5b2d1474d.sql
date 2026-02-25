
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_name text DEFAULT 'Public Prime News';
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author_photo_url text DEFAULT NULL;
