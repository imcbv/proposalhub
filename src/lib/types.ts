// Database types
export interface Proposal {
  id: string
  user_id: string
  title: string
  client_name: string
  client_email: string
  client_company?: string
  template_id: string
  content: any // JSONB
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'
  view_count: number
  last_viewed_at?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  user_id: string
  name: string
  description?: string
  price_range?: string
  category?: string
  image_url?: string
  created_at: string
}

export interface ProposalProduct {
  proposal_id: string
  product_id: string
  quantity: number
  custom_price?: string
}

export interface Template {
  id: string
  name: string
  description?: string
  category?: string
  preview_image?: string
  default_content: any // JSONB
  is_active: boolean
}

// Analytics types
export interface ProposalAnalytics {
  viewCount: number
  uniqueVisitors: number
  lastViewed: string
  avgTimeSpent: string
  sectionEngagement: Array<{
    section: string
    views: number
    avgTime: string
  }>
  deviceBreakdown: {
    desktop: number
    mobile: number
  }
}