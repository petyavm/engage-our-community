-- ============================================================
-- NEWS TABLE MIGRATION
-- Run this FIRST in Supabase → SQL Editor → New Query
-- ============================================================

ALTER TABLE news
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS full_text text,
  ADD COLUMN IF NOT EXISTS author text default 'УН към 163 ОУ',
  ADD COLUMN IF NOT EXISTS published boolean default true,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text;

-- Generate slugs for existing rows
UPDATE news SET slug = id::text WHERE slug IS NULL;

-- Add unique constraint after populating
ALTER TABLE news ADD CONSTRAINT IF NOT EXISTS news_slug_unique UNIQUE (slug);
