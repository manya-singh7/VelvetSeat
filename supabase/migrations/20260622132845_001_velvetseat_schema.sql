-- Salons table
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  rating DECIMAL(3,2) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  price_tier INTEGER DEFAULT 2 CHECK (price_tier BETWEEN 1 AND 3),
  hero_image TEXT NOT NULL,
  is_open BOOLEAN DEFAULT true,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hair', 'bridal', 'skin', 'nail', 'grooming')),
  duration_minutes INTEGER NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stylist lookbook table
CREATE TABLE stylist_lookbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  style_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stylist_lookbook ENABLE ROW LEVEL SECURITY;

-- RLS Policies for salons (public read)
CREATE POLICY "read_salons" ON salons FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_salons_anon" ON salons FOR SELECT TO anon USING (true);

-- RLS Policies for services (public read)
CREATE POLICY "read_services" ON services FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_services_anon" ON services FOR SELECT TO anon USING (true);

-- RLS Policies for reviews (public read)
CREATE POLICY "read_reviews" ON reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_reviews_anon" ON reviews FOR SELECT TO anon USING (true);

-- RLS Policies for bookings
CREATE POLICY "read_bookings" ON bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_bookings" ON bookings FOR INSERT TO authenticated WITH CHECK (true);

-- RLS Policies for stylist_lookbook (public read)
CREATE POLICY "read_lookbook" ON stylist_lookbook FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_lookbook_anon" ON stylist_lookbook FOR SELECT TO anon USING (true);