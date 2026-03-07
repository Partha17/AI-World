-- Seed buildings (skip if already exist)
INSERT INTO public.buildings (id, slug, name, address, city, state, location, branding, featured_categories) VALUES
(
  'c1000000-0000-0000-0000-000000000001',
  'zaveri-bazaar-mumbai',
  'Zaveri Bazaar Gold Mall',
  '209 Sheikh Memon St, Kalbadevi, Zaveri Bazaar',
  'Mumbai',
  'Maharashtra',
  '{"lat": 18.9467, "lng": 72.8347}',
  '{"logo_url": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=200", "primary_color": "#B8860B", "welcome_message": "Welcome to Zaveri Bazaar Gold Mall — Mumbai''s finest jewelry destination", "theme": "gold"}',
  array['Rings', 'Necklaces', 'Earrings', 'Bridal Sets', 'Bangles']
),
(
  'c1000000-0000-0000-0000-000000000002',
  'jewel-plaza-jaipur',
  'Jewel Plaza Jaipur',
  '42 Johari Bazaar, Pink City',
  'Jaipur',
  'Rajasthan',
  '{"lat": 26.9222, "lng": 75.8069}',
  '{"logo_url": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200", "primary_color": "#C41E3A", "welcome_message": "Welcome to Jewel Plaza — Jaipur''s royal jewelry experience", "theme": "royal"}',
  array['Rings', 'Necklaces', 'Earrings', 'Bridal Sets']
)
ON CONFLICT (id) DO NOTHING;

-- Seed building vendors
INSERT INTO public.building_vendors (building_id, seller_id, floor_number, shop_name) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Ground Floor, Shop G-12', 'Tanishq Heritage'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Ground Floor, Shop G-08', 'Kalyan Jewellers'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'First Floor, Shop F-03', 'Amrapali Jaipur'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'First Floor, Shop F-15', 'BlueStone Studio'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 'Second Floor, Shop S-01', 'Zoya Luxury Boutique'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'Ground Floor, Shop G-22', 'Kisna Diamonds'),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'Second Floor, Shop S-10', 'Ritani Fine Jewelry'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Ground Floor, Shop 5', 'Tanishq Jaipur'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Ground Floor, Shop 1', 'Amrapali Heritage'),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000005', 'First Floor, Shop 12', 'Zoya Exclusive')
ON CONFLICT (building_id, seller_id) DO NOTHING;
