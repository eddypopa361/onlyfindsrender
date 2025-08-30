# ONLYFINDS Admin Panel Setup Guide

## Environment Setup

To enable the admin panel, you need to configure Supabase authentication:

### Required Environment Variables

Add these secrets to your Replit project:

```
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Go to Settings → API
4. Copy the "URL" and "anon/public" key
5. Add them as Replit Secrets

## Database Setup

### 1. Create Tables and Policies

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create admins table for admin access control
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT,
    name TEXT
);

-- Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies for admins table
CREATE POLICY "Admins can view all admin records" ON public.admins
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Admins can insert new admin records" ON public.admins
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Admins can delete admin records" ON public.admins
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

-- Policies for products table
CREATE POLICY "Enable read access for all users" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated admins only" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Enable update for authenticated admins only" ON public.products
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Enable delete for authenticated admins only" ON public.products
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );
```

### 2. Create Your First Admin

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

- [ ] Non-logged users see login screen at `/admin`
- [ ] Logged non-admins see 403 error with logout option
- [ ] Admins can view, search, and paginate products
- [ ] Product editing saves correctly to database
- [ ] New product creation works end-to-end
- [ ] CSV import processes successfully
- [ ] ZIP image upload extracts and saves images
- [ ] All help text appears in English
- [ ] Public site behavior remains unchanged
- [ ] Image uploads optimize to WebP format

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