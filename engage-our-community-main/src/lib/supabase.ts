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
  sort_order: number;
  created_at?: string;
};

export type DonationInfo = {
  id: string;
  key: string;
  label: string;
  value: string;
};
