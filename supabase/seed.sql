-- ============================================================
-- Seed Sellers
-- ============================================================
insert into public.sellers (id, name, brand_name, description, rating, verified, location) values
  ('a1000000-0000-0000-0000-000000000001', 'Tanishq Heritage', 'Tanishq', 'India''s most trusted jewelry brand, known for purity and craftsmanship since 1994.', 4.8, true, 'Mumbai, India'),
  ('a1000000-0000-0000-0000-000000000002', 'Kalyan Jewellers', 'Kalyan', 'One of India''s largest jewelry brands with a legacy of trust and exquisite designs.', 4.6, true, 'Thrissur, India'),
  ('a1000000-0000-0000-0000-000000000003', 'Amrapali Jaipur', 'Amrapali', 'Handcrafted tribal and traditional jewelry inspired by India''s rich heritage.', 4.7, true, 'Jaipur, India'),
  ('a1000000-0000-0000-0000-000000000004', 'BlueStone Fine Jewelry', 'BlueStone', 'Contemporary fine jewelry designed for the modern Indian woman.', 4.5, true, 'Bangalore, India'),
  ('a1000000-0000-0000-0000-000000000005', 'Zoya by Tata', 'Zoya', 'Luxury jewelry house creating wearable art with precious gems and metals.', 4.9, true, 'Mumbai, India'),
  ('a1000000-0000-0000-0000-000000000006', 'Kisna Diamond Jewelry', 'Kisna', 'Affordable diamond jewelry with certified natural diamonds.', 4.3, true, 'Surat, India'),
  ('a1000000-0000-0000-0000-000000000007', 'Ritani', 'Ritani', 'Premium engagement rings and fine jewelry with virtual try-on.', 4.5, true, 'New York, USA');

