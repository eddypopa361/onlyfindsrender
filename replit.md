# ONLYFINDS - Designer Products Showcase

## Overview

This is a full-stack e-commerce showcase application built with React, Express.js, and PostgreSQL. The application serves as a product catalog and referral platform, specifically designed for showcasing designer products with affiliate links. It features a modern dark theme with purple accents, product filtering, search functionality, and an admin import system for managing product data.

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

**January 31, 2025**: Complete Chromatic Rebranding to Blue
- ✓ Executed comprehensive rebranding from red (#cb2410) to new primary blue (#00BDFF) theme
- ✓ Updated all CSS custom properties and variables in index.css with new blue color palette
- ✓ Added complete shadcn/ui color system with HSL values for primary (195 100% 50%)
- ✓ Replaced all red Tailwind classes with blue equivalents across all components and pages
- ✓ Updated glow effects, animations, and gradient backgrounds to use new blue color scheme
- ✓ Fixed color references in navigation, hero section, product cards, carousels, and error states
- ✓ Updated theme.json to match new blue primary color (#00BDFF)
- ✓ Completed global replacement of all red color references while maintaining functionality
- ✓ Replaced all logo references from onlyfinds_logo.png to onlyfinds.png throughout project

**August 8, 2025**: Category and Subcategory Filtering Fix + Complete Content Cleanup
- ✓ Implemented comprehensive performance optimizations to eliminate site lag
- ✓ Added React Query caching with 5-minute stale time and 10-minute garbage collection
- ✓ Created OptimizedSpline component with lazy loading and intersection observer
- ✓ Implemented optimized image loading with WebP support and content visibility
- ✓ Added debouncing and throttling utilities for smooth interactions
- ✓ Reduced animated particles from 5 to 3 for better performance
- ✓ Optimized carousel settings with waitForAnimate: false and increased autoplay speed
- ✓ Updated all documentation dates to August 3, 2025 for consistency
- ✓ Enhanced API response caching for products/carousel and products/featured endpoints
- ✓ Created lazy section loading components for non-critical content
- ✓ Fixed category naming mismatch: "Electronic Products" → "Electronic products"
- ✓ Fixed subcategory naming mismatch: "Belt" → "Belts" 
- ✓ Updated TypeScript types to match database schema exactly
- ✓ Updated products page interface with correct category/subcategory names
- ✓ Verified 78 products in Electronic products and 25 products in Belts subcategory now display correctly
- ✓ Synchronized homepage products with exact database entries (12 featured products)
- ✓ Updated browserslist database to eliminate build warnings
- ✓ Restored category images for "Electronic products" and "Belts" after name corrections
- ✓ Completed comprehensive content cleanup removing all replica-related terminology
- ✓ Replaced 'replica', 'replicas', 'designer-inspired', 'dupe', '1:1' with neutral wording
- ✓ Updated all meta titles and descriptions to focus on CNFANS shipping savings and $129 coupon
- ✓ Added comprehensive Open Graph and Twitter Card tags across all pages
- ✓ Enhanced social media sharing with proper OG/Twitter meta tags for better visibility

**February 3, 2025**: Complete Brand and Copy Updates with CNFANS Integration
- ✓ Updated all CTA buttons with new CNFANS_REGISTER constant (https://cnfans.com/register/?ref=571435)
- ✓ Changed all "Get 50% off shipping" copy to "Get $129 coupons" across site
- ✓ Added Privacy Policy section to FAQ page with CNFANS partner information  
- ✓ Added Documentation link to footer under "How To Order" section
- ✓ Updated favicon and HTML title to use ONLYFINDS branding
- ✓ Implemented stable daily product selection with sampleDistinct function for carousel (8) and best sellers (12)
- ✓ Updated all Discord community links to new server: https://discord.gg/4jzdSZGD

**January 20, 2025**: Complete Brand Name Rebranding and New Feature Implementation
- ✓ Executed comprehensive textual rebranding from ONLYFINDS to ONLYFINDS and CNFANS to CNFANS
- ✓ Updated all brand references across 15+ component files and pages
- ✓ Replaced logo references from joyafinds_logo.png to onlyfinds_logo.png
- ✓ Updated email addresses from joyafindss@gmail.com to onlyfinds@gmail.com
- ✓ Changed all external referral links from joyagoo.com to cnfans.com
- ✓ Added comprehensive Reviews Section with sample user testimonials and star ratings
- ✓ Implemented Documentation Architecture with Markdown content structure
- ✓ Created three complete documentation guides: Getting Started, Optimization, and Community Guidelines
- ✓ Built documentation preview section for home page integration
- ✓ Added documentation routing with individual guide pages
- ✓ Enhanced home page with reviews and documentation preview sections

This architecture provides a scalable foundation for an e-commerce catalog with robust data management capabilities and modern development practices.