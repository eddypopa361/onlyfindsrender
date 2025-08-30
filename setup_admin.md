# Setting up Admin Access

## Step 1: Run Database Schema

Go to your Supabase dashboard:
1. Open https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Run the contents of `supabase_schema.sql`
5. Then run the contents of `supabase_policies.sql`

## Step 2: Get Your User ID

After logging into Supabase through the admin panel:
1. Go to Supabase Dashboard → Authentication → Users
2. Find your user (doarcarlos666@gmail.com)
3. Copy the User UID (it looks like: a1b2c3d4-e5f6-7890-abcd-ef1234567890)

## Step 3: Add Admin Access

In Supabase SQL Editor, run this query with YOUR actual user ID:

```sql
INSERT INTO public.admins (id, email, name) 
VALUES ('YOUR-USER-ID-HERE', 'doarcarlos666@gmail.com', 'Carlos');
```

## Step 4: Add Other Admins

For the 2 additional people, repeat the process:
1. They sign up through the admin login at /admin
2. You get their User UID from Supabase Dashboard → Authentication → Users
3. Run the INSERT query with their details:

```sql
INSERT INTO public.admins (id, email, name) 
VALUES ('THEIR-USER-ID', 'their-email@example.com', 'Their Name');
```

## Quick Setup Commands

If you want me to help you set this up faster, you can provide me with:
- Your Supabase Service Role key (from API settings)
- Then I can run the setup automatically

The Service Role key looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (much longer than the anon key)