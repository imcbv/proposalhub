'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    accepted: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)
  const [copyingId, setCopyingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      setUser(user)
      
      // Load proposals
      const { data: proposalsData, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && proposalsData) {
        setProposals(proposalsData)
        
        // Calculate stats
        const total = proposalsData.length
        const active = proposalsData.filter(p => p.status === 'sent' || p.status === 'viewed').length
        const accepted = proposalsData.filter(p => p.status === 'accepted').length
        const totalViews = proposalsData.reduce((sum, p) => sum + (p.view_count || 0), 0)
        
        setStats({ total, active, accepted, totalViews })
      }
      
      setLoading(false)
    }

    loadDashboard()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleShare = async (proposalId: string) => {
    setCopyingId(proposalId)
    try {
      const shareUrl = `${window.location.origin}/share/${proposalId}`
      await navigator.clipboard.writeText(shareUrl)
      
      // Show success feedback (could enhance with toast later)
      setTimeout(() => setCopyingId(null), 1000)
      
      // Optional: Update proposal status to 'sent' if it's currently 'draft'
      const proposal = proposals.find(p => p.id === proposalId)
      if (proposal && proposal.status === 'draft') {
        const { error } = await supabase
          .from('proposals')
          .update({ status: 'sent', updated_at: new Date().toISOString() })
          .eq('id', proposalId)
          .eq('user_id', user.id)
        
        if (!error) {
          // Update local state
          setProposals(prev => prev.map(p => 
            p.id === proposalId ? { ...p, status: 'sent' } : p
          ))
          setStats(prev => ({
            ...prev,
            active: prev.active + 1
          }))
        }
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      // Fallback: show the URL in an alert
      const shareUrl = `${window.location.origin}/share/${proposalId}`
      alert(`Share URL: ${shareUrl}`)
      setCopyingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ProposalHub</h1>
              <p className="text-gray-600">Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <Button variant="outline" size="sm">
                  Manage Products
                </Button>
              </Link>
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-500">Total created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Active Proposals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.active}</div>
              <p className="text-sm text-gray-500">Sent or viewed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.accepted}</div>
              <p className="text-sm text-gray-500">
                {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalViews}</div>
              <p className="text-sm text-gray-500">Client engagement</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Proposals</h2>
              <Link href="/create">
                <Button>Create New Proposal</Button>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {proposals.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first proposal to start tracking client engagement
                </p>
                <Link href="/create">
                  <Button>Get Started</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <Link href={`/proposal/${proposal.id}`}>
                            <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                              {proposal.title}
                            </h3>
                          </Link>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            proposal.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            proposal.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                            proposal.status === 'viewed' ? 'bg-yellow-100 text-yellow-800' :
                            proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                          <span>👤 {proposal.client_name}</span>
                          {proposal.client_company && <span>🏢 {proposal.client_company}</span>}
                          <span>📅 {new Date(proposal.created_at).toLocaleDateString()}</span>
                          <span>👁️ {proposal.view_count || 0} views</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link href={`/proposal/${proposal.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShare(proposal.id)}
                          disabled={copyingId === proposal.id}
                        >
                          {copyingId === proposal.id ? '✓ Copied!' : 'Share'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}