-- ============================================================
-- NEWS TABLE UPGRADE
-- Run this FIRST in Supabase → SQL Editor → New Query
-- ============================================================

-- Add new columns to existing news table
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS full_text text,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS author text default 'УН към 163 ОУ',
  ADD COLUMN IF NOT EXISTS meta_description text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz default now();

-- Generate slugs for existing rows
UPDATE news SET slug = 'novini-' || substring(id::text, 1, 8) WHERE slug IS NULL;

-- Create index for fast slug lookups
CREATE UNIQUE INDEX IF NOT EXISTS news_slug_idx ON news (slug);
CREATE INDEX IF NOT EXISTS news_published_idx ON news (published_at DESC);
