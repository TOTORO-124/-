export interface Project {
  id: number;
  title: string;
  type: string;
  description: string;
  role: string;
  link: string;
  thumbnail: string;
  is_featured: boolean;
  is_main: boolean;
  order_index: number;
  category: string;
  notes?: string;
}

export interface Experience {
  id: number;
  role: string;
  period: string;
  field: string;
  scope: string;
  strengths: string;
  brands: string;
}

export interface Profile {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  about_text: string;
  featured_title: string;
  featured_subtitle: string;
  work_title: string;
  work_subtitle: string;
  contact_title: string;
  contact_subtitle: string;
  contact_email: string;
  contact_kakao: string;
  exp_title: string;
  exp_label_field: string;
  exp_label_scope: string;
  exp_label_strengths: string;
  exp_label_brands: string;
  about_title: string;
  about_subtitle: string;
  about_strengths_title: string;
  site_name: string;
}
