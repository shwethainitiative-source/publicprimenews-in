
-- Create article_submissions table for "Write for Us" feature
CREATE TABLE public.article_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  article_title TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.article_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit articles"
ON public.article_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view submissions"
ON public.article_submissions
FOR SELECT
USING (is_admin());

-- Only admins can update (approve/reject)
CREATE POLICY "Admins can update submissions"
ON public.article_submissions
FOR UPDATE
USING (is_admin());

-- Only admins can delete
CREATE POLICY "Admins can delete submissions"
ON public.article_submissions
FOR DELETE
USING (is_admin());

-- Timestamp trigger
CREATE TRIGGER update_article_submissions_updated_at
BEFORE UPDATE ON public.article_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for submission images
INSERT INTO storage.buckets (id, name, public) VALUES ('submission-images', 'submission-images', true);

-- Anyone can upload to submission-images
CREATE POLICY "Anyone can upload submission images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'submission-images');

-- Public can view submission images
CREATE POLICY "Public can view submission images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'submission-images');

-- Admins can delete submission images
CREATE POLICY "Admins can delete submission images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'submission-images' AND public.is_admin());
