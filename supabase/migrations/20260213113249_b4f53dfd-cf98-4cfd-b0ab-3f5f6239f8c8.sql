
-- Add English translation columns to articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS title_en text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS description_en text;
