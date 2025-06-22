-- Insert sample business categories
INSERT INTO business_categories (name, payout_amount, checklist) VALUES
('Restaurant', 20000, '{
  "questions": [
    {
      "id": "cleanliness_rating",
      "question": "Cleanliness rating (1-10)?",
      "type": "rating",
      "min": 1,
      "max": 10,
      "required": true
    },
    {
      "id": "ingredient_quality",
      "question": "Quality of ingredients used?",
      "type": "text_input",
      "required": true
    },
    {
      "id": "health_certificates",
      "question": "Are health and safety certificates visible?",
      "type": "checkbox",
      "required": true
    },
    {
      "id": "kitchen_photo",
      "question": "Upload photo of kitchen cleanliness.",
      "type": "photo_upload",
      "required": true
    }
  ]
}'),
('Medical Clinic', 25000, '{
  "questions": [
    {
      "id": "facility_cleanliness",
      "question": "Overall facility cleanliness (1-10)?",
      "type": "rating",
      "min": 1,
      "max": 10,
      "required": true
    },
    {
      "id": "equipment_condition",
      "question": "Condition of medical equipment?",
      "type": "text_input",
      "required": true
    },
    {
      "id": "staff_hygiene",
      "question": "Staff following proper hygiene protocols?",
      "type": "checkbox",
      "required": true
    },
    {
      "id": "facility_photo",
      "question": "Upload photo of main facility area.",
      "type": "photo_upload",
      "required": true
    }
  ]
}'),
('Retail Store', 15000, '{
  "questions": [
    {
      "id": "store_organization",
      "question": "Store organization and cleanliness (1-10)?",
      "type": "rating",
      "min": 1,
      "max": 10,
      "required": true
    },
    {
      "id": "product_quality",
      "question": "Overall product quality assessment?",
      "type": "text_input",
      "required": true
    },
    {
      "id": "customer_service",
      "question": "Staff provides good customer service?",
      "type": "checkbox",
      "required": true
    },
    {
      "id": "store_photo",
      "question": "Upload photo of store interior.",
      "type": "photo_upload",
      "required": true
    }
  ]
}');
