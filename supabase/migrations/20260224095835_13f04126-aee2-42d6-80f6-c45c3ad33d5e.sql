
ALTER TABLE public.articles ADD COLUMN status text NOT NULL DEFAULT 'published';

-- Update existing articles to published
UPDATE public.articles SET status = 'published' WHERE status IS NULL OR status = '';
