
-- Article images table (up to 3 images per article)
CREATE TABLE public.article_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  caption_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view article images" ON public.article_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert article images" ON public.article_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update article images" ON public.article_images FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete article images" ON public.article_images FOR DELETE USING (is_admin());

CREATE INDEX idx_article_images_article_id ON public.article_images(article_id);

-- Gallery posts table (grouping multiple images)
CREATE TABLE public.gallery_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  title_en TEXT,
  sort_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery posts" ON public.gallery_posts FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery posts" ON public.gallery_posts FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update gallery posts" ON public.gallery_posts FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete gallery posts" ON public.gallery_posts FOR DELETE USING (is_admin());

-- Gallery post images table (up to 5 images per post)
CREATE TABLE public.gallery_post_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.gallery_posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  caption_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_post_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery post images" ON public.gallery_post_images FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery post images" ON public.gallery_post_images FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update gallery post images" ON public.gallery_post_images FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete gallery post images" ON public.gallery_post_images FOR DELETE USING (is_admin());

CREATE INDEX idx_gallery_post_images_post_id ON public.gallery_post_images(post_id);

-- Trigger for gallery_posts updated_at
CREATE TRIGGER update_gallery_posts_updated_at
BEFORE UPDATE ON public.gallery_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
