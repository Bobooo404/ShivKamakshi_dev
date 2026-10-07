export interface ProjectImage {
  url: string;
  title: string;
  tag?: string;
}

export interface ProjectItem {
  id: string;
  number: string;
  name: string;
  category: 'Residential' | 'Commercial' | 'Mixed-Use' | 'Cultural' | 'Heritage';
  year: string;
  location: string;
  description: string;
  highlightTier: 'foundation' | 'podium' | 'midrise' | 'skyvillas' | 'crown';
  gradientColor: string;
  images?: ProjectImage[];
  statistic?: string;
  subStats?: { label: string; value: string }[];
  features?: string[];
}

export interface ConstructionStep {
  step: number;
  title: string;
  subtitle: string;
  progressRange: [number, number];
}

export interface ServiceContact {
  type: 'whatsapp' | 'email';
  title: string;
  description: string;
  actionLabel: string;
  link: string;
  iconName: string;
  detail: string;
}

export interface CompanyMetric {
  value: string;
  label: string;
  subtext: string;
}
