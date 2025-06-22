-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'auditor', 'supplier', 'business', 'consumer');
CREATE TYPE task_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE delivery_status AS ENUM ('to_do', 'in_progress', 'shipped', 'delivered');

-- Users table with role-based access
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location GEOGRAPHY(Point, 4326),
    address TEXT,
    aadhaar_number VARCHAR(12),
    driving_license VARCHAR(50),
    upi_id VARCHAR(100),
    bank_account VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business categories
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    checklist_template JSONB NOT NULL,
    payout_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses table
CREATE TABLE businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(20),
    owner_email VARCHAR(255),
    location GEOGRAPHY(Point, 4326) NOT NULL,
    address TEXT NOT NULL,
    license_number VARCHAR(100),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit tasks
CREATE TABLE audit_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) NOT NULL,
    auditor_id UUID REFERENCES users(id),
    category_id UUID REFERENCES categories(id) NOT NULL,
    status task_status DEFAULT 'pending',
    checklist_responses JSONB,
    photos TEXT[], -- Array of photo URLs
    payout_amount DECIMAL(10,2),
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery tasks
CREATE TABLE delivery_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) NOT NULL,
    supplier_id UUID REFERENCES users(id),
    status delivery_status DEFAULT 'to_do',
    tracking_number VARCHAR(100),
    assigned_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payouts tracking
CREATE TABLE payouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    task_id UUID, -- Can reference audit_tasks or delivery_tasks
    task_type VARCHAR(20) NOT NULL, -- 'audit' or 'delivery'
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users USING GIST(location);
CREATE INDEX idx_businesses_location ON businesses USING GIST(location);
CREATE INDEX idx_audit_tasks_status ON audit_tasks(status);
CREATE INDEX idx_delivery_tasks_status ON delivery_tasks(status);

