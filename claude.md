# vjsual offers Clone - Development Instructions

## Project Overview

A 48-hour POC to clone vjsual offers - a SaaS platform for creating interactive, trackable proposal websites that replace static PDF proposals. Built to demonstrate development capabilities to LaunchPharm CEO.

## Problem We're Solving

B2B companies send boring PDF proposals via email with zero tracking or interaction. Our solution creates engaging, interactive proposal websites with real-time analytics and client interaction capabilities.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components:** shadcn/ui with Lucide React icons
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage)
- **WYSIWYG Editor:** TipTap with extensions (Bold, Italic, Image, Link, TextAlign, Highlight, Underline, Color, TextStyle)
- **Deployment:** Vercel
- **Authentication:** Email/Password via Supabase Auth

## Database Schema

```sql
-- proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_company TEXT,
  template_id TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected')),
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- products table (for services/products to add to proposals)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- proposal_products (many-to-many relationship)
CREATE TABLE proposal_products (
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  custom_price TEXT,
  PRIMARY KEY (proposal_id, product_id)
);

-- templates table (can be hardcoded for POC)
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  preview_image TEXT,
  default_content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

## Core Features (POC Scope)

### Phase 1: Foundation (Day 1 Morning - 4 hours)

1. Next.js 14 project with TypeScript
2. Supabase setup and database schema
3. shadcn/ui installation and configuration
4. Basic auth flow (register/login/logout)
5. Project structure and routing

### Phase 2: Core Features (Day 1 Afternoon - 4 hours)

1. Template system with 3 pharma templates
2. Form-based proposal generation
3. Proposal viewing page with shareable URLs
4. Basic product database CRUD
5. Connect products to proposals

### Phase 3: Enhanced UX (Day 2 Morning - 4 hours)

1. TipTap WYSIWYG editor integration
2. Dashboard with proposal management
3. Client interaction (Accept/Reject buttons)
4. Mock analytics integration
5. Responsive design

### Phase 4: Polish (Day 2 Afternoon - 4 hours)

1. Professional styling and animations
2. Analytics charts with fake impressive data
3. Error handling and loading states
4. Demo data seeding
5. Final testing and deployment

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── analytics/[id]/page.tsx
│   ├── create/
│   │   ├── page.tsx
│   │   └── [template]/page.tsx
│   ├── proposal/[id]/page.tsx
│   ├── products/page.tsx
│   └── api/ (Supabase API routes)
├── components/
│   ├── ui/ (shadcn components)
│   ├── editor/ (TipTap components)
│   ├── templates/ (Proposal templates)
│   ├── analytics/ (Charts and metrics)
│   └── forms/ (Form components)
├── lib/
│   ├── supabase.ts
│   ├── types.ts
│   ├── templates.ts
│   └── utils.ts
└── data/
    ├── mock-analytics.ts
    └── sample-products.ts
```

## Templates (Pharma Industry Focus)

### Template 1: Clinical Trial Partnership

- Hero section with client company name
- Partnership overview
- Clinical development services (Site Management, Regulatory, Patient Recruitment, Data Management)
- Development timeline (Study Startup: 3mo, Recruitment: 8mo, Treatment: 6mo, Analysis: 2mo)
- Investment breakdown ($450K site management, $180K regulatory, $220K data, $350K recruitment)

### Template 2: FDA Regulatory Consulting

- Regulatory strategy hero
- Challenge description
- Solution services (IND Strategy, Pre-IND Meetings, CMC Support, FDA Correspondence)
- Expert team profiles
- Deliverables and timeline

### Template 3: Drug Development Collaboration

- Strategic partnership hero
- Market opportunity description
- Integrated development plan (Preclinical: 18mo, Phase I: 12mo, Phase II: 24mo)
- Partnership structure with milestone payments

## Key Components to Build

### 1. Proposal Builder Form

- Client information fields
- Project details
- Service/product selection from database
- Template customization options
- Real-time preview

### 2. TipTap WYSIWYG Editor

- Click-to-edit functionality on proposal pages
- Rich text formatting toolbar
- Image upload and management
- Link editing capabilities

### 3. Dashboard

- Proposal list with status indicators
- Quick stats (total, active, accepted, conversion rate)
- Search and filter functionality
- Create new proposal button

### 4. Analytics Components

- Mock but impressive metrics
- View tracking (count, unique visitors, last viewed)
- Time spent analytics
- Section engagement data
- Simple charts using Recharts

### 5. Client-Facing Proposal Pages

- Beautiful, responsive design
- Interactive elements
- Accept/Reject functionality
- Contact information display
- Social sharing capabilities

## Mock Analytics Data Structure

```typescript
interface ProposalAnalytics {
  viewCount: number;
  uniqueVisitors: number;
  lastViewed: string;
  avgTimeSpent: string;
  sectionEngagement: Array<{
    section: string;
    views: number;
    avgTime: string;
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
  };
}
```

## Environment Variables Needed

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Design Requirements

- Modern, professional pharma industry aesthetic
- Responsive design (mobile-first)
- Smooth animations and transitions
- High contrast for accessibility
- Clean typography and spacing

## Success Criteria

- Full proposal creation in under 2 minutes
- Professional appearance worthy of real client use
- All core features working smoothly
- Impressive analytics dashboard
- Mobile responsive design
- Fast loading times

## Development Notes

- Focus on speed over perfection for POC
- Use TypeScript throughout for better development experience
- Implement proper error handling and loading states
- Keep code modular for future expansion
- Use Supabase Row Level Security for data protection
- Prioritize user experience and visual impact

## Future Expansion Features (Document but Don't Build)

- Real analytics tracking
- Email automation
- CRM integrations
- User roles and permissions
- White-label branding
- Advanced template builder
- Payment processing
- Multi-language support

## Security Notes (For Production)

**IMPORTANT**: For POC, we're using basic Supabase auth without Row Level Security (RLS) for speed. For production deployment, implement:

1. **JWT Signing Keys Migration**: Migrate from legacy JWT secret to new JWT signing keys in Supabase dashboard → Settings → API → JWT Keys
2. **Row Level Security (RLS)**: Enable RLS on all tables with proper policies:
   ```sql
   ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
   ALTER TABLE products ENABLE ROW LEVEL SECURITY;
   ALTER TABLE proposal_products ENABLE ROW LEVEL SECURITY;
   
   -- Example RLS policy for proposals
   CREATE POLICY "Users can only see their own proposals" ON proposals
     FOR ALL USING (auth.uid() = user_id);
   ```
3. **Service Role Key**: Add service role key to environment variables for admin operations
4. **API Rate Limiting**: Configure rate limits in Supabase dashboard
