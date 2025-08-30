# ONLYFINDS Admin Panel Setup Guide

## Environment Setup

To enable the admin panel, you need to configure Supabase authentication:

### Required Environment Variables (Client)

Add these to your Replit project secrets:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Required Environment Variables (Server - for data migration)

If you need to run the migration script, also add:

```
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE=your-supabase-service-role-key
DATABASE_URL=your-old-database-url
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to Settings → API
4. Copy the "URL", "anon/public" key, and "service_role" key
5. Add them as Replit Secrets with the correct prefixes

## Database Setup

### 1. Create Tables and Schema

Run the SQL from `supabase_schema.sql` in your Supabase SQL Editor. This creates the products and admins tables with proper indexes and triggers.

### 2. Apply Row Level Security Policies

Run the SQL from `supabase_policies.sql` in your Supabase SQL Editor. This sets up security policies to ensure only admins can manage products.

### 3. Migrate Data from Old Database

Run the migration script to transfer all existing products:

```bash
npm run migrate:supabase
```

Note: This requires both old and new database credentials to be configured.

### 4. Create Your First Admin

1. Create a user account in Supabase Auth (or sign up through the admin login)
2. Get your user ID from Supabase Auth → Users
3. Run this SQL with your actual user ID:

```sql
INSERT INTO public.admins (id, email, name) 
VALUES ('YOUR-AUTH-USER-ID-HERE', 'your-email@example.com', 'Your Name');
```

## CSV Import Format

### Required Columns

Your CSV file must include these columns (exact names, case-sensitive):

```
title,priceUSD,image,buyUrl,category,subCategory,brand,featured,carousel
```

### Column Descriptions

- **title** (required): Product name
- **priceUSD** (required): Price in USD (numeric, e.g., "29.99")
- **image** (required): Image filename (must match files in ZIP upload)
- **buyUrl** (required): Full purchase URL (e.g., "https://cnfans.com/product/123")
- **category** (required): Main category from the predefined list
- **subCategory** (optional): Subcategory for filtering
- **brand** (optional): Product brand name
- **featured** (optional): "true" or "false" for featured products
- **carousel** (optional): "true" or "false" for carousel display

### Example CSV Row

```csv
"Premium Wireless Headphones","149.99","headphones_001.jpg","https://cnfans.com/product/headphones-123","Electronic products","Headphones","Sony","true","false"
```

## Image Requirements

### Supported Formats
- JPG, PNG, GIF, WebP
- Maximum file size: 10MB per image
- Recommended resolution: 800x800px or higher

### Upload Methods

1. **Single Upload**: Use the Images tab to upload individual files
2. **Bulk Upload**: Create a ZIP file containing all product images
3. **During Editing**: Upload directly when adding/editing products

### Image Processing

- All images are automatically converted to WebP format
- Images are optimized and resized to 800x800px (maintaining aspect ratio)
- Files are stored in the `/uploads` directory
- Filenames must match exactly between CSV and ZIP files

## Admin Panel Features

### Products Tab (Default)
- **View Products**: Server-paginated table with 20 products per page
- **Search**: Search by product title or URL
- **Edit Products**: Click edit icon to modify product details
- **Add Products**: Use "Add Product" button for new entries
- **Bulk Actions**: Select multiple products (future feature)

### Bulk Import Tab
- **CSV Import**: Upload CSV files with product data
- **Image Import**: Upload ZIP files with product images
- **Help Text**: Built-in guidance for proper formatting

### Images Tab
- **Single Upload**: Drag & drop individual images
- **Automatic Processing**: Images are optimized and renamed
- **Format Conversion**: Automatic WebP conversion for performance

### Help Tab
- **Usage Guide**: Complete instructions for all features
- **CSV Format**: Column requirements and examples
- **Category Lists**: Available categories and subcategories
- **Contact Info**: Support channels for assistance

## QA Checklist

Before deploying, verify:

- [ ] Environment variables configured (shows clear error if missing)
- [ ] Non-logged users see login screen at `/admin`
- [ ] Logged non-admins see 403 error with logout option  
- [ ] Admins can view, search, and paginate products from Supabase
- [ ] Product editing saves correctly to Supabase
- [ ] New product creation works end-to-end
- [ ] CSV import processes successfully into Supabase
- [ ] ZIP image upload extracts and saves images
- [ ] All help text appears in English
- [ ] Public site uses service role to read from Supabase
- [ ] Old database no longer accessed anywhere in code
- [ ] Migration script completed successfully

## Known Limitations

1. **Database Connection**: Admin panel requires active Supabase connection
2. **File Size**: Image uploads limited to 10MB per file
3. **Concurrent Users**: No conflict resolution for simultaneous edits
4. **Bulk Delete**: Not implemented (delete individual products only)
5. **Image Editing**: No cropping/editing tools (external editing required)

## Security Notes

- All admin operations require authenticated Supabase users
- Row Level Security (RLS) enforces admin-only write access
- Public site maintains read-only access to product data
- Image uploads are validated for type and size
- SQL injection protection via Supabase parameterized queries

## Troubleshooting

### "Supabase not configured" Error
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in Replit Secrets
- Verify credentials are correct in Supabase dashboard

### "Access Denied" After Login
- Confirm your user ID exists in the `admins` table
- Check RLS policies are properly configured

### CSV Import Fails
- Verify all required columns are present and spelled correctly
- Check for special characters in data that might break CSV parsing
- Ensure numeric fields (priceUSD) contain valid numbers

### Images Not Displaying
- Confirm image filenames in CSV match exactly with uploaded files
- Check that images were successfully extracted from ZIP
- Verify `/uploads` directory has proper write permissions

## Support

For technical support:
- **Email**: onlyfinds@gmail.com
- **Discord**: https://discord.gg/4jzdSZGD
- **Documentation**: Check the Help tab in admin panel for latest info