-- FINAL SQL SETUP - Rulați în Supabase Dashboard → SQL Editor
-- Acesta creează politicile de securitate lipsă

-- Ștergeți politicile existente (dacă există)
DROP POLICY IF EXISTS "Admins can view admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can insert admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can delete admin records" ON public.admins;
DROP POLICY IF EXISTS "Admin only select on products" ON public.products;
DROP POLICY IF EXISTS "Admin only insert on products" ON public.products;
DROP POLICY IF EXISTS "Admin only update on products" ON public.products;
DROP POLICY IF EXISTS "Admin only delete on products" ON public.products;

-- Creați politicile pentru tabelul admins (CRITIC pentru verificarea admin)
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

-- Creați politicile pentru tabelul products
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

-- Confirmați că politicile au fost create
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('admins', 'products');