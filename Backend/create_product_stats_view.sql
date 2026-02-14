-- Create a view to calculate product stats
CREATE OR REPLACE VIEW public.product_stats_view AS
SELECT 
    p.id as product_id,
    COUNT(r.id) as total_reviews,
    COALESCE(AVG(r.rating), 0) as average_rating
FROM 
    public.products p
LEFT JOIN 
    public.reviews r ON p.id = r.product_id
GROUP BY 
    p.id;

-- Grant access to the view
GRANT SELECT ON public.product_stats_view TO anon, authenticated, service_role;
