-- Business onboarding requests table
CREATE TABLE business_onboarding_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    category_id UUID REFERENCES business_categories(id),
    contact_person VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auditor onboarding requests table
CREATE TABLE auditor_onboarding_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    physical_address TEXT NOT NULL,
    experience_years VARCHAR(10) NOT NULL,
    specializations TEXT,
    upi_handle VARCHAR(255) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    aadhaar_number VARCHAR(20) NOT NULL,
    pan_number VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'auditor',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Supplier onboarding requests table
CREATE TABLE supplier_onboarding_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    physical_address TEXT NOT NULL,
    service_areas TEXT NOT NULL,
    vehicle_type VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    experience_years VARCHAR(10) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    aadhaar_number VARCHAR(20) NOT NULL,
    pan_number VARCHAR(20) NOT NULL,
    role VARCHAR(20) DEFAULT 'supplier',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_business_onboarding_status ON business_onboarding_requests(status);
CREATE INDEX idx_auditor_onboarding_status ON auditor_onboarding_requests(status);
CREATE INDEX idx_supplier_onboarding_status ON supplier_onboarding_requests(status);
