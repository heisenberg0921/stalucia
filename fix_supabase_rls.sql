-- Fix Row Level Security (RLS) for Audit Log and Security Log
-- Run this in your Supabase SQL Editor to allow all logs to sync properly across devices

-- 1. Enable RLS on both tables (Best Practice)
ALTER TABLE security_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 2. Drop any broken policies that might be blocking access
DROP POLICY IF EXISTS "Enable read access for all users" ON security_log;
DROP POLICY IF EXISTS "Enable insert for all users" ON security_log;
DROP POLICY IF EXISTS "Enable update for all users" ON security_log;
DROP POLICY IF EXISTS "Enable delete for all users" ON security_log;

DROP POLICY IF EXISTS "Enable read access for all users" ON audit_log;
DROP POLICY IF EXISTS "Enable insert for all users" ON audit_log;
DROP POLICY IF EXISTS "Enable update for all users" ON audit_log;
DROP POLICY IF EXISTS "Enable delete for all users" ON audit_log;

-- 3. Create unrestricted policies so the application can read/write logs
CREATE POLICY "Enable read access for all users" ON security_log FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON security_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON security_log FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON security_log FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON audit_log FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON audit_log FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON audit_log FOR DELETE USING (true);

-- Done! Your logs will now instantly sync across all Admin accounts.