-- Row Level Security policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for businesses table
CREATE POLICY "Anyone can view businesses" ON businesses
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage businesses" ON businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policies for audit_tasks table
CREATE POLICY "Auditors can view assigned tasks" ON audit_tasks
    FOR SELECT USING (
        auditor_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Auditors can update assigned tasks" ON audit_tasks
    FOR UPDATE USING (auditor_id = auth.uid());

-- Function to find nearest auditor
CREATE OR REPLACE FUNCTION find_nearest_auditor(business_location GEOGRAPHY)
RETURNS UUID AS $$
DECLARE
    nearest_auditor_id UUID;
BEGIN
    SELECT u.id INTO nearest_auditor_id
    FROM users u
    WHERE u.role = 'auditor' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    ORDER BY business_location <-> u.location
    LIMIT 1;
    
    RETURN nearest_auditor_id;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearest supplier
CREATE OR REPLACE FUNCTION find_nearest_supplier(business_location GEOGRAPHY)
RETURNS UUID AS $$
DECLARE
    nearest_supplier_id UUID;
BEGIN
    SELECT u.id INTO nearest_supplier_id
    FROM users u
    WHERE u.role = 'supplier' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    ORDER BY business_location <-> u.location
    LIMIT 1;
    
    RETURN nearest_supplier_id;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign tasks when business is created
CREATE OR REPLACE FUNCTION auto_assign_tasks()
RETURNS TRIGGER AS $$
DECLARE
    nearest_auditor UUID;
    nearest_supplier UUID;
BEGIN
    -- Find nearest auditor and supplier
    SELECT find_nearest_auditor(NEW.location) INTO nearest_auditor;
    SELECT find_nearest_supplier(NEW.location) INTO nearest_supplier;
    
    -- Create audit task
    INSERT INTO audit_tasks (business_id, auditor_id, category_id, status, assigned_at)
    VALUES (NEW.id, nearest_auditor, NEW.category_id, 'assigned', NOW());
    
    -- Create delivery task
    INSERT INTO delivery_tasks (business_id, supplier_id, status, assigned_at)
    VALUES (NEW.id, nearest_supplier, 'to_do', NOW());
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-assign tasks
CREATE TRIGGER trigger_auto_assign_tasks
    AFTER INSERT ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION auto_assign_tasks();

-- Add new tables and columns for enhanced admin features

-- Add product catalog for Vipanas
CREATE TABLE product_catalogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(100),
    images TEXT[], -- Array of image URLs
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add reviews and feedback system
CREATE TABLE reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) NOT NULL,
    consumer_id UUID REFERENCES users(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_flagged BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT true,
    device_fingerprint VARCHAR(255),
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add fraud detection logs
CREATE TABLE fraud_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type VARCHAR(50) NOT NULL, -- 'duplicate_review', 'fast_audit', 'gps_mismatch'
    entity_type VARCHAR(20) NOT NULL, -- 'audit', 'review', 'user'
    entity_id UUID NOT NULL,
    description TEXT,
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'investigating', 'resolved', 'dismissed'
    investigated_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Add system configuration table
CREATE TABLE system_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add audit override logs
CREATE TABLE audit_overrides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    audit_task_id UUID REFERENCES audit_tasks(id) NOT NULL,
    original_score DECIMAL(5,2),
    new_score DECIMAL(5,2),
    reason TEXT NOT NULL,
    overridden_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add supplier performance tracking
CREATE TABLE supplier_performance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES users(id) NOT NULL,
    delivery_task_id UUID REFERENCES delivery_tasks(id) NOT NULL,
    on_time_delivery BOOLEAN DEFAULT true,
    delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add analytics tracking
CREATE TABLE analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(20),
    entity_id UUID,
    user_id UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update businesses table with certification status
ALTER TABLE businesses ADD COLUMN certification_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE businesses ADD COLUMN certification_score DECIMAL(5,2);
ALTER TABLE businesses ADD COLUMN can_list_products BOOLEAN DEFAULT false;
ALTER TABLE businesses ADD COLUMN rejection_reason TEXT;

-- Update audit_tasks with GPS tracking and timing
ALTER TABLE audit_tasks ADD COLUMN start_location GEOGRAPHY(Point, 4326);
ALTER TABLE audit_tasks ADD COLUMN end_location GEOGRAPHY(Point, 4326);
ALTER TABLE audit_tasks ADD COLUMN audit_duration_minutes INTEGER;
ALTER TABLE audit_tasks ADD COLUMN final_score DECIMAL(5,2);

-- Update users table with performance metrics
ALTER TABLE users ADD COLUMN completion_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN rejection_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN is_frozen BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN freeze_reason TEXT;

-- Insert default system configurations
INSERT INTO system_config (config_key, config_value, description) VALUES
('business_labels', '{"vipana": "Vipana", "samikshak": "Samikshak", "ariya": "Ariya"}', 'Customizable labels for different user types'),
('scoring_thresholds', '{"certification_threshold": 70, "weights": {"cleanliness": 30, "service": 25, "compliance": 45}}', 'Scoring configuration for certifications'),
('fraud_detection', '{"max_audits_per_hour": 3, "min_audit_duration": 15, "max_gps_deviation": 100}', 'Fraud detection parameters'),
('auto_payment_threshold', '{"supplier": 10000, "auditor": 5000}', 'Auto payment thresholds in rupees');

-- Create indexes for performance
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_consumer_id ON reviews(consumer_id);
CREATE INDEX idx_fraud_alerts_status ON fraud_alerts(status);
CREATE INDEX idx_fraud_alerts_created_at ON fraud_alerts(created_at);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_product_catalogs_business_id ON product_catalogs(business_id);

-- Add the enhanced geolocation functions and triggers at the end of the file

-- Enhanced function to find nearest auditor with distance calculation
CREATE OR REPLACE FUNCTION find_nearest_auditor_with_distance(business_location GEOGRAPHY)
RETURNS TABLE(auditor_id UUID, distance_meters NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        ST_Distance(business_location, u.location) as distance
    FROM users u
    WHERE u.role = 'auditor' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    AND u.is_frozen = false
    ORDER BY business_location <-> u.location
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Enhanced function to find nearest supplier with distance calculation
CREATE OR REPLACE FUNCTION find_nearest_supplier_with_distance(business_location GEOGRAPHY)
RETURNS TABLE(supplier_id UUID, distance_meters NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        ST_Distance(business_location, u.location) as distance
    FROM users u
    WHERE u.role = 'supplier' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    AND u.is_frozen = false
    ORDER BY business_location <-> u.location
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to get auditors within radius
CREATE OR REPLACE FUNCTION get_auditors_within_radius(
    business_location GEOGRAPHY,
    radius_meters NUMERIC DEFAULT 10000
)
RETURNS TABLE(
    auditor_id UUID,
    auditor_name VARCHAR,
    distance_meters NUMERIC,
    completion_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.full_name,
        ST_Distance(business_location, u.location) as distance,
        u.completion_rate
    FROM users u
    WHERE u.role = 'auditor' 
    AND u.is_active = true
    AND u.location IS NOT NULL
    AND u.is_frozen = false
    AND ST_DWithin(business_location, u.location, radius_meters)
    ORDER BY business_location <-> u.location;
END;
$$ LANGUAGE plpgsql;

-- Enhanced auto-assignment function with distance logging
CREATE OR REPLACE FUNCTION auto_assign_tasks_with_distance()
RETURNS TRIGGER AS $$
DECLARE
    nearest_auditor_record RECORD;
    nearest_supplier_record RECORD;
    audit_task_id UUID;
    delivery_task_id UUID;
BEGIN
    -- Find nearest auditor with distance
    SELECT * INTO nearest_auditor_record 
    FROM find_nearest_auditor_with_distance(NEW.location);
    
    -- Find nearest supplier with distance
    SELECT * INTO nearest_supplier_record 
    FROM find_nearest_supplier_with_distance(NEW.location);
    
    -- Create audit task with distance logging
    INSERT INTO audit_tasks (
        business_id, 
        auditor_id, 
        category_id, 
        status, 
        assigned_at,
        assignment_distance_meters
    )
    VALUES (
        NEW.id, 
        nearest_auditor_record.auditor_id, 
        NEW.category_id, 
        'assigned', 
        NOW(),
        nearest_auditor_record.distance_meters
    )
    RETURNING id INTO audit_task_id;
    
    -- Create delivery task with distance logging
    INSERT INTO delivery_tasks (
        business_id, 
        supplier_id, 
        status, 
        assigned_at,
        assignment_distance_meters
    )
    VALUES (
        NEW.id, 
        nearest_supplier_record.supplier_id, 
        'to_do', 
        NOW(),
        nearest_supplier_record.distance_meters
    )
    RETURNING id INTO delivery_task_id;
    
    -- Log the assignment event
    INSERT INTO analytics_events (
        event_type,
        entity_type,
        entity_id,
        metadata
    ) VALUES (
        'auto_assignment',
        'business',
        NEW.id,
        jsonb_build_object(
            'audit_task_id', audit_task_id,
            'delivery_task_id', delivery_task_id,
            'auditor_distance_meters', nearest_auditor_record.distance_meters,
            'supplier_distance_meters', nearest_supplier_record.distance_meters
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add distance tracking columns
ALTER TABLE audit_tasks ADD COLUMN IF NOT EXISTS assignment_distance_meters NUMERIC;
ALTER TABLE delivery_tasks ADD COLUMN IF NOT EXISTS assignment_distance_meters NUMERIC;

-- Add geospatial indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_location_gist ON users USING GIST(location) WHERE location IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_businesses_location_gist ON businesses USING GIST(location) WHERE location IS NOT NULL;