-- ============================================================
-- Seed Products — Rings
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Celestial Solitaire Diamond Ring',
  'A breathtaking solitaire ring featuring a 0.75 carat round brilliant diamond set in a delicate 18K white gold band. The cathedral setting elevates the diamond, allowing maximum light to enter from all angles. GIA certified, VS1 clarity, F color.',
  185000, 'INR', 'Rings', 'Engagement',
  '{"primary": "18K White Gold", "finish": "Polished"}',
  '{"type": "Diamond", "carat": 0.75, "cut": "Round Brilliant", "clarity": "VS1", "color": "F", "certification": "GIA"}',
  3.8, 18,
  array['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800'],
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
  array['solitaire', 'classic', 'elegant', 'timeless', 'minimal'],
  array['engagement', 'proposal', 'anniversary']
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000004',
  'Rose Garden Halo Ring',
  'Romantic rose gold engagement ring with a cushion-cut 0.5 carat diamond surrounded by a shimmering halo of 24 micro-pavé diamonds. Total diamond weight 0.82 carats. The split shank adds a modern twist to the vintage-inspired design.',
  145000, 'INR', 'Rings', 'Engagement',
  '{"primary": "18K Rose Gold", "finish": "Polished"}',
  '{"type": "Diamond", "carat": 0.5, "cut": "Cushion", "clarity": "VS2", "color": "G", "halo_stones": 24, "total_carat": 0.82}',
  4.2, 18,
  array['https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800'],
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400',
  array['halo', 'romantic', 'vintage-inspired', 'rose-gold', 'feminine'],
  array['engagement', 'proposal', 'valentine']
),
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000005',
  'Eternal Knot Platinum Band',
  'Handcrafted platinum wedding band featuring an interlocking Celtic knot pattern symbolizing eternal love. Mirror-polished finish with comfort-fit interior. 950 platinum, 5mm width.',
  95000, 'INR', 'Rings', 'Wedding Band',
  '{"primary": "950 Platinum", "finish": "Mirror Polish"}',
  null,
  8.5, null,
  array['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
  array['celtic', 'platinum', 'symbolic', 'comfort-fit', 'unisex'],
  array['wedding', 'anniversary', 'commitment']
),
(
  'b1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000003',
  'Rajasthani Kundan Cocktail Ring',
  'Opulent cocktail ring featuring traditional Kundan setting with uncut diamonds, rubies, and green enamel (meenakari) work on the reverse. Set in 22K gold with a large central polki diamond. A wearable piece of Mughal heritage.',
  275000, 'INR', 'Rings', 'Cocktail',
  '{"primary": "22K Gold", "technique": "Kundan", "enamel": "Meenakari"}',
  '{"type": "Polki Diamond", "secondary": ["Ruby", "Emerald"], "setting": "Kundan"}',
  12.0, 22,
  array['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'],
  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400',
  array['kundan', 'traditional', 'rajasthani', 'statement', 'mughal', 'polki'],
  array['wedding', 'festive', 'reception', 'sangeet']
),
(
  'b1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000004',
  'Minimalist Sapphire Stack Ring',
  'Dainty 14K yellow gold stacking ring with a single bezel-set blue sapphire (0.15 ct). Perfect alone or layered with other stack rings. Ethically sourced Ceylon sapphire with vivid cornflower blue hue.',
  28000, 'INR', 'Rings', 'Fashion',
  '{"primary": "14K Yellow Gold", "finish": "Satin"}',
  '{"type": "Blue Sapphire", "carat": 0.15, "origin": "Sri Lanka", "color": "Cornflower Blue"}',
  1.5, 14,
  array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  array['minimalist', 'stackable', 'dainty', 'modern', 'everyday'],
  array['daily-wear', 'birthday', 'self-purchase']
),
(
  'b1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000002',
  'Temple Gold Finger Ring',
  'Traditional South Indian temple jewelry ring in 22K gold featuring Lakshmi motif with intricate granulation work. Weight 6 grams. Inspired by ancient Chola dynasty temple sculptures.',
  42000, 'INR', 'Rings', 'Traditional',
  '{"primary": "22K Gold", "technique": "Granulation", "style": "Temple"}',
  null,
  6.0, 22,
  array['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
  array['temple', 'south-indian', 'traditional', 'gold', 'lakshmi'],
  array['puja', 'festive', 'daily-wear', 'wedding']
);

-- ============================================================
-- Seed Products — Necklaces
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000007',
  'a1000000-0000-0000-0000-000000000001',
  'Diamond Rivière Necklace',
  'Stunning graduated diamond rivière necklace with 45 round brilliant diamonds totaling 8.5 carats, set in 18K white gold. Each diamond individually selected for exceptional brilliance. A timeless investment piece.',
  1250000, 'INR', 'Necklaces', 'Diamond',
  '{"primary": "18K White Gold", "finish": "Polished", "clasp": "Hidden Box"}',
  '{"type": "Diamond", "total_carat": 8.5, "count": 45, "cut": "Round Brilliant", "clarity": "VS1-VS2", "color": "F-G"}',
  28.0, 18,
  array['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800'],
  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400',
  array['riviere', 'diamond', 'luxury', 'investment', 'timeless', 'graduated'],
  array['gala', 'wedding', 'anniversary', 'red-carpet']
),
(
  'b1000000-0000-0000-0000-000000000008',
  'a1000000-0000-0000-0000-000000000003',
  'Kundan Choker Set with Earrings',
  'Regal Kundan choker necklace with matching jhumka earrings. Features uncut diamonds (polki), rubies, and emeralds in 22K gold Kundan setting. Reverse side adorned with vibrant red and green meenakari enamel work. Bridal heirloom quality.',
  485000, 'INR', 'Necklaces', 'Bridal Set',
  '{"primary": "22K Gold", "technique": "Kundan", "enamel": "Meenakari", "includes": "Matching Jhumka Earrings"}',
  '{"type": "Polki Diamond", "secondary": ["Ruby", "Emerald"], "setting": "Kundan"}',
  85.0, 22,
  array['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800'],
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400',
  array['kundan', 'bridal', 'choker', 'set', 'meenakari', 'polki', 'heirloom'],
  array['wedding', 'reception', 'sangeet', 'engagement']
),
(
  'b1000000-0000-0000-0000-000000000009',
  'a1000000-0000-0000-0000-000000000005',
  'Pearl Cascade Pendant Necklace',
  'Contemporary pendant necklace featuring cascading South Sea pearls (8-12mm) with diamond-studded 18K gold links. The asymmetric design creates a waterfall effect. Includes 0.45 carat total weight of brilliant diamonds.',
  165000, 'INR', 'Necklaces', 'Pendant',
  '{"primary": "18K Yellow Gold", "finish": "Polished"}',
  '{"type": "South Sea Pearl", "size_mm": "8-12", "secondary": "Diamond", "diamond_carat": 0.45}',
  18.0, 18,
  array['https://images.unsplash.com/photo-1515562141589-67f0d569b6c9?w=800'],
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c9?w=400',
  array['pearl', 'contemporary', 'cascade', 'elegant', 'artistic'],
  array['cocktail', 'dinner', 'anniversary', 'reception']
),
(
  'b1000000-0000-0000-0000-000000000010',
  'a1000000-0000-0000-0000-000000000002',
  'Antique Kemp Temple Necklace',
  'Traditional South Indian temple necklace with kemp (red) stones and green accents in a mango (paisley) motif. Crafted in gold-plated silver with intricate filigree work. Museum-quality reproduction of Thanjavur jewelry.',
  35000, 'INR', 'Necklaces', 'Temple',
  '{"primary": "Gold-Plated Silver", "technique": "Filigree", "style": "Temple"}',
  '{"type": "Kemp Stone", "secondary": ["Green Stone"], "motif": "Mango/Paisley"}',
  45.0, null,
  array['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
  array['temple', 'kemp', 'south-indian', 'antique', 'traditional', 'filigree'],
  array['bharatanatyam', 'puja', 'festive', 'wedding']
),
(
  'b1000000-0000-0000-0000-000000000011',
  'a1000000-0000-0000-0000-000000000004',
  'Layered Gold Chain Necklace',
  'Three-layer 14K gold chain necklace with different chain styles: delicate cable, paperclip, and rope chain. Adjustable 16-20 inch length. A versatile everyday piece that adds dimension without overwhelming.',
  48000, 'INR', 'Necklaces', 'Chain',
  '{"primary": "14K Yellow Gold", "chain_types": ["Cable", "Paperclip", "Rope"]}',
  null,
  8.0, 14,
  array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  array['layered', 'modern', 'versatile', 'everyday', 'minimal', 'trendy'],
  array['daily-wear', 'office', 'brunch', 'self-purchase']
),
(
  'b1000000-0000-0000-0000-000000000012',
  'a1000000-0000-0000-0000-000000000006',
  'Heart Diamond Pendant',
  'Sweet heart-shaped pendant with 0.25 carat diamond solitaire in 14K rose gold on a delicate 18-inch chain. Perfect gift for someone special. Comes in signature gift box.',
  32000, 'INR', 'Necklaces', 'Pendant',
  '{"primary": "14K Rose Gold", "chain_length": "18 inches"}',
  '{"type": "Diamond", "carat": 0.25, "cut": "Heart", "clarity": "SI1", "color": "H"}',
  3.2, 14,
  array['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
  array['heart', 'romantic', 'pendant', 'rose-gold', 'gift', 'sweet'],
  array['valentine', 'birthday', 'anniversary', 'gift']
),
(
  'b1000000-0000-0000-0000-000000000013',
  'a1000000-0000-0000-0000-000000000001',
  'Navratna Nine-Gem Necklace',
  'Auspicious Navratna necklace featuring all nine sacred gemstones — ruby, pearl, coral, emerald, yellow sapphire, diamond, blue sapphire, hessonite, and cat''s eye — set in 22K gold. Each stone is natural and certified. Believed to harness planetary energies.',
  320000, 'INR', 'Necklaces', 'Traditional',
  '{"primary": "22K Gold", "setting": "Bezel"}',
  '{"type": "Navratna", "stones": ["Ruby", "Pearl", "Coral", "Emerald", "Yellow Sapphire", "Diamond", "Blue Sapphire", "Hessonite", "Cats Eye"], "certified": true}',
  22.0, 22,
  array['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
  array['navratna', 'auspicious', 'traditional', 'nine-gems', 'spiritual', 'certified'],
  array['wedding', 'festive', 'puja', 'auspicious-occasion']
);

-- ============================================================
-- Seed Products — Earrings
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000014',
  'a1000000-0000-0000-0000-000000000003',
  'Peacock Jhumka Earrings',
  'Elaborate peacock-motif jhumka earrings in 22K gold with Kundan setting, featuring turquoise enamel and pearl drops. The bell-shaped jhumka creates a gentle tinkling sound. Each earring weighs 15 grams.',
  120000, 'INR', 'Earrings', 'Jhumka',
  '{"primary": "22K Gold", "technique": "Kundan", "enamel": "Turquoise Meenakari"}',
  '{"type": "Pearl", "secondary": ["Kundan"], "drops": 5}',
  30.0, 22,
  array['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800'],
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400',
  array['jhumka', 'peacock', 'kundan', 'traditional', 'statement', 'meenakari'],
  array['wedding', 'festive', 'sangeet', 'reception']
),
(
  'b1000000-0000-0000-0000-000000000015',
  'a1000000-0000-0000-0000-000000000004',
  'Diamond Huggie Hoop Earrings',
  'Petite diamond huggie hoops in 14K white gold with 0.30 carat total weight of pavé diamonds. 12mm diameter, hinged closure for secure wear. Versatile enough for office to evening.',
  42000, 'INR', 'Earrings', 'Hoops',
  '{"primary": "14K White Gold", "closure": "Hinged", "diameter_mm": 12}',
  '{"type": "Diamond", "total_carat": 0.30, "setting": "Pavé", "count": 20}',
  3.0, 14,
  array['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800'],
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400',
  array['huggie', 'hoops', 'diamond', 'minimal', 'versatile', 'modern'],
  array['daily-wear', 'office', 'evening', 'self-purchase']
),
(
  'b1000000-0000-0000-0000-000000000016',
  'a1000000-0000-0000-0000-000000000005',
  'Emerald Drop Chandelier Earrings',
  'Show-stopping chandelier earrings with Zambian emeralds (4.2 ct total) and diamonds (1.8 ct) in 18K yellow gold. Five-tier waterfall design that catches light with every movement. Red carpet worthy.',
  425000, 'INR', 'Earrings', 'Chandelier',
  '{"primary": "18K Yellow Gold", "finish": "Polished"}',
  '{"type": "Emerald", "carat": 4.2, "origin": "Zambia", "secondary": "Diamond", "diamond_carat": 1.8}',
  16.0, 18,
  array['https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800'],
  'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400',
  array['chandelier', 'emerald', 'luxury', 'statement', 'red-carpet', 'dramatic'],
  array['gala', 'wedding', 'reception', 'cocktail']
),
(
  'b1000000-0000-0000-0000-000000000017',
  'a1000000-0000-0000-0000-000000000006',
  'Daily Wear Diamond Studs',
  'Classic round diamond stud earrings with 0.50 carat total weight (0.25 each) in 14K yellow gold four-prong setting. H color, SI1 clarity. Screw-back posts for security. The essential everyday diamond.',
  38000, 'INR', 'Earrings', 'Studs',
  '{"primary": "14K Yellow Gold", "closure": "Screw-back", "setting": "Four-prong"}',
  '{"type": "Diamond", "total_carat": 0.50, "each_carat": 0.25, "cut": "Round Brilliant", "clarity": "SI1", "color": "H"}',
  2.0, 14,
  array['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'],
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400',
  array['studs', 'classic', 'everyday', 'essential', 'timeless', 'diamond'],
  array['daily-wear', 'office', 'gift', 'birthday']
),
(
  'b1000000-0000-0000-0000-000000000018',
  'a1000000-0000-0000-0000-000000000002',
  'Chandbali Pearl Earrings',
  'Crescent moon-shaped Chandbali earrings in 22K gold with pearls, uncut diamonds, and ruby accents. Inspired by Hyderabadi Nizami jewelry tradition. A perfect blend of Mughal grandeur and wearability.',
  88000, 'INR', 'Earrings', 'Chandbali',
  '{"primary": "22K Gold", "technique": "Polki", "style": "Hyderabadi"}',
  '{"type": "Pearl", "secondary": ["Polki Diamond", "Ruby"], "shape": "Crescent"}',
  18.0, 22,
  array['https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800'],
  'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=400',
  array['chandbali', 'hyderabadi', 'mughal', 'pearl', 'traditional', 'nizami'],
  array['wedding', 'reception', 'festive', 'eid']
),
(
  'b1000000-0000-0000-0000-000000000019',
  'a1000000-0000-0000-0000-000000000001',
  'Ruby Floral Stud Earrings',
  'Delicate floral-motif stud earrings with a central Burmese ruby (0.40 ct each) surrounded by diamond petals (0.60 ct total). 18K white gold. The flower design adds femininity without being overly ornate.',
  72000, 'INR', 'Earrings', 'Studs',
  '{"primary": "18K White Gold", "closure": "Push-back"}',
  '{"type": "Ruby", "carat": 0.80, "origin": "Burma", "secondary": "Diamond", "diamond_carat": 0.60, "motif": "Floral"}',
  4.5, 18,
  array['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'],
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400',
  array['floral', 'ruby', 'feminine', 'elegant', 'studs', 'delicate'],
  array['party', 'dinner', 'anniversary', 'birthday']
);

-- ============================================================
-- Seed Products — Bracelets & Bangles
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000020',
  'a1000000-0000-0000-0000-000000000001',
  'Diamond Tennis Bracelet',
  'Classic tennis bracelet with 3.00 carats of round brilliant diamonds in 18K white gold four-prong setting. 7 inches with fold-over clasp and safety chain. Each diamond is F-G color, VS clarity.',
  285000, 'INR', 'Bracelets', 'Tennis',
  '{"primary": "18K White Gold", "clasp": "Fold-over with Safety Chain", "length_inches": 7}',
  '{"type": "Diamond", "total_carat": 3.00, "count": 52, "cut": "Round Brilliant", "clarity": "VS1-VS2", "color": "F-G"}',
  12.0, 18,
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  array['tennis', 'diamond', 'classic', 'luxury', 'timeless', 'investment'],
  array['anniversary', 'gala', 'wedding', 'milestone']
),
(
  'b1000000-0000-0000-0000-000000000021',
  'a1000000-0000-0000-0000-000000000003',
  'Rajasthani Lac Bangles Set (12 pieces)',
  'Set of 12 hand-crafted lac bangles in vibrant red and green with gold foil work, mirror embellishments, and stone accents. Traditional Rajasthani craft. Each bangle features unique patterns.',
  4500, 'INR', 'Bangles', 'Traditional Set',
  '{"primary": "Lac", "embellishments": ["Gold Foil", "Mirror", "Stone"], "count": 12}',
  null,
  120.0, null,
  array['https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=800'],
  'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=400',
  array['lac', 'rajasthani', 'colorful', 'traditional', 'handcrafted', 'set'],
  array['wedding', 'festive', 'teej', 'karva-chauth']
),
(
  'b1000000-0000-0000-0000-000000000022',
  'a1000000-0000-0000-0000-000000000004',
  'Gold Cuff Bracelet with Geometric Pattern',
  'Bold 18K gold cuff bracelet with laser-cut geometric patterns. 25mm wide with an adjustable opening. Matte brushed finish with polished geometric edges for contrast. A modern statement piece.',
  125000, 'INR', 'Bracelets', 'Cuff',
  '{"primary": "18K Yellow Gold", "finish": "Matte Brushed with Polished Accents", "width_mm": 25}',
  null,
  32.0, 18,
  array['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
  'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400',
  array['cuff', 'geometric', 'modern', 'bold', 'statement', 'architectural'],
  array['cocktail', 'party', 'self-purchase', 'office']
),
(
  'b1000000-0000-0000-0000-000000000023',
  'a1000000-0000-0000-0000-000000000002',
  '22K Gold Kada (Thick Bangle)',
  'Traditional 22K gold kada (thick bangle) with antique finish and floral vine engraving. Weight 28 grams. Suitable for both men and women. A classic piece that appreciates in value over time.',
  196000, 'INR', 'Bangles', 'Kada',
  '{"primary": "22K Gold", "finish": "Antique", "engraving": "Floral Vine"}',
  null,
  28.0, 22,
  array['https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=800'],
  'https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=400',
  array['kada', 'traditional', 'unisex', 'heavy', 'investment', 'antique'],
  array['wedding', 'festive', 'daily-wear', 'gift']
),
(
  'b1000000-0000-0000-0000-000000000024',
  'a1000000-0000-0000-0000-000000000006',
  'Charm Bracelet - Travel Collection',
  'Sterling silver charm bracelet with 7 travel-themed charms: airplane, compass, camera, Eiffel Tower, palm tree, suitcase, and globe. Adjustable 6.5-8 inch length. Add more charms to tell your story.',
  8500, 'INR', 'Bracelets', 'Charm',
  '{"primary": "925 Sterling Silver", "finish": "Rhodium Plated", "charms": 7}',
  null,
  22.0, null,
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  array['charm', 'travel', 'fun', 'personalizable', 'silver', 'casual'],
  array['birthday', 'graduation', 'farewell', 'self-purchase']
),
(
  'b1000000-0000-0000-0000-000000000025',
  'a1000000-0000-0000-0000-000000000005',
  'Sapphire & Diamond Bangle',
  'Elegant hinged bangle bracelet alternating between oval blue sapphires (3.6 ct total) and marquise diamonds (1.2 ct total) in 18K white gold. Hidden hinge with figure-eight safety clasp.',
  345000, 'INR', 'Bangles', 'Gemstone',
  '{"primary": "18K White Gold", "clasp": "Hidden Hinge with Safety"}',
  '{"type": "Blue Sapphire", "sapphire_carat": 3.6, "secondary": "Diamond", "diamond_carat": 1.2, "sapphire_cut": "Oval", "diamond_cut": "Marquise"}',
  18.0, 18,
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  array['sapphire', 'diamond', 'elegant', 'luxury', 'bangle', 'formal'],
  array['gala', 'anniversary', 'reception', 'cocktail']
);

-- ============================================================
-- Seed Products — Pendants & Mangalsutras
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000026',
  'a1000000-0000-0000-0000-000000000001',
  'Modern Diamond Mangalsutra',
  'Contemporary mangalsutra redesigned for the modern bride. 18K white and rose gold pendant with 0.35 carat diamonds in a sleek infinity motif, strung on a delicate black bead chain. 18 inches.',
  65000, 'INR', 'Necklaces', 'Mangalsutra',
  '{"primary": "18K White and Rose Gold", "chain": "Black Bead", "length_inches": 18}',
  '{"type": "Diamond", "total_carat": 0.35, "motif": "Infinity"}',
  8.0, 18,
  array['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
  array['mangalsutra', 'modern', 'bridal', 'diamond', 'contemporary', 'everyday'],
  array['wedding', 'daily-wear']
),
(
  'b1000000-0000-0000-0000-000000000027',
  'a1000000-0000-0000-0000-000000000004',
  'Evil Eye Diamond Pendant',
  'Trendy evil eye pendant in 14K yellow gold with blue sapphire iris (0.10 ct), diamond surround (0.20 ct), and a pop of turquoise enamel. Comes on an 18-inch chain. Protection meets style.',
  24000, 'INR', 'Necklaces', 'Pendant',
  '{"primary": "14K Yellow Gold", "enamel": "Turquoise", "chain_length": "18 inches"}',
  '{"type": "Blue Sapphire", "carat": 0.10, "secondary": "Diamond", "diamond_carat": 0.20}',
  3.5, 14,
  array['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
  array['evil-eye', 'trendy', 'protective', 'enamel', 'fun', 'modern'],
  array['daily-wear', 'gift', 'birthday', 'self-purchase']
),
(
  'b1000000-0000-0000-0000-000000000028',
  'a1000000-0000-0000-0000-000000000007',
  'Oval Tanzanite Halo Pendant',
  'Mesmerizing 2.5 carat oval tanzanite surrounded by a halo of 0.40 carat diamonds in 18K white gold. The tanzanite displays the prized violet-blue color shift. On an 18-inch cable chain.',
  185000, 'INR', 'Necklaces', 'Pendant',
  '{"primary": "18K White Gold", "chain": "Cable Chain", "chain_length": "18 inches"}',
  '{"type": "Tanzanite", "carat": 2.5, "cut": "Oval", "secondary": "Diamond", "diamond_carat": 0.40}',
  6.0, 18,
  array['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
  array['tanzanite', 'halo', 'elegant', 'color-change', 'luxury', 'pendant'],
  array['anniversary', 'birthday', 'dinner', 'gift']
);

-- ============================================================
-- Seed Products — Anklets & Waist Chains
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000029',
  'a1000000-0000-0000-0000-000000000002',
  'Silver Ghungroo Anklet (Pair)',
  'Traditional sterling silver anklets with 20 tiny ghungroo (bells) each, creating a melodic sound with every step. Adjustable chain closure. Total weight 40 grams for the pair. Oxidized finish for antique look.',
  5500, 'INR', 'Anklets', 'Traditional',
  '{"primary": "925 Sterling Silver", "finish": "Oxidized", "bells_per_anklet": 20}',
  null,
  40.0, null,
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  array['ghungroo', 'silver', 'musical', 'traditional', 'oxidized', 'pair'],
  array['festive', 'wedding', 'puja', 'daily-wear']
),
(
  'b1000000-0000-0000-0000-000000000030',
  'a1000000-0000-0000-0000-000000000004',
  'Dainty Gold Anklet with Charm',
  'Minimalist 14K gold anklet with a tiny diamond star charm (0.05 ct). 9-10 inch adjustable length. Waterproof and tarnish-resistant. Perfect for beach to dinner transitions.',
  18000, 'INR', 'Anklets', 'Modern',
  '{"primary": "14K Yellow Gold", "length_inches": "9-10", "waterproof": true}',
  '{"type": "Diamond", "carat": 0.05, "charm": "Star"}',
  2.0, 14,
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  array['dainty', 'minimalist', 'modern', 'waterproof', 'everyday', 'charm'],
  array['beach', 'daily-wear', 'vacation', 'self-purchase']
);

-- ============================================================
-- Seed Products — Nose Pins & Maang Tikka
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000031',
  'a1000000-0000-0000-0000-000000000001',
  'Diamond Nose Pin - Screw Type',
  'Petite diamond nose pin with a single 0.08 carat round brilliant diamond in 18K yellow gold. Screw-type closure for secure fit. Barely-there sparkle that catches light beautifully.',
  12000, 'INR', 'Nose Pins', 'Diamond',
  '{"primary": "18K Yellow Gold", "closure": "Screw-type"}',
  '{"type": "Diamond", "carat": 0.08, "cut": "Round Brilliant", "clarity": "VS2", "color": "G"}',
  0.5, 18,
  array['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'],
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400',
  array['nose-pin', 'diamond', 'petite', 'everyday', 'classic', 'screw-type'],
  array['daily-wear', 'wedding', 'festive']
),
(
  'b1000000-0000-0000-0000-000000000032',
  'a1000000-0000-0000-0000-000000000003',
  'Kundan Maang Tikka with Pearl Drops',
  'Ornate maang tikka (forehead jewel) in 22K gold Kundan setting with central polki diamond, ruby accents, and cascading pearl drops. Adjustable chain with hook. A bridal essential.',
  55000, 'INR', 'Head Jewelry', 'Maang Tikka',
  '{"primary": "22K Gold", "technique": "Kundan", "style": "Bridal"}',
  '{"type": "Polki Diamond", "secondary": ["Ruby", "Pearl"], "setting": "Kundan"}',
  14.0, 22,
  array['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800'],
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400',
  array['maang-tikka', 'bridal', 'kundan', 'polki', 'traditional', 'pearl'],
  array['wedding', 'reception', 'sangeet', 'engagement']
);

-- ============================================================
-- Seed Products — Men's Jewelry
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000033',
  'a1000000-0000-0000-0000-000000000002',
  'Men''s Gold Chain - Cuban Link',
  'Bold 22K gold Cuban link chain for men. 22 inches, 35 grams. Each link hand-polished for maximum shine. Box clasp with safety catch. A classic investment piece.',
  245000, 'INR', 'Necklaces', 'Men''s Chain',
  '{"primary": "22K Yellow Gold", "style": "Cuban Link", "clasp": "Box with Safety", "length_inches": 22}',
  null,
  35.0, 22,
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  array['mens', 'cuban-link', 'bold', 'gold', 'investment', 'classic'],
  array['daily-wear', 'gift', 'wedding']
),
(
  'b1000000-0000-0000-0000-000000000034',
  'a1000000-0000-0000-0000-000000000007',
  'Men''s Platinum Wedding Band',
  'Sleek 950 platinum wedding band with brushed center and polished edges. 6mm width, comfort-fit. Laser engraving available. Hypoallergenic and perfect for active lifestyles.',
  75000, 'INR', 'Rings', 'Men''s Wedding Band',
  '{"primary": "950 Platinum", "finish": "Brushed Center, Polished Edges", "width_mm": 6, "engravable": true}',
  null,
  10.0, null,
  array['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800'],
  'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400',
  array['mens', 'platinum', 'wedding-band', 'comfort-fit', 'sleek', 'modern'],
  array['wedding', 'commitment', 'anniversary']
),
(
  'b1000000-0000-0000-0000-000000000035',
  'a1000000-0000-0000-0000-000000000006',
  'Black Onyx Cufflinks',
  'Sophisticated sterling silver cufflinks with polished black onyx cabochons. Whale-back closure for easy use. Comes in a premium wooden gift box. Ideal for formal occasions.',
  6500, 'INR', 'Accessories', 'Cufflinks',
  '{"primary": "925 Sterling Silver", "closure": "Whale-back"}',
  '{"type": "Black Onyx", "cut": "Cabochon", "shape": "Round"}',
  12.0, null,
  array['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'],
  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  array['cufflinks', 'mens', 'formal', 'onyx', 'silver', 'sophisticated'],
  array['wedding', 'business', 'formal-event', 'gift']
);

-- ============================================================
-- Seed Products — Bridal Sets
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000036',
  'a1000000-0000-0000-0000-000000000001',
  'Complete South Indian Bridal Set',
  'Magnificent complete bridal set in the Chettinad style: temple necklace (haram), choker, jhumka earrings, maang tikka, and waist chain (oddiyanam). All in 22K gold with ruby and emerald accents. Total gold weight: 180 grams.',
  1350000, 'INR', 'Bridal Sets', 'South Indian',
  '{"primary": "22K Gold", "technique": "Temple", "pieces": ["Haram", "Choker", "Jhumkas", "Maang Tikka", "Oddiyanam"]}',
  '{"type": "Ruby", "secondary": ["Emerald"], "style": "Temple"}',
  180.0, 22,
  array['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800'],
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400',
  array['bridal-set', 'south-indian', 'temple', 'complete', 'heirloom', 'chettinad'],
  array['wedding']
),
(
  'b1000000-0000-0000-0000-000000000037',
  'a1000000-0000-0000-0000-000000000003',
  'Rajputana Bridal Necklace Set',
  'Royal Rajputana bridal necklace set with matching earrings and tikka. Features Kundan-Meenakari work with polki diamonds, emerald drops, and pearl strands. Reverse side shows exquisite red and green enamel. Heirloom quality.',
  550000, 'INR', 'Bridal Sets', 'Rajasthani',
  '{"primary": "22K Gold", "technique": "Kundan-Meenakari", "pieces": ["Necklace", "Earrings", "Tikka"]}',
  '{"type": "Polki Diamond", "secondary": ["Emerald", "Pearl"], "enamel": "Red and Green Meenakari"}',
  95.0, 22,
  array['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800'],
  'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=400',
  array['bridal-set', 'rajputana', 'kundan', 'meenakari', 'royal', 'heirloom'],
  array['wedding', 'reception']
);

