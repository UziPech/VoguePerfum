-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT,
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    entity TEXT NOT NULL, -- 'PRODUCT', 'CATEGORY', 'BRAND'
    entity_id TEXT,
    entity_name TEXT,
    justification TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies
-- Only admins can read logs
CREATE POLICY "Admins can view activity logs" 
ON public.activity_logs FOR SELECT 
TO authenticated 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin'
);

-- Server side (service_role) or admins can insert
CREATE POLICY "Server can insert activity logs" 
ON public.activity_logs FOR INSERT 
TO authenticated, service_role 
WITH CHECK (true);
