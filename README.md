# ProposalHub 📄

A modern SaaS platform for creating interactive, trackable proposal websites that replace static PDF proposals.

## ✨ Features

- **Interactive Proposals**: Replace boring PDFs with engaging, interactive proposal websites
- **Real-time Analytics**: Track who views your proposals and for how long
- **Client Responses**: Built-in Accept/Reject functionality for seamless client interaction
- **Professional Templates**: Industry-focused templates with stunning visual design
- **Product Management**: Comprehensive catalog system for services and products
- **Public Sharing**: Secure, shareable URLs that don't require client login
- **Rich Text Editing**: Advanced WYSIWYG editor with formatting options
- **Dashboard**: Real-time stats and proposal management interface

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Lucide React icons  
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Editor**: TipTap with rich text extensions
- **Deployment**: Vercel
- **Authentication**: Email/Password via Supabase Auth

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/proposalhub.git
   cd proposalhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   Run the SQL commands from `claude.md` to create tables

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

The application uses these main tables:
- `proposals` - Stores proposal data and status
- `products` - Service/product catalog 
- `proposal_products` - Links products to proposals
- `templates` - Proposal templates (optional)

See `claude.md` for complete SQL schema.

## 🎨 Core Features

### Proposal Creation
- Choose from professional templates
- Add client information
- Select services/products from catalog
- Real-time preview

### Public Sharing
- Generate secure, shareable URLs
- No client login required
- Track views and engagement
- Accept/Reject functionality

### Dashboard
- View all proposals with real-time stats
- Quick sharing and editing
- Status tracking and analytics
- Product management

## 🌟 Templates

Current templates focus on professional services:
- Clinical Trial Partnership
- FDA Regulatory Consulting  
- Drug Development Collaboration

Easy to add new templates by extending the templates system.

## 🔧 Development

### Project Structure
```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── lib/             # Utilities and configurations
└── data/            # Mock data and constants
```

### Key Components
- `TipTapEditor` - Rich text editing
- `ProposalViewer` - Public proposal display
- `Dashboard` - Management interface
- `TemplateSelector` - Template choosing UI

## 📈 Analytics

Built-in analytics track:
- Proposal view counts
- Last viewed timestamps  
- Client engagement metrics
- Status conversion rates

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel** 
3. **Add environment variables**
4. **Deploy automatically**

### Environment Variables for Production
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] CRM integrations  
- [ ] Multi-language support
- [ ] White-label branding
- [ ] Payment integration
- [ ] Advanced template builder

---

**Built with ❤️ using Next.js and Supabase**