import { Template } from './types'

export const pharmaTemplates: Template[] = [
  {
    id: 'clinical-trial-partnership',
    name: 'Clinical Trial Partnership',
    description: 'Partnership proposal for clinical development services',
    category: 'Clinical',
    preview_image: '/templates/clinical-trial.png',
    is_active: true,
    default_content: {
      hero: {
        title: 'Strategic Clinical Trial Partnership',
        subtitle: 'Accelerating your path to market with comprehensive clinical development services'
      },
      sections: [
        {
          id: 'partnership-overview',
          title: 'Partnership Overview',
          content: 'Our comprehensive clinical development partnership provides end-to-end support for your clinical trials, from study design through regulatory submission.'
        },
        {
          id: 'services',
          title: 'Clinical Development Services',
          items: [
            { name: 'Site Management', description: 'Complete site identification, qualification, and management', investment: '$450,000' },
            { name: 'Regulatory Support', description: 'IND preparation, FDA correspondence, and regulatory strategy', investment: '$180,000' },
            { name: 'Patient Recruitment', description: 'Targeted patient recruitment and retention strategies', investment: '$350,000' },
            { name: 'Data Management', description: 'Clinical data collection, management, and analysis', investment: '$220,000' }
          ]
        },
        {
          id: 'timeline',
          title: 'Development Timeline',
          milestones: [
            { phase: 'Study Startup', duration: '3 months', deliverables: 'Protocol finalization, site selection, regulatory submissions' },
            { phase: 'Patient Recruitment', duration: '8 months', deliverables: 'Complete patient enrollment across all sites' },
            { phase: 'Treatment Period', duration: '6 months', deliverables: 'Patient treatment and monitoring' },
            { phase: 'Data Analysis', duration: '2 months', deliverables: 'Final study report and regulatory filing support' }
          ]
        }
      ]
    }
  },
  {
    id: 'fda-regulatory-consulting',
    name: 'FDA Regulatory Consulting',
    description: 'Expert regulatory strategy and FDA submission support',
    category: 'Regulatory',
    preview_image: '/templates/fda-regulatory.png',
    is_active: true,
    default_content: {
      hero: {
        title: 'FDA Regulatory Strategy & Consulting',
        subtitle: 'Navigate the regulatory pathway with confidence'
      },
      sections: [
        {
          id: 'challenge',
          title: 'Regulatory Challenge',
          content: 'Complex FDA requirements and evolving regulatory landscape require expert guidance to ensure successful product approval.'
        },
        {
          id: 'solution-services',
          title: 'Our Regulatory Solutions',
          items: [
            { name: 'IND Strategy', description: 'Comprehensive IND preparation and strategy development' },
            { name: 'Pre-IND Meetings', description: 'FDA meeting preparation and representation' },
            { name: 'CMC Support', description: 'Chemistry, Manufacturing, and Controls documentation' },
            { name: 'FDA Correspondence', description: 'All regulatory correspondence and submissions' }
          ]
        },
        {
          id: 'expert-team',
          title: 'Expert Team Profiles',
          team: [
            { name: 'Dr. Sarah Chen', role: 'Senior Regulatory Director', experience: '15+ years FDA experience, former FDA reviewer' },
            { name: 'Dr. Michael Rodriguez', role: 'CMC Regulatory Lead', experience: 'Expert in drug substance and product development' }
          ]
        }
      ]
    }
  },
  {
    id: 'drug-development-collaboration',
    name: 'Drug Development Collaboration',
    description: 'Integrated drug development partnership proposal',
    category: 'Development',
    preview_image: '/templates/drug-development.png',
    is_active: true,
    default_content: {
      hero: {
        title: 'Strategic Drug Development Partnership',
        subtitle: 'From discovery to market: Your integrated development partner'
      },
      sections: [
        {
          id: 'market-opportunity',
          title: 'Market Opportunity',
          content: 'The global pharmaceutical market presents unprecedented opportunities for innovative therapeutics. Our partnership model accelerates time-to-market while reducing development risks.'
        },
        {
          id: 'development-plan',
          title: 'Integrated Development Plan',
          phases: [
            { name: 'Preclinical Development', duration: '18 months', activities: 'Lead optimization, IND-enabling studies, regulatory strategy' },
            { name: 'Phase I Clinical', duration: '12 months', activities: 'First-in-human studies, safety evaluation, dose escalation' },
            { name: 'Phase II Clinical', duration: '24 months', activities: 'Proof-of-concept studies, biomarker analysis, regulatory alignment' }
          ]
        },
        {
          id: 'partnership-structure',
          title: 'Partnership Structure',
          milestones: [
            { milestone: 'IND Filing', payment: '$2.5M', timeline: 'Month 18' },
            { milestone: 'Phase I Completion', payment: '$5M', timeline: 'Month 30' },
            { milestone: 'Phase II Interim', payment: '$10M', timeline: 'Month 42' },
            { milestone: 'Phase II Completion', payment: '$15M', timeline: 'Month 54' }
          ]
        }
      ]
    }
  }
]