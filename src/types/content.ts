export type BrandingContent = {
  brandName: string;
  tagline: string;
};

export type HeroContent = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  heroImageUrl: string;
  imageUrls?: string[];
};

export type SectionHeader = {
  eyebrow: string;
  title: string;
  highlight?: string;
  description?: string;
};

export type FeatureContent = {
  icon: string;
  title: string;
  description: string;
};

export type StatItem = {
  value: number;
  suffix?: string;
  label: string;
};

export type TestimonialContent = {
  quote: string;
  author: string;
  role: string;
  company: string;
};

export type ContactCard = {
  icon: string;
  heading: string;
  detail: string;
  subDetail: string;
};

export type FooterColumn = {
  title: string;
  links: { name: string; href: string }[];
};

export type FooterContent = {
  description: string;
  socialLinks: { icon: string; url: string }[];
  columns: FooterColumn[];
  copyright: string;
  legalLinks: { name: string; href: string }[];
};

export type ProductsSectionContent = {
  eyebrow?: string;
  description?: string;
};

export type FeaturesSectionContent = {
  header: SectionHeader;
  features: FeatureContent[];
};

export type StatsSectionContent = {
  header: SectionHeader;
  stats: StatItem[];
};

export type TestimonialsSectionContent = {
  header: SectionHeader;
  testimonials: TestimonialContent[];
};

export type VlogsSectionContent = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ContactSectionContent = {
  header: {
    eyebrow: string;
    title: string;
    description: string;
  };
  cards: ContactCard[];
  form?: {
    namePlaceholder: string;
    emailPlaceholder: string;
    companyPlaceholder: string;
    countryPlaceholder: string;
    messagePlaceholder: string;
    ctaLabel: string;
  };
};

export type ContactSubmissionStatus = "new" | "in_progress" | "processed";

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  phone?: string;
  phoneCountryIso?: string;
  phoneCountryCode?: string;
  message: string;
  status: ContactSubmissionStatus;
  createdAt?: string | null;
};

export type GalleryImage = {
  id: string;
  imageUrl: string;
  caption?: string;
};

export type ResourceSettings = {
  catalogUrl: string;
};

export type Certificate = {
  id: string;
  title: string;
  imageUrl: string;
  downloadUrl: string;
};

export type HomeContent = {
  branding: BrandingContent;
  hero: HeroContent;
  productsSection: ProductsSectionContent;
  featuresSection: FeaturesSectionContent;
  statsSection: StatsSectionContent;
  testimonialsSection: TestimonialsSectionContent;
  vlogsSection: VlogsSectionContent;
  contactSection: ContactSectionContent;
  footer: FooterContent;
  visibility?: {
    vlogs?: boolean;
    gallery?: boolean;
    certificates?: boolean;
    stats?: boolean;
    products?: boolean;
  };
  resources?: ResourceSettings;
  certificates?: Certificate[];
  gallery?: GalleryImage[];
};

export type Product = {
  slug: string;
  name: string;
  specs: string;
  summary: string;
  description: string;
  image: string;
  gallery: string[];
  materials: string[];
  applications: string[];
  certifications: string[];
};

export type Vlog = {
  slug: string;
  title: string;
  youtubeId: string;
  summary: string;
  description: string;
  publishedOn: string;
  tags: string[];
};
