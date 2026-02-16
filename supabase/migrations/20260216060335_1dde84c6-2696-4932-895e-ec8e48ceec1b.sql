
-- Add slug column to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- Insert all menu categories with slugs
INSERT INTO public.categories (name, slug) VALUES
  ('ಕನ್ನಡನಾಡಿ', 'kannadanadi'),
  ('ನಮ್ಮೂರ ಸುದ್ದಿ', 'nammura-suddi'),
  ('ಉಡುಪಿ', 'udupi'),
  ('ಕಾರ್ಕಳ', 'karkala'),
  ('ಅಪರಾಧ ಲೋಕ', 'crime'),
  ('ರಾಜಕೀಯ', 'politics'),
  ('ಶಿಕ್ಷಣ', 'education'),
  ('ಆರೋಗ್ಯವೇ ಭಾಗ್ಯ', 'health'),
  ('ಕೃಷಿ ಮಾಹಿತಿ', 'agriculture'),
  ('ಸೋಷಿಯಲ್ ಮೀಡಿಯಾ ಕಥೆಗಳು', 'social-media'),
  ('ಬರಹಗಾರರಾಗಿ, ನೀವು ಬರೆಯಿರಿ ..?', 'write'),
  ('ಪಬ್ಲಿಕ್ ಪ್ರೈಮ್ ಸಂದರ್ಶನಗಳು', 'interviews'),
  ('ವಾಯ್ಸ್ ಆಫ್ ಪಬ್ಲಿಕ್', 'voice-of-public'),
  ('ಭ್ರಷ್ಟರ ಬೇಟೆಗೆ ಮೂರನೇ ಕಣ್ಣು..', 'third-eye'),
  ('ಸಾಧಕರ ಚರಿತ್ರೆ..', 'achievers'),
  ('ನಮ್ಮೂರ ಹೆಮ್ಮೆಯ ಸಾಧಕರು', 'local-achievers')
ON CONFLICT (slug) DO NOTHING;