-- ============================================================
-- Seed Products — Affordable / Silver Range
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000038',
  'a1000000-0000-0000-0000-000000000006',
  'Silver Filigree Earrings',
  'Delicate Odisha filigree (tarkashi) earrings in pure silver. Lightweight, intricate silver wire work forming floral patterns. A GI-tagged craft tradition preserved by master artisans.',
  2800, 'INR', 'Earrings', 'Silver',
  '{"primary": "999 Fine Silver", "technique": "Filigree/Tarkashi", "origin": "Cuttack, Odisha"}',
  null,
  6.0, null,
  array['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800'],
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400',
  array['filigree', 'silver', 'artisanal', 'lightweight', 'odisha', 'handcrafted'],
  array['daily-wear', 'casual', 'gift', 'college']
),
(
  'b1000000-0000-0000-0000-000000000039',
  'a1000000-0000-0000-0000-000000000006',
  'Oxidized Silver Tribal Necklace',
  'Bohemian-inspired oxidized silver necklace with tribal motifs, coins, and red thread accents. Adjustable 16-20 inch length. Pairs beautifully with both ethnic and western outfits.',
  3200, 'INR', 'Necklaces', 'Silver',
  '{"primary": "925 Sterling Silver", "finish": "Oxidized", "accents": "Red Thread"}',
  null,
  35.0, null,
  array['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
  array['tribal', 'bohemian', 'oxidized', 'silver', 'statement', 'fusion'],
  array['casual', 'college', 'festival', 'daily-wear']
),
(
  'b1000000-0000-0000-0000-000000000040',
  'a1000000-0000-0000-0000-000000000006',
  'Amethyst Silver Ring',
  'Sterling silver cocktail ring with a 3 carat cushion-cut amethyst in a vintage-inspired setting with marcasite details. Adjustable band fits sizes 5-8.',
  4200, 'INR', 'Rings', 'Silver',
  '{"primary": "925 Sterling Silver", "details": "Marcasite", "adjustable": true}',
  '{"type": "Amethyst", "carat": 3.0, "cut": "Cushion"}',
  8.0, null,
  array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  array['amethyst', 'vintage', 'silver', 'cocktail', 'affordable', 'adjustable'],
  array['casual', 'party', 'daily-wear', 'gift']
);

-- ============================================================
-- Seed Products — Contemporary / Fusion
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000041',
  'a1000000-0000-0000-0000-000000000005',
  'Geometric Art Deco Earrings',
  'Bold art deco inspired earrings in 18K white gold with black onyx inlays and diamond accents (0.45 ct). The angular geometric design pays homage to 1920s glamour while feeling thoroughly modern.',
  98000, 'INR', 'Earrings', 'Art Deco',
  '{"primary": "18K White Gold", "inlay": "Black Onyx"}',
  '{"type": "Diamond", "total_carat": 0.45, "secondary": "Black Onyx", "style": "Art Deco"}',
  8.5, 18,
  array['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800'],
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400',
  array['art-deco', 'geometric', 'modern', 'onyx', 'bold', 'architectural'],
  array['cocktail', 'gallery', 'dinner', 'party']
),
(
  'b1000000-0000-0000-0000-000000000042',
  'a1000000-0000-0000-0000-000000000004',
  'Birthstone Signet Ring - Customizable',
  'Modern signet ring in 14K yellow gold that can be set with your choice of birthstone. Cushion shape, 10x8mm top surface. Matte finish with polished edges. Shown with blue topaz (December).',
  35000, 'INR', 'Rings', 'Personalized',
  '{"primary": "14K Yellow Gold", "finish": "Matte with Polished Edges", "customizable": true}',
  '{"type": "Blue Topaz", "carat": 2.0, "note": "Birthstone customizable"}',
  7.0, 14,
  array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  array['signet', 'personalized', 'birthstone', 'modern', 'customizable', 'unisex'],
  array['birthday', 'graduation', 'self-purchase', 'gift']
),
(
  'b1000000-0000-0000-0000-000000000043',
  'a1000000-0000-0000-0000-000000000005',
  'Constellation Diamond Necklace',
  'Your zodiac constellation mapped in diamonds on an 18K gold disc pendant. 0.12 carat total diamonds. Each star is a tiny brilliant-cut diamond placed astronomically. Available in all 12 signs. Shown: Scorpio.',
  42000, 'INR', 'Necklaces', 'Personalized',
  '{"primary": "18K Yellow Gold", "chain_length": "16-18 inches adjustable", "customizable": true}',
  '{"type": "Diamond", "total_carat": 0.12, "note": "Constellation customizable"}',
  4.0, 18,
  array['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
  array['constellation', 'zodiac', 'personalized', 'modern', 'meaningful', 'celestial'],
  array['birthday', 'self-purchase', 'gift', 'valentine']
);

-- ============================================================
-- Seed Products — Investment / High-Value
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000044',
  'a1000000-0000-0000-0000-000000000007',
  'Fancy Yellow Diamond Ring',
  'Exceptional 1.5 carat fancy vivid yellow diamond in a platinum and 18K yellow gold setting with white diamond shoulders (0.60 ct). GIA certified natural fancy vivid yellow. An investment-grade collector''s piece.',
  850000, 'INR', 'Rings', 'Investment',
  '{"primary": "Platinum with 18K Yellow Gold", "setting": "Cathedral"}',
  '{"type": "Fancy Yellow Diamond", "carat": 1.5, "grade": "Fancy Vivid", "clarity": "VVS2", "secondary": "White Diamond", "white_diamond_carat": 0.60, "certification": "GIA"}',
  5.5, null,
  array['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
  array['fancy-yellow', 'investment', 'collector', 'rare', 'gia-certified', 'luxury'],
  array['engagement', 'investment', 'milestone', 'collector']
),
(
  'b1000000-0000-0000-0000-000000000045',
  'a1000000-0000-0000-0000-000000000005',
  'Kashmir Sapphire Pendant',
  'Museum-quality 3.2 carat Kashmir sapphire pendant in 18K white gold with diamond frame (0.75 ct). The sapphire displays the legendary velvety cornflower blue exclusive to Kashmir origin. Gübelin certified.',
  1500000, 'INR', 'Necklaces', 'Investment',
  '{"primary": "18K White Gold", "chain_length": "18 inches"}',
  '{"type": "Kashmir Sapphire", "carat": 3.2, "origin": "Kashmir", "color": "Velvety Cornflower Blue", "secondary": "Diamond", "diamond_carat": 0.75, "certification": "Gübelin"}',
  8.0, 18,
  array['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800'],
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400',
  array['kashmir-sapphire', 'museum-quality', 'investment', 'rare', 'certified', 'collector'],
  array['investment', 'collector', 'milestone', 'heirloom']
);

-- ============================================================
-- Seed Products — Additional items to reach 50+
-- ============================================================
insert into public.products (id, seller_id, name, description, price, currency, category, subcategory, materials, gemstones, weight_grams, karat, images, thumbnail_url, style_tags, occasion_tags) values
(
  'b1000000-0000-0000-0000-000000000046',
  'a1000000-0000-0000-0000-000000000002',
  'Gold Coin Pendant (8 grams)',
  'Pure 24K gold coin pendant featuring Goddess Lakshmi on one side and Om symbol on the reverse. 8 grams. Comes with a simple 22K gold chain. An auspicious investment gift.',
  56000, 'INR', 'Necklaces', 'Gold Coin',
  '{"primary": "24K Gold Coin with 22K Chain", "coin_weight_grams": 8}',
  null,
  12.0, 24,
  array['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
  array['gold-coin', 'lakshmi', 'investment', 'auspicious', 'traditional', '24k'],
  array['diwali', 'dhanteras', 'akshaya-tritiya', 'gift']
),
(
  'b1000000-0000-0000-0000-000000000047',
  'a1000000-0000-0000-0000-000000000004',
  'Convertible Jacket Earrings',
  'Innovative 2-in-1 earrings in 14K rose gold. Wear the diamond studs (0.30 ct) alone for day, or attach the rose gold fan-shaped jackets with pink sapphires (0.50 ct) for evening drama.',
  55000, 'INR', 'Earrings', 'Convertible',
  '{"primary": "14K Rose Gold", "type": "Convertible Jacket"}',
  '{"type": "Diamond", "diamond_carat": 0.30, "secondary": "Pink Sapphire", "sapphire_carat": 0.50}',
  5.0, 14,
  array['https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800'],
  'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400',
  array['convertible', 'versatile', 'modern', 'rose-gold', 'innovative', 'day-to-night'],
  array['office', 'dinner', 'daily-wear', 'self-purchase']
),
(
  'b1000000-0000-0000-0000-000000000048',
  'a1000000-0000-0000-0000-000000000001',
  'Three-Stone Anniversary Ring',
  'Past, present, future three-stone ring with graduated round brilliant diamonds: 0.50 ct center with 0.30 ct sides (1.10 ct total). 18K yellow gold basket setting. A meaningful anniversary gift.',
  165000, 'INR', 'Rings', 'Anniversary',
  '{"primary": "18K Yellow Gold", "setting": "Basket", "symbolism": "Past, Present, Future"}',
  '{"type": "Diamond", "center_carat": 0.50, "side_carat": 0.30, "total_carat": 1.10, "clarity": "VS2", "color": "G"}',
  4.0, 18,
  array['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
  array['three-stone', 'anniversary', 'symbolic', 'classic', 'diamond', 'meaningful'],
  array['anniversary', 'milestone', 'gift']
),
(
  'b1000000-0000-0000-0000-000000000049',
  'a1000000-0000-0000-0000-000000000003',
  'Hasli Necklace - Tribal Gold',
  'Rigid hasli (torque) necklace in 22K gold with tribal motifs inspired by Rajasthani pastoral communities. 40 grams. The open-ended design allows easy wearing. A bold fusion of tribal and luxury.',
  280000, 'INR', 'Necklaces', 'Tribal',
  '{"primary": "22K Gold", "style": "Hasli/Torque", "motif": "Tribal"}',
  null,
  40.0, 22,
  array['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'],
  'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
  array['hasli', 'tribal', 'bold', 'statement', 'rigid', 'fusion'],
  array['festive', 'reception', 'cocktail', 'art-event']
),
(
  'b1000000-0000-0000-0000-000000000050',
  'a1000000-0000-0000-0000-000000000006',
  'Pearl Strand Necklace - Classic',
  'Timeless single-strand freshwater pearl necklace. 55 hand-knotted 7-8mm pearls with excellent luster. 18K gold ball clasp. 18 inches. Every woman''s wardrobe essential.',
  15000, 'INR', 'Necklaces', 'Pearl',
  '{"primary": "Freshwater Pearl with 18K Gold Clasp", "pearl_size_mm": "7-8", "count": 55, "knotted": true}',
  '{"type": "Freshwater Pearl", "size_mm": "7-8", "luster": "Excellent", "count": 55}',
  32.0, null,
  array['https://images.unsplash.com/photo-1515562141589-67f0d569b6c9?w=800'],
  'https://images.unsplash.com/photo-1515562141589-67f0d569b6c9?w=400',
  array['pearl', 'classic', 'timeless', 'essential', 'elegant', 'strand'],
  array['office', 'dinner', 'wedding', 'daily-wear', 'gift']
),
(
  'b1000000-0000-0000-0000-000000000051',
  'a1000000-0000-0000-0000-000000000005',
  'Emerald Eternity Band',
  'Channel-set emerald eternity band with 2.4 carats of calibrated Colombian emeralds in 18K yellow gold. Full eternity design symbolizes never-ending love. Vivid green with excellent transparency.',
  195000, 'INR', 'Rings', 'Eternity Band',
  '{"primary": "18K Yellow Gold", "setting": "Channel"}',
  '{"type": "Colombian Emerald", "total_carat": 2.4, "origin": "Colombia", "color": "Vivid Green"}',
  4.5, 18,
  array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  array['eternity', 'emerald', 'colombian', 'band', 'symbolic', 'green'],
  array['anniversary', 'wedding', 'milestone', 'self-purchase']
),
(
  'b1000000-0000-0000-0000-000000000052',
  'a1000000-0000-0000-0000-000000000007',
  'Lab-Grown Diamond Solitaire Ring',
  'Stunning 1.0 carat lab-grown diamond solitaire in 18K white gold. IGI certified, ideal cut, D color, VVS1 clarity. Identical to mined diamonds at a fraction of the price. Sustainable luxury.',
  95000, 'INR', 'Rings', 'Engagement',
  '{"primary": "18K White Gold", "setting": "Six-prong"}',
  '{"type": "Lab-Grown Diamond", "carat": 1.0, "cut": "Ideal Round Brilliant", "clarity": "VVS1", "color": "D", "certification": "IGI", "sustainable": true}',
  3.5, 18,
  array['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
  array['lab-grown', 'sustainable', 'solitaire', 'modern', 'ethical', 'affordable-luxury'],
  array['engagement', 'proposal', 'anniversary']
);
