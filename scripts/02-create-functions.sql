-- Function to automatically create tasks when a business is onboarded
CREATE OR REPLACE FUNCTION create_tasks_for_new_business()
RETURNS TRIGGER AS $$
DECLARE
    supplier_user_id UUID;
    auditor_user_id UUID;
    category_payout INTEGER;
BEGIN
    -- Get a random supplier
    SELECT id INTO supplier_user_id 
    FROM users 
    WHERE role = 'supplier' 
    ORDER BY RANDOM() 
    LIMIT 1;
    
    -- Get a random auditor (in real implementation, this would be based on location)
    SELECT id INTO auditor_user_id 
    FROM users 
    WHERE role = 'auditor' 
    ORDER BY RANDOM() 
    LIMIT 1;
    
    -- Get the payout amount for this business category
    SELECT payout_amount INTO category_payout
    FROM business_categories
    WHERE id = NEW.category_id;
    
    -- Create supplier task if supplier exists
    IF supplier_user_id IS NOT NULL THEN
        INSERT INTO supplier_tasks (supplier_id, business_id)
        VALUES (supplier_user_id, NEW.id);
    END IF;
    
    -- Create auditor task if auditor exists
    IF auditor_user_id IS NOT NULL THEN
        INSERT INTO auditor_tasks (auditor_id, business_id, payout_amount)
        VALUES (auditor_user_id, NEW.id, COALESCE(category_payout, 0));
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic task creation
CREATE TRIGGER trigger_create_tasks_for_new_business
    AFTER INSERT ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION create_tasks_for_new_business();

-- Function to update auditor task status when audit report is submitted
CREATE OR REPLACE FUNCTION update_task_status_on_audit_submission()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE auditor_tasks 
    SET status = 'completed', updated_at = NOW()
    WHERE id = NEW.auditor_task_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating task status
CREATE TRIGGER trigger_update_task_status_on_audit_submission
    AFTER INSERT ON audit_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_task_status_on_audit_submission();
