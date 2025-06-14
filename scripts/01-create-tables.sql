-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'business', 'auditor', 'supplier', 'consumer');
CREATE TYPE task_status AS ENUM ('to_do', 'in_progress', 'package_sent', 'package_delivered', 'completed');
CREATE TYPE audit_status AS ENUM ('not_started', 'on_field', 'in_progress', 'completed');

-- Users table (handles all user types)
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    physical_address TEXT,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User documents table
CREATE TABLE user_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    aadhaar_card_url TEXT,
    pan_card_url TEXT,
    driving_license_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auditor financial details
CREATE TABLE auditor_financial_details (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    upi_handle VARCHAR(255),
    bank_account_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business categories with JSON-driven checklists
CREATE TABLE business_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_name VARCHAR(255) UNIQUE NOT NULL,
    payout_amount INTEGER NOT NULL, -- in paise/cents
    checklist JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Businesses
CREATE TABLE businesses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    category_id UUID REFERENCES business_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplier tasks
CREATE TABLE supplier_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES users(id),
    business_id UUID REFERENCES businesses(id),
    status task_status DEFAULT 'to_do',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auditor tasks
CREATE TABLE auditor_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditor_id UUID REFERENCES users(id),
    business_id UUID REFERENCES businesses(id),
    status audit_status DEFAULT 'not_started',
    payout_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit reports
CREATE TABLE audit_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auditor_task_id UUID REFERENCES auditor_tasks(id),
    auditor_id UUID REFERENCES users(id),
    business_id UUID REFERENCES businesses(id),
    responses JSONB NOT NULL,
    photos TEXT[], -- Array of photo URLs
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_supplier_tasks_supplier ON supplier_tasks(supplier_id);
CREATE INDEX idx_auditor_tasks_auditor ON auditor_tasks(auditor_id);
CREATE INDEX idx_audit_reports_auditor ON audit_reports(auditor_id);
