import { ProposalAnalytics } from '@/lib/types'

export const mockAnalytics: Record<string, ProposalAnalytics> = {
  'demo-proposal-1': {
    viewCount: 47,
    uniqueVisitors: 23,
    lastViewed: '2025-08-12T08:30:00Z',
    avgTimeSpent: '4m 32s',
    sectionEngagement: [
      { section: 'Partnership Overview', views: 47, avgTime: '1m 15s' },
      { section: 'Clinical Services', views: 42, avgTime: '2m 45s' },
      { section: 'Timeline', views: 38, avgTime: '1m 32s' },
      { section: 'Investment', views: 35, avgTime: '2m 10s' }
    ],
    deviceBreakdown: {
      desktop: 68,
      mobile: 32
    }
  },
  'demo-proposal-2': {
    viewCount: 89,
    uniqueVisitors: 34,
    lastViewed: '2025-08-11T16:45:00Z',
    avgTimeSpent: '6m 18s',
    sectionEngagement: [
      { section: 'Regulatory Strategy', views: 89, avgTime: '2m 30s' },
      { section: 'FDA Pathway', views: 76, avgTime: '3m 15s' },
      { section: 'Expert Team', views: 65, avgTime: '1m 45s' },
      { section: 'Timeline & Cost', views: 58, avgTime: '2m 20s' }
    ],
    deviceBreakdown: {
      desktop: 75,
      mobile: 25
    }
  }
}

export const dashboardStats = {
  totalProposals: 12,
  activeProposals: 8,
  acceptedProposals: 3,
  conversionRate: 25,
  totalViews: 342,
  avgViewTime: '5m 12s',
  recentActivity: [
    { type: 'view', proposal: 'Clinical Trial Partnership - Roche', time: '2 hours ago' },
    { type: 'accepted', proposal: 'FDA Regulatory Consulting - Pfizer', time: '1 day ago' },
    { type: 'view', proposal: 'Drug Development - Novartis', time: '2 days ago' }
  ]
}