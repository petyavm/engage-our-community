import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rklxshnnkjdzqgbnjxek.supabase.co';
const supabaseAnonKey = 'sb_publishable_8U6FDBXk08NwVTCau4Bvgw_ZPAsYDqr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Announcement = {
  id: string;
  title: string;
  date: string;
  description: string;
  urgent: boolean;
  created_at?: string;
};

export type NewsItem = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  slug?: string;
  image_url?: string;
  full_text?: string;
  published?: boolean;
  created_at?: string;
};

export type BoardMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  email: string;
  phone: string;
  initials: string;
  image_url: string;
  sort_order: number;
  created_at?: string;
};

export type Document = {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
  category?: string;
  date?: string;
  links?: { label: string; url: string }[];
  created_at?: string;
};

export type ImpactStat = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  sort_order: number;
  album_id?: string;
  created_at?: string;
};

export type GalleryAlbum = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  cover_url?: string;
  sort_order: number;
  created_at?: string;
};

export type DonationInfo = {
  id: string;
  key: string;
  label: string;
  value: string;
};

export type BoardHistory = {
  id: string;
  mandate: string;
  name: string;
  role: string;
  note: string;
  current: boolean;
  sort_order: number;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string;
  label: string;
};
