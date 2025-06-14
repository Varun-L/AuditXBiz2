-- Insert sample business categories
INSERT INTO business_categories (category_name, payout_amount, checklist) VALUES
('Restaurant', 20000, '{
  "category_name": "Restaurant",
  "checklist": [
    {
      "question": "Cleanliness rating (1-10)?",
      "type": "rating",
      "min": 1,
      "max": 10
    },
    {
      "question": "Quality of ingredients used?",
      "type": "text_input"
    },
    {
      "question": "Are health and safety certificates visible?",
      "type": "checkbox"
    },
    {
      "question": "Upload photo of kitchen cleanliness.",
      "type": "photo_upload"
    }
  ]
}'),
('Medical Clinic', 30000, '{
  "category_name": "Medical Clinic",
  "checklist": [
    {
      "question": "Hygiene standards rating (1-10)?",
      "type": "rating",
      "min": 1,
      "max": 10
    },
    {
      "question": "Are medical licenses displayed?",
      "type": "checkbox"
    },
    {
      "question": "Describe the waiting area condition",
      "type": "text_input"
    },
    {
      "question": "Upload photo of reception area",
      "type": "photo_upload"
    }
  ]
}'),
('Retail Store', 15000, '{
  "category_name": "Retail Store",
  "checklist": [
    {
      "question": "Store organization rating (1-10)?",
      "type": "rating",
      "min": 1,
      "max": 10
    },
    {
      "question": "Customer service quality?",
      "type": "text_input"
    },
    {
      "question": "Are prices clearly displayed?",
      "type": "checkbox"
    },
    {
      "question": "Upload photo of store front",
      "type": "photo_upload"
    }
  ]
}');

-- Insert sample admin user (password will be handled by Supabase Auth)
INSERT INTO users (email, full_name, role) VALUES
('admin@auditx.com', 'System Administrator', 'admin');

-- Insert sample suppliers
INSERT INTO users (email, full_name, phone_number, physical_address, role) VALUES
('supplier1@auditx.com', 'John Supplier', '+91-9876543210', '123 Supplier Street, Mumbai', 'supplier'),
('supplier2@auditx.com', 'Jane Logistics', '+91-9876543211', '456 Delivery Lane, Delhi', 'supplier');

-- Insert sample auditors
INSERT INTO users (email, full_name, phone_number, physical_address, role) VALUES
('auditor1@auditx.com', 'Mike Auditor', '+91-9876543212', '789 Audit Avenue, Bangalore', 'auditor'),
('auditor2@auditx.com', 'Sarah Inspector', '+91-9876543213', '321 Review Road, Chennai', 'auditor');

-- Insert auditor financial details
INSERT INTO auditor_financial_details (user_id, upi_handle, bank_account_number)
SELECT id, 'auditor@upi', '1234567890123456'
FROM users WHERE role = 'auditor';

-- Insert sample consumers
INSERT INTO users (email, full_name, phone_number, physical_address, role) VALUES
('consumer1@auditx.com', 'Alice Consumer', '+91-9876543214', '654 Consumer Colony, Mumbai', 'consumer'),
('consumer2@auditx.com', 'Bob User', '+91-9876543215', '987 User Nagar, Delhi', 'consumer');
