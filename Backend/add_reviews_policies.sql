-- Enable RLS (just in case)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Everyone can read reviews
CREATE POLICY "Reviews are public" 
ON public.reviews FOR SELECT 
USING (true);

-- 2. Authenticated users can create reviews
CREATE POLICY "Users can create reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own reviews
CREATE POLICY "Users can update own reviews" 
ON public.reviews FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" 
ON public.reviews FOR DELETE 
USING (auth.uid() = user_id);
