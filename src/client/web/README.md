# IdeaCheck Web Client

Modern React TypeScript web application for the IdeaCheck product validation platform.

## Overview

The web client provides a clean, professional interface for users to discover IdeaCheck and for product owners to manage their validation campaigns. Built with modern web technologies for optimal performance and developer experience.

## Features

- ✅ **Responsive Landing Page** - Professional overview with hero section, features, and process explanation
- ✅ **Modern React Architecture** - Component-based design with TypeScript
- ✅ **Fast Development** - Vite dev server with hot reload
- ✅ **Production Ready** - Optimized builds and deployment configuration
- 🔄 **Authentication** - Login system integration (coming soon)
- 🔄 **Product Management** - Dashboard and creation interfaces (coming soon)

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

1. **Navigate to web directory:**
   ```bash
   cd src/client/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - Local: http://localhost:3000
   - Network: http://[your-ip]:3000

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code analysis |
| `npm run lint:fix` | Auto-fix ESLint issues |

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Hero section
│   ├── Features.tsx    # Feature showcase
│   ├── HowItWorks.tsx  # Process steps
│   └── Footer.tsx      # Site footer
├── pages/              # Page-level components
│   ├── OverviewPage.tsx # Main landing page
│   └── LoginPage.tsx    # Login portal
├── services/           # API integration
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── styles/             # Global styles
```

### Technology Stack

- **React 18** - UI library with modern hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

## API Integration

The web client is configured to work with the IdeaCheck FastAPI backend:

- **Development**: API calls to `/api/*` are proxied to `http://localhost:8000`
- **Production**: Configure base URL for your deployed API server

## Building & Deployment

### Production Build
```bash
npm run build
```
Creates optimized files in `dist/` directory ready for deployment.

### Deployment Options

**Static Hosting:**
- Netlify, Vercel, GitHub Pages
- Upload `dist/` folder contents

**Server Deployment:**
- Nginx, Apache, or CDN
- Serve static files with API proxy configuration

### Environment Configuration

Create `.env` files for different environments:

```bash
# .env.development
VITE_API_URL=http://localhost:8000

# .env.production  
VITE_API_URL=https://your-api-domain.com
```

## Design System

### Colors
- Primary: `#007bff` (Blue)
- Background: `#fafafa` (Light gray)
- Text: `#333` (Dark gray)
- Secondary text: `#666` (Medium gray)

### Typography
- System font stack for optimal performance
- Responsive font sizes (2.5rem → 2rem on mobile)
- Consistent line heights for readability

### Layout
- Mobile-first responsive design
- CSS Grid for component layouts
- Flexbox for internal component structure
- Consistent spacing scale

## Contributing

1. Follow component-based architecture
2. Use TypeScript for all new code
3. Maintain responsive design principles
4. Test on multiple screen sizes
5. Follow existing code style and patterns

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Modern browsers with ES2020 support.