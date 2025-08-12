import { Product } from '@/lib/types'

export const sampleProducts: Omit<Product, 'id' | 'user_id' | 'created_at'>[] = [
  {
    name: 'Clinical Site Management',
    description: 'Complete site identification, selection, and management services for clinical trials',
    price_range: '$300,000 - $500,000',
    category: 'Clinical Services'
  },
  {
    name: 'Regulatory Strategy & IND Preparation',
    description: 'FDA regulatory strategy development and IND application preparation',
    price_range: '$150,000 - $250,000',
    category: 'Regulatory Services'
  },
  {
    name: 'Patient Recruitment & Retention',
    description: 'Targeted patient recruitment strategies and retention programs',
    price_range: '$200,000 - $400,000',
    category: 'Clinical Services'
  },
  {
    name: 'Clinical Data Management',
    description: 'Electronic data capture, data cleaning, and database management',
    price_range: '$180,000 - $300,000',
    category: 'Data Services'
  },
  {
    name: 'Biostatistics & Analysis',
    description: 'Statistical analysis plan development and data analysis services',
    price_range: '$120,000 - $200,000',
    category: 'Analytics'
  },
  {
    name: 'Medical Writing',
    description: 'Clinical study reports, regulatory submissions, and publication support',
    price_range: '$80,000 - $150,000',
    category: 'Documentation'
  },
  {
    name: 'Quality Assurance',
    description: 'GCP compliance monitoring and quality assurance services',
    price_range: '$100,000 - $180,000',
    category: 'Quality'
  },
  {
    name: 'Pharmacovigilance',
    description: 'Safety monitoring and adverse event reporting services',
    price_range: '$90,000 - $160,000',
    category: 'Safety'
  }
]