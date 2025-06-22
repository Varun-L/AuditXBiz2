-- Enable PostGIS extension for geographic operations
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'business', 'auditor', 'supplier', 'consumer');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'package_sent', 'package_delivered', 'completed');
CREATE TYPE audit_status AS ENUM ('not_started', 'on_field', 'in_progress', 'completed');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'consumer',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  pin_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(Point, 4326), -- PostGIS geography column
  aadhaar_card_url TEXT,
  pan_card_url TEXT,
  driving_license_url TEXT,
  upi_handle TEXT, -- For auditors
  bank_account_number TEXT, -- For auditors
  ifsc_code TEXT, -- For auditors
  vehicle_type TEXT, -- For suppliers
  vehicle_number TEXT, -- For suppliers
  is_approved BOOLEAN DEFAULT false, -- For self-onboarded users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business categories table
CREATE TABLE business_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  payout_amount INTEGER NOT NULL, -- Amount in paise (₹200 = 20000 paise)
  checklist JSONB NOT NULL, -- JSON structure for audit questions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category_id UUID REFERENCES business_categories(id) NOT NULL,
  owner_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pin_code TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(Point, 4326), -- PostGIS geography column
  phone_number TEXT,
  email TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplier tasks table
CREATE TABLE supplier_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supplier_id UUID REFERENCES profiles(id) NOT NULL,
  business_id UUID REFERENCES businesses(id) NOT NULL,
  status task_status DEFAULT 'todo',
  distance_km DECIMAL(8, 2), -- Distance from supplier to business
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auditor tasks table
CREATE TABLE auditor_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auditor_id UUID REFERENCES profiles(id) NOT NULL,
  business_id UUID REFERENCES businesses(id) NOT NULL,
  category_id UUID REFERENCES business_categories(id) NOT NULL,
  status audit_status DEFAULT 'not_started',
  payout_amount INTEGER NOT NULL,
  distance_km DECIMAL(8, 2), -- Distance from auditor to business
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit reports table
CREATE TABLE audit_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auditor_task_id UUID REFERENCES auditor_tasks(id) NOT NULL,
  auditor_id UUID REFERENCES profiles(id) NOT NULL,
  business_id UUID REFERENCES businesses(id) NOT NULL,
  responses JSONB NOT NULL, -- JSON structure containing answers to checklist questions
  photos TEXT[], -- Array of photo URLs
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding applications table (for self-onboarded users)
CREATE TABLE onboarding_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  address TEXT,
  city TEXT,
  pin_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(Point, 4326),
  application_data JSONB, -- Store role-specific data
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditor_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Business categories: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view business categories" ON business_categories FOR SELECT TO authenticated USING (true);

-- Businesses: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view businesses" ON businesses FOR SELECT TO authenticated USING (true);

-- Supplier tasks: Suppliers can view/update their own tasks, admins can view all
CREATE POLICY "Suppliers can view own tasks" ON supplier_tasks FOR SELECT USING (
  supplier_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Suppliers can update own tasks" ON supplier_tasks FOR UPDATE USING (supplier_id = auth.uid());

-- Auditor tasks: Auditors can view their own tasks, admins can view all
CREATE POLICY "Auditors can view own tasks" ON auditor_tasks FOR SELECT USING (
  auditor_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Audit reports: Auditors can create their own reports, admins can view all
CREATE POLICY "Auditors can create own reports" ON audit_reports FOR INSERT WITH CHECK (auditor_id = auth.uid());
CREATE POLICY "Anyone can view audit reports" ON audit_reports FOR SELECT TO authenticated USING (true);

-- Onboarding applications: Admins can view all
CREATE POLICY "Admins can view applications" ON onboarding_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create indexes for better performance on location queries
CREATE INDEX idx_profiles_location ON profiles USING GIST (location);
CREATE INDEX idx_businesses_location ON businesses USING GIST (location);
CREATE INDEX idx_onboarding_applications_location ON onboarding_applications USING GIST (location);
