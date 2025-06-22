-- Function to update location from lat/lng
CREATE OR REPLACE FUNCTION update_location_from_coordinates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_MakePoint(NEW.longitude, NEW.latitude)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update location when lat/lng changes
CREATE TRIGGER update_profiles_location
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_location_from_coordinates();

CREATE TRIGGER update_businesses_location
  BEFORE INSERT OR UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_location_from_coordinates();

CREATE TRIGGER update_onboarding_location
  BEFORE INSERT OR UPDATE ON onboarding_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_location_from_coordinates();

-- Function to find nearest auditor for a business
CREATE OR REPLACE FUNCTION find_nearest_auditor(business_lat DECIMAL, business_lng DECIMAL)
RETURNS UUID AS $$
DECLARE
  nearest_auditor_id UUID;
BEGIN
  SELECT id INTO nearest_auditor_id
  FROM profiles
  WHERE role = 'auditor' 
    AND is_approved = true
    AND location IS NOT NULL
  ORDER BY location <-> ST_MakePoint(business_lng, business_lat)::geography
  LIMIT 1;
  
  RETURN nearest_auditor_id;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearest supplier for a business
CREATE OR REPLACE FUNCTION find_nearest_supplier(business_lat DECIMAL, business_lng DECIMAL)
RETURNS UUID AS $$
DECLARE
  nearest_supplier_id UUID;
BEGIN
  SELECT id INTO nearest_supplier_id
  FROM profiles
  WHERE role = 'supplier' 
    AND is_approved = true
    AND location IS NOT NULL
  ORDER BY location <-> ST_MakePoint(business_lng, business_lat)::geography
  LIMIT 1;
  
  RETURN nearest_supplier_id;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create tasks when a business is added
CREATE OR REPLACE FUNCTION create_business_tasks()
RETURNS TRIGGER AS $$
DECLARE
  nearest_supplier_id UUID;
  nearest_auditor_id UUID;
  category_payout INTEGER;
  supplier_distance DECIMAL;
  auditor_distance DECIMAL;
BEGIN
  -- Get the payout amount for this category
  SELECT payout_amount INTO category_payout
  FROM business_categories
  WHERE id = NEW.category_id;
  
  -- Find nearest supplier
  SELECT id INTO nearest_supplier_id
  FROM profiles
  WHERE role = 'supplier' 
    AND is_approved = true
    AND location IS NOT NULL
  ORDER BY location <-> NEW.location
  LIMIT 1;
  
  -- Find nearest auditor
  SELECT id INTO nearest_auditor_id
  FROM profiles
  WHERE role = 'auditor' 
    AND is_approved = true
    AND location IS NOT NULL
  ORDER BY location <-> NEW.location
  LIMIT 1;
  
  -- Create supplier task if supplier exists
  IF nearest_supplier_id IS NOT NULL THEN
    -- Calculate distance
    SELECT ST_Distance(location, NEW.location) / 1000 INTO supplier_distance
    FROM profiles
    WHERE id = nearest_supplier_id;
    
    INSERT INTO supplier_tasks (supplier_id, business_id, distance_km)
    VALUES (nearest_supplier_id, NEW.id, supplier_distance);
  END IF;
  
  -- Create auditor task if auditor exists
  IF nearest_auditor_id IS NOT NULL THEN
    -- Calculate distance
    SELECT ST_Distance(location, NEW.location) / 1000 INTO auditor_distance
    FROM profiles
    WHERE id = nearest_auditor_id;
    
    INSERT INTO auditor_tasks (auditor_id, business_id, category_id, payout_amount, distance_km)
    VALUES (nearest_auditor_id, NEW.id, NEW.category_id, category_payout, auditor_distance);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER create_business_tasks_trigger
  AFTER INSERT ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION create_business_tasks();

-- Function to update audit task status when report is submitted
CREATE OR REPLACE FUNCTION update_audit_task_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auditor_tasks 
  SET status = 'completed', updated_at = NOW()
  WHERE id = NEW.auditor_task_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for audit report submission
CREATE TRIGGER update_audit_task_status_trigger
  AFTER INSERT ON audit_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_audit_task_status();

-- Function to get nearby businesses for a user
CREATE OR REPLACE FUNCTION get_nearby_businesses(user_lat DECIMAL, user_lng DECIMAL, radius_km INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category_name TEXT,
  address TEXT,
  distance_km DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.name,
    bc.name as category_name,
    b.address,
    (ST_Distance(b.location, ST_MakePoint(user_lng, user_lat)::geography) / 1000)::DECIMAL(8,2) as distance_km
  FROM businesses b
  JOIN business_categories bc ON b.category_id = bc.id
  WHERE ST_DWithin(b.location, ST_MakePoint(user_lng, user_lat)::geography, radius_km * 1000)
  ORDER BY b.location <-> ST_MakePoint(user_lng, user_lat)::geography;
END;
$$ LANGUAGE plpgsql;
