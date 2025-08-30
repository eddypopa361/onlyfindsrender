-- ONLYFINDS Row Level Security Policies
-- Run this AFTER creating the schema and tables

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin only select on products" ON public.products;
DROP POLICY IF EXISTS "Admin only insert on products" ON public.products;
DROP POLICY IF EXISTS "Admin only update on products" ON public.products;
DROP POLICY IF EXISTS "Admin only delete on products" ON public.products;
DROP POLICY IF EXISTS "Public read access on products" ON public.products;
DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can insert admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can delete admin records" ON public.admins;

-- Products table policies
-- For now, only admins can read products (we'll keep public site unchanged by using service role)
CREATE POLICY "Admin only select on products" ON public.products
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Admin only insert on products" ON public.products
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Admin only update on products" ON public.products
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Admin only delete on products" ON public.products
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

-- Alternative: If you want public read access (uncomment this and comment the admin-only select above)
-- CREATE POLICY "Public read access on products" ON public.products
--     FOR SELECT USING (true);

-- Admins table policies
CREATE POLICY "Admins can view admin records" ON public.admins
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Admins can insert admin records" ON public.admins
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );

CREATE POLICY "Admins can delete admin records" ON public.admins
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    );