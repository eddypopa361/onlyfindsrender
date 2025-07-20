# JOYAFINDS - Designer Products Showcase

## Overview

This is a full-stack e-commerce showcase application built with React, Express.js, and PostgreSQL. The application serves as a product catalog and referral platform, specifically designed for showcasing designer replica products with affiliate links. It features a modern dark theme with purple accents, product filtering, search functionality, and an admin import system for managing product data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and database layers:

- **Frontend**: React SPA with TypeScript, built with Vite
- **Backend**: Express.js API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **File Processing**: Multer for CSV imports and file uploads

## Key Components

### Frontend Architecture
- **Component Library**: Built on shadcn/ui with Radix UI primitives
- **Routing**: wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom dark theme and purple accents
- **State Management**: React Query for server state, local component state for UI
- **Performance Optimization**: Lazy loading for product cards and images

### Backend Architecture
- **API Structure**: RESTful API with Express.js
- **Database Layer**: Drizzle ORM with connection pooling via @neondatabase/serverless
- **File Processing**: CSV import functionality with validation
- **Static Generation**: Support for generating static HTML pages

### Database Schema
The application uses a simple but effective schema:

**Products Table**:
- `id`: Serial primary key
- `title`: Product name (required)
- `price`: Product price as text (required)
- `image`: Product image URL (required)
- `buyUrl`: Affiliate purchase link (required)
- `viewUrl`: Product view link (required)
- `category`: Main product category (required)
- `subCategory`: Optional subcategory for filtering
- `brand`: Product brand (optional)
- `featured`: Boolean flag for featured products
- `carousel`: Boolean flag for carousel display

**Users Table**:
- Basic user authentication structure (appears to be unused in current implementation)

## Data Flow

1. **Product Display**: Frontend queries backend API for products with pagination, filtering, and search
2. **Product Import**: CSV files are uploaded through admin interface, processed server-side, and bulk inserted into database
3. **Filtering System**: Products are filtered by category, subcategory, and brand with URL state management
4. **Search**: Full-text search across product titles and brands
5. **Static Export**: System supports generating static HTML pages for products

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive use of Radix UI primitives (@radix-ui/*)
- **Animations**: Spline 3D library (@splinetool/*)
- **Styling**: Tailwind CSS with custom theme configuration
- **State Management**: TanStack React Query
- **Forms**: React Hook Form with resolvers

### Backend Dependencies
- **Database**: Neon PostgreSQL with serverless connection pooling
- **File Processing**: Multer for uploads, AdmZip for archive handling, CSV parsing
- **ORM**: Drizzle with PostgreSQL dialect

### Development Tools
- **Build System**: Vite with TypeScript support
- **Database Migrations**: Drizzle Kit for schema management
- **Runtime**: tsx for TypeScript execution

## Deployment Strategy

The application is configured for deployment on Replit with:

1. **Database**: Uses Neon PostgreSQL (configured via DATABASE_URL environment variable)
2. **Build Process**: 
   - Development: `tsx server/index.ts`
   - Production: Vite build for frontend + esbuild for backend
3. **Static Assets**: Supports serving from uploads directory
4. **Environment Configuration**: Database connection via environment variables

### Key Configuration Files
- `drizzle.config.ts`: Database configuration and migration settings
- `vite.config.ts`: Frontend build configuration with aliases
- `tailwind.config.ts`: Custom theming with CSS variables
- `theme.json`: Replit theme integration

### Scripts and Automation
The project includes numerous utility scripts in the `/scripts` directory for:
- Product data import and processing
- Category and subcategory management  
- Brand name normalization
- Database maintenance and optimization

## Recent Changes: Latest modifications with dates

**January 20, 2025**: Logo Update and Database Connection Fix
- ✓ Fixed critical database connection issue by switching from WebSocket to HTTP connection
- ✓ Added proper static file serving for images and assets 
- ✓ Updated all components to use onlyfinds_logo.png instead of joyafinds_logo.png
- ✓ Replaced logo references in main navigation, hero section, and footer components
- ✓ Verified logo loading functionality across all pages
- ✓ Application now running smoothly with all assets properly served

**January 20, 2025**: Complete Color Rebranding
- ✓ Performed comprehensive rebranding from purple (#9d4edd) to red (#cb2410) theme
- ✓ Updated all CSS custom properties in index.css for primary and accent colors  
- ✓ Replaced all purple/violet Tailwind classes with red equivalents throughout components
- ✓ Fixed purple references in navigation, hero section, product cards, carousels, and promotional sections
- ✓ Updated theme.json to match new red color scheme
- ✓ Maintained all existing functionality and structure during rebranding process
- ✓ Completed global find-and-replace to eliminate all remaining purple/violet text and UI references

This architecture provides a scalable foundation for an e-commerce catalog with robust data management capabilities and modern development practices.