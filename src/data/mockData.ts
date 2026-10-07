import { ProjectItem, ConstructionStep, ServiceContact, CompanyMetric } from '../types';

export const CONSTRUCTION_STEPS: ConstructionStep[] = [
  {
    step: 1,
    title: 'Foundation & Earthwork',
    subtitle: 'Reinforced concrete piling, seismic foundation grid, and subterranean structural basin.',
    progressRange: [0.0, 0.08],
  },
  {
    step: 2,
    title: 'Structural Steel Core',
    subtitle: 'High-tensile columns and central shear elevator core rising skyward.',
    progressRange: [0.08, 0.16],
  },
  {
    step: 3,
    title: 'Floor Plate Assembly',
    subtitle: 'Cantilevered post-tensioned floor slabs and stepped architectural terraces.',
    progressRange: [0.16, 0.23],
  },
  {
    step: 4,
    title: 'Architectural Brise-Soleil',
    subtitle: 'Thermal louvers, sculpted bronze mullions, and perimeter framing.',
    progressRange: [0.23, 0.29],
  },
  {
    step: 5,
    title: 'Curtain Wall & Glazing',
    subtitle: 'Double-laminated acoustic low-E glass facade panels sealing the envelope.',
    progressRange: [0.29, 0.35],
  },
  {
    step: 6,
    title: 'Interior Illumination',
    subtitle: 'Smart ambient lighting grids bringing the architectural landmark to life.',
    progressRange: [0.35, 0.42],
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'shree-kamakshi-saunsthan',
    number: '01',
    name: 'Shree Kamakshi Saunsthan',
    category: 'Heritage',
    year: '2026',
    location: 'Shiroda, Goa',
    description:
      'A symbol of devotion through time: Preserving the cherished heritage of Shree Kamakshi Saunsthan with the inspiring addition of its Mahadwara.',
    highlightTier: 'crown',
    gradientColor: 'from-[#D4AF37]/20 to-[#937b5a]/10',
    images: [
      {
        url: '/img1.jpeg',
        title: 'View 01',
        tag: 'Real Site Photograph',
      },
      {
        url: '/img2.jpeg',
        title: 'View 02',
        tag: 'Real Site Photograph',
      },
      {
        url: '/img3.jpeg',
        title: 'View 03',
        tag: 'Real Site Photograph',
      },
      {
        url: '/img4.jpeg',
        title: 'View 04',
        tag: 'Real Site Photograph',
      },
      {
        url: '/img5.jpeg',
        title: 'View 05',
        tag: 'Real Site Photograph',
      },
      {
        url: '/img6.jpeg',
        title: 'View 06',
        tag: 'Real Site Photograph',
      },
    ],
  },
];

export const SERVICE_CONTACTS: ServiceContact[] = [
  {
    type: 'whatsapp',
    title: 'Connect via WhatsApp',
    description: 'Instant architectural consultations, project brochure requests, and direct executive coordination.',
    actionLabel: 'Chat on WhatsApp',
    link: 'https://wa.me/910000000000?text=Hello%20Shivkamakshi%20Developers%2C%20I%20would%20like%20to%20inquire%20about%20your%20architectural%20developments.',
    iconName: 'MessageCircle',
    detail: '+91 XXXXX XXXXX',
  },
  {
    type: 'email',
    title: 'Connect via Email',
    description: 'Submit formal requests for proposals, architectural briefs, investment inquiries, and master-planning tenders.',
    actionLabel: 'Send Inquiry Email',
    link: 'mailto:inquiries@shivkamakshidevelopers.demo?subject=Project%20Inquiry%20-%20Shivkamakshi%20Developers&body=Dear%20Shivkamakshi%20Developers%20Team%2C%0A%0AI%20would%20like%20to%20learn%20more%20about%20your%20projects%20and%20development%20capabilities.%0A%0ABest%20regards%2C',
    iconName: 'Mail',
    detail: 'inquiries@shivkamakshi.demo',
  },
];

export const CORE_SERVICES = [
  {
    title: 'Architectural Master Planning',
    desc: 'Visionary structural planning marrying sustainable engineering with bespoke luxury aesthetic design.',
    tag: 'Vision & Concept',
  },
  {
    title: 'General Contracting & EPC',
    desc: 'End-to-end turnkey construction execution with rigorous structural tolerances and quality audits.',
    tag: 'Execution',
  },
  {
    title: 'Commercial & High-Rise Engineering',
    desc: 'Next-generation Grade-A office parks and commercial centers engineered for maximum spatial efficiency.',
    tag: 'Commercial',
  },
  {
    title: 'Luxury Residential Development',
    desc: 'Signature private residences, sky villas, and boutique residential landmarks with bespoke materiality.',
    tag: 'Residential',
  },
];

export const COMPANY_METRICS: CompanyMetric[] = [
  {
    value: '1.4M+',
    label: 'Sq. Ft. Delivered',
    subtext: 'Across premier commercial & residential landmarks',
  },
  {
    value: '100%',
    label: 'On-Time Delivery',
    subtext: 'Milestone tracking backed by precision engineering',
  },
  {
    value: '18+',
    label: 'Industry Honors',
    subtext: 'Recognized for structural elegance and sustainability',
  },
  {
    value: 'Zero',
    label: 'Compromise Quality',
    subtext: 'Seismic grade structural steel and reinforced standards',
  },
];
