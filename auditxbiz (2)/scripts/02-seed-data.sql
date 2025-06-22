-- Insert sample categories with checklist templates
INSERT INTO categories (name, description, checklist_template, payout_amount) VALUES
('Restaurant', 'Food service establishments', '[
    {"question": "Rate overall cleanliness", "type": "rating", "scale": 10, "required": true},
    {"question": "Upload kitchen photo", "type": "photo", "required": true},
    {"question": "Is food license displayed?", "type": "yes_no", "required": true},
    {"question": "Rate food quality", "type": "rating", "scale": 10, "required": true},
    {"question": "Upload dining area photo", "type": "photo", "required": false},
    {"question": "Additional comments", "type": "text", "required": false}
]', 500.00),

('Retail Store', 'General merchandise stores', '[
    {"question": "Rate store organization", "type": "rating", "scale": 10, "required": true},
    {"question": "Upload storefront photo", "type": "photo", "required": true},
    {"question": "Is business license visible?", "type": "yes_no", "required": true},
    {"question": "Rate customer service", "type": "rating", "scale": 10, "required": true},
    {"question": "Upload interior photo", "type": "photo", "required": false},
    {"question": "Product variety assessment", "type": "text", "required": false}
]', 400.00),

('Service Center', 'Service-based businesses', '[
    {"question": "Rate facility cleanliness", "type": "rating", "scale": 10, "required": true},
    {"question": "Upload facility photo", "type": "photo", "required": true},
    {"question": "Are certifications displayed?", "type": "yes_no", "required": true},
    {"question": "Rate staff professionalism", "type": "rating", "scale": 10, "required": true},
    {"question": "Equipment condition assessment", "type": "text", "required": false}
]', 450.00);

-- Insert sample admin user
INSERT INTO users (email, role, full_name, phone, is_active) VALUES
('admin@auditxbiz.com', 'admin', 'System Administrator', '+91-9999999999', true);

-- Insert sample auditors with locations (Mumbai area)
INSERT INTO users (email, role, full_name, phone, location, address, aadhaar_number, upi_id, is_active) VALUES
('auditor1@example.com', 'auditor', 'Rajesh Kumar', '+91-9876543210', 
 ST_MakePoint(72.8777, 19.0760), 'Andheri West, Mumbai', '123456789012', 'rajesh@paytm', true),
('auditor2@example.com', 'auditor', 'Priya Sharma', '+91-9876543211', 
 ST_MakePoint(72.8258, 18.9750), 'Dadar, Mumbai', '123456789013', 'priya@gpay', true),
('auditor3@example.com', 'auditor', 'Amit Patel', '+91-9876543212', 
 ST_MakePoint(72.8347, 18.9388), 'Lower Parel, Mumbai', '123456789014', 'amit@phonepe', true);

-- Insert sample suppliers with locations
INSERT INTO users (email, role, full_name, phone, location, address, aadhaar_number, upi_id, is_active) VALUES
('supplier1@example.com', 'supplier', 'Logistics Pro', '+91-9876543220', 
 ST_MakePoint(72.8777, 19.0760), 'Andheri Warehouse, Mumbai', '123456789022', 'logistics@paytm', true),
('supplier2@example.com', 'supplier', 'Quick Delivery', '+91-9876543221', 
 ST_MakePoint(72.8258, 18.9750), 'Dadar Hub, Mumbai', '123456789023', 'quick@gpay', true);
