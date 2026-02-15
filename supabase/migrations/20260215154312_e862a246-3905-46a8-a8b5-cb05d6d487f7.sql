
-- Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  company_name TEXT NOT NULL DEFAULT '',
  company_name_en TEXT,
  location TEXT DEFAULT '',
  location_en TEXT,
  qualification TEXT DEFAULT '',
  qualification_en TEXT,
  job_type TEXT DEFAULT 'full-time',
  salary TEXT,
  salary_en TEXT,
  last_date DATE,
  apply_link TEXT,
  description TEXT,
  description_en TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Admins can insert jobs" ON public.jobs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update jobs" ON public.jobs FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete jobs" ON public.jobs FOR DELETE USING (is_admin());

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gallery photos table
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  caption_en TEXT,
  album TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery" ON public.gallery_photos FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON public.gallery_photos FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update gallery" ON public.gallery_photos FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete gallery" ON public.gallery_photos FOR DELETE USING (is_admin());

CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery_photos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Feedback table
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view feedback" ON public.feedback FOR SELECT USING (is_admin());
CREATE POLICY "Admins can delete feedback" ON public.feedback FOR DELETE USING (is_admin());
