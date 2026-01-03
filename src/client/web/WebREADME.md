# IdeaCheck Web Client

## Overview

Modern React TypeScript web application for the IdeaCheck product validation platform. Built with Vite for fast development and optimized builds.

## Project Structure

```
src/client/web/
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Hero.tsx       # Hero section
│   │   ├── Features.tsx   # Features showcase
│   │   ├── HowItWorks.tsx # Process explanation
│   │   └── Footer.tsx     # Site footer
│   ├── pages/             # Page components
│   │   ├── OverviewPage.tsx # Main landing page
│   │   └── LoginPage.tsx    # Login portal (placeholder)
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── styles/            # Global styles
├── public/                # Static assets
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

1. **Navigate to web client directory**:
   ```bash
   cd src/client/web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Web app: http://localhost:3000
   - API proxy: Automatically proxies /api requests to http://localhost:8000

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Features Implemented

### Current (v1.0)
- ✅ **Modern Overview Page** - Clean, professional landing page
- ✅ **Responsive Design** - Mobile-first responsive layout
- ✅ **Navigation** - Header with login button
- ✅ **Content Sections**:
  - Hero section with call-to-action
  - Features showcase with icons
  - How it works process
  - Professional footer
- ✅ **Routing Setup** - React Router configuration
- ✅ **TypeScript** - Full type safety
- ✅ **Placeholder Login** - Login route setup (functionality pending)

### Planned Features
- 🔄 Authentication system integration
- 🔄 Dashboard for product management
- 🔄 Product creation interface
- 🔄 Feedback collection views
- 🔄 Analytics and reporting

## API Integration

The application is configured to proxy API requests to the FastAPI backend:
- Development: `http://localhost:8000`
- All `/api/*` requests are automatically proxied during development

## Styling Approach

- **CSS-in-JS**: Inline styles for component-specific styling
- **Global CSS**: Shared styles and utilities in `src/styles/index.css`
- **Design System**: Consistent color palette, typography, and spacing
- **Responsive**: Mobile-first approach with CSS Grid and Flexbox

## Build & Deployment

### Production Build
```bash
npm run build
```
Creates optimized build in `dist/` directory.

### Environment Configuration
- Development: Vite dev server with API proxy
- Production: Static files served with API backend

The web client is designed to integrate seamlessly with the IdeaCheck FastAPI backend and provide a modern, accessible user experience.