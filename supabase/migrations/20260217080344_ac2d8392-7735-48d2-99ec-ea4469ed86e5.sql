
-- Add home_position column to articles
ALTER TABLE public.articles ADD COLUMN home_position text NOT NULL DEFAULT 'none';

-- Migrate existing data
UPDATE public.articles SET home_position = 'featured' WHERE is_featured = true;
UPDATE public.articles SET home_position = 'main' WHERE is_main = true;
