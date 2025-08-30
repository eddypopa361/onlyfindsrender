-- Create admins table for admin access control
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT,
    name TEXT
);

-- Enable Row Level Security on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins table
-- Only existing admins can select/insert/delete
CREATE POLICY "Admins can view all admin records" ON public.admins
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can insert new admin records" ON public.admins
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete admin records" ON public.admins
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()
        )
    );

-- Enable Row Level Security on products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products table
-- Public read access (for the website)
CREATE POLICY "Enable read access for all users" ON public.products
    FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Enable insert for authenticated admins only" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Enable update for authenticated admins only" ON public.products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Enable delete for authenticated admins only" ON public.products
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE id = auth.uid()
        )
    );

-- Insert your first admin (replace with your actual Supabase Auth user ID)
-- To get your user ID: Go to Supabase Auth > Users and copy the ID
-- INSERT INTO public.admins (id, email, name) VALUES ('YOUR-AUTH-USER-ID-HERE', 'your-email@example.com', 'Admin Name');

-- Example (DO NOT use this exact ID - it's just an example):
-- INSERT INTO public.admins (id, email, name) VALUES ('12345678-1234-1234-1234-123456789012', 'admin@example.com', 'Admin User');