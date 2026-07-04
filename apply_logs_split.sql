-- Drop the old activity log table
DROP TABLE IF EXISTS activity_log CASCADE;

-- Create Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(100),
    entity_id INTEGER,
    action VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create Security Log
CREATE TABLE IF NOT EXISTS security_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    target_username VARCHAR(255),
    event_type VARCHAR(100),
    auth_method VARCHAR(50),
    severity VARCHAR(50),
    ip_address VARCHAR(100),
    device_info TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_log ENABLE ROW LEVEL SECURITY;

-- Audit Log Policies
CREATE POLICY "Enable read access for all users" ON audit_log FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON audit_log FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON audit_log FOR DELETE USING (true);

-- Security Log Policies
CREATE POLICY "Enable read access for all users" ON security_log FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON security_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON security_log FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON security_log FOR DELETE USING (true);
