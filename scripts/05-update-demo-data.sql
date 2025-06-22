-- Update demo data script
-- This script ensures all demo data is consistent and up-to-date

-- Update existing demo categories with proper structure
UPDATE business_categories 
SET checklist = jsonb_build_object(
  'questions', jsonb_build_array(
    jsonb_build_object(
      'id', 'q1',
      'text', 'Is the business premises clean and well-maintained?',
      'type', 'rating',
      'required', true
    ),
    jsonb_build_object(
      'id', 'q2', 
      'text', 'Are safety protocols being followed?',
      'type', 'rating',
      'required', true
    ),
    jsonb_build_object(
      'id', 'q3',
      'text', 'Upload photos of the business premises',
      'type', 'photo',
      'required', true
    ),
    jsonb_build_object(
      'id', 'q4',
      'text', 'Additional comments',
      'type', 'text',
      'required', false
    )
  )
)
WHERE checklist IS NULL OR checklist = '{}';

-- Ensure all businesses have proper category relationships
UPDATE businesses 
SET category_id = (
  SELECT id FROM business_categories 
  WHERE name = 'Restaurant' 
  LIMIT 1
)
WHERE category_id IS NULL;

-- Update task statuses to be more realistic
UPDATE supplier_tasks 
SET status = CASE 
  WHEN random() < 0.3 THEN 'completed'
  WHEN random() < 0.6 THEN 'in_progress'
  ELSE 'todo'
END
WHERE status IS NULL;

UPDATE auditor_tasks 
SET status = CASE 
  WHEN random() < 0.4 THEN 'completed'
  WHEN random() < 0.7 THEN 'in_progress'
  ELSE 'not_started'
END
WHERE status IS NULL;

-- Ensure audit reports have proper structure
UPDATE audit_reports 
SET responses = jsonb_build_object(
  'q1', jsonb_build_object('type', 'rating', 'value', floor(random() * 5) + 1),
  'q2', jsonb_build_object('type', 'rating', 'value', floor(random() * 5) + 1),
  'q3', jsonb_build_object('type', 'photo', 'value', jsonb_build_array('/placeholder.svg?height=200&width=300')),
  'q4', jsonb_build_object('type', 'text', 'value', 'Business appears to be operating well with good standards.')
),
photos = jsonb_build_array('/placeholder.svg?height=200&width=300', '/placeholder.svg?height=200&width=200')
WHERE responses IS NULL OR responses = '{}';

-- Add some sample audit reports if none exist
INSERT INTO audit_reports (id, task_id, business_id, auditor_id, responses, photos, overall_rating, submitted_at, created_at, updated_at)
SELECT 
  'report-' || generate_random_uuid(),
  at.id,
  at.business_id,
  at.auditor_id,
  jsonb_build_object(
    'q1', jsonb_build_object('type', 'rating', 'value', floor(random() * 5) + 1),
    'q2', jsonb_build_object('type', 'rating', 'value', floor(random() * 5) + 1),
    'q3', jsonb_build_object('type', 'photo', 'value', jsonb_build_array('/placeholder.svg?height=200&width=300')),
    'q4', jsonb_build_object('type', 'text', 'value', 'Audit completed successfully.')
  ),
  jsonb_build_array('/placeholder.svg?height=200&width=300'),
  floor(random() * 5) + 1,
  NOW() - (random() * interval '30 days'),
  NOW(),
  NOW()
FROM auditor_tasks at
WHERE at.status = 'completed'
AND NOT EXISTS (
  SELECT 1 FROM audit_reports ar WHERE ar.task_id = at.id
)
LIMIT 5;

-- Refresh materialized views if any exist
-- (Add any materialized view refreshes here if needed)

COMMIT;
