-- Admin setup script
-- This script ensures admin functionality is properly configured

-- Create admin user if not exists (for demo purposes)
INSERT INTO profiles (id, role, full_name, email, phone_number, city, pin_code, created_at, updated_at)
VALUES (
  'admin-demo-user-id',
  'admin',
  'System Administrator',
  'admin@auditpro.com',
  '+91-9876543210',
  'Mumbai',
  '400001',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Ensure RLS policies allow admin access
-- Admin can read all profiles
CREATE POLICY IF NOT EXISTS "Admin can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can read all businesses
CREATE POLICY IF NOT EXISTS "Admin can read all businesses" ON businesses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can read all business categories
CREATE POLICY IF NOT EXISTS "Admin can read all categories" ON business_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can insert new categories
CREATE POLICY IF NOT EXISTS "Admin can insert categories" ON business_categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can insert new businesses
CREATE POLICY IF NOT EXISTS "Admin can insert businesses" ON businesses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can read all tasks
CREATE POLICY IF NOT EXISTS "Admin can read supplier tasks" ON supplier_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admin can read auditor tasks" ON auditor_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admin can read all audit reports
CREATE POLICY IF NOT EXISTS "Admin can read audit reports" ON audit_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_supplier_tasks_status ON supplier_tasks(status);
CREATE INDEX IF NOT EXISTS idx_auditor_tasks_status ON auditor_tasks(status);
CREATE INDEX IF NOT EXISTS idx_audit_reports_submitted ON audit_reports(submitted_at);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON businesses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON business_categories TO authenticated;
GRANT SELECT ON supplier_tasks TO authenticated;
GRANT SELECT ON auditor_tasks TO authenticated;
GRANT SELECT ON audit_reports TO authenticated;
