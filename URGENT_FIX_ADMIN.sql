-- URGENT FIX: Run this SQL in Supabase Dashboard → SQL Editor
-- This will immediately fix your admin access

-- Step 1: Remove all existing policies
DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;
DROP POLICY IF EXISTS "allow_admin_access" ON public.admins;
DROP POLICY IF EXISTS "direct_admin_access" ON public.admins;
DROP POLICY IF EXISTS "public_admin_read" ON public.admins;
DROP POLICY IF EXISTS "Admin only select on products" ON public.products;
DROP POLICY IF EXISTS "admin_can_access_products" ON public.products;

-- Step 2: Create simple policy that allows admin login verification
CREATE POLICY "allow_admin_login" ON public.admins 
FOR SELECT USING (true);

-- Step 3: Create policy that allows admins to manage products
CREATE POLICY "allow_admin_products" ON public.products 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
);

-- Step 4: Verify your admin record exists
INSERT INTO public.admins (id, email, name) 
VALUES ('d47951c8-4490-451d-bc9c-2bda1ce637a1', 'doarcarlos666@gmail.com', 'Carlos')
ON CONFLICT (id) DO NOTHING;

-- Step 5: Test the setup
SELECT 'Admin record exists' as status, email 
FROM public.admins 
WHERE email = 'doarcarlos666@gmail.com';

SELECT 'Products count' as status, COUNT(*) as total 
FROM public.products;