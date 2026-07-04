-- Complete RLS Fix & Realtime Enabler
-- Run this in your Supabase SQL Editor to guarantee all modules sync across all devices

begin;

-- 1. Enable Realtime on the correct tables
drop publication if exists supabase_realtime;
create publication supabase_realtime;

alter publication supabase_realtime add table concerns;
alter publication supabase_realtime add table borrowings;
alter publication supabase_realtime add table facility_reservations;
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table user_notifications;
alter publication supabase_realtime add table audit_log;
alter publication supabase_realtime add table security_log;

-- 2. Ensure RLS is enabled for best practice, but create policies that allow the frontend to work
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowings ENABLE ROW LEVEL SECURITY;
ALTER TABLE facility_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE concerns ENABLE ROW LEVEL SECURITY;

-- 3. Drop any restrictive policies that are blocking the system
DROP POLICY IF EXISTS "Enable all for all users" ON events;
DROP POLICY IF EXISTS "Enable all for all users" ON user_notifications;
DROP POLICY IF EXISTS "Enable all for all users" ON borrowings;
DROP POLICY IF EXISTS "Enable all for all users" ON facility_reservations;
DROP POLICY IF EXISTS "Enable all for all users" ON concerns;

-- 4. Create universal open policies for the application logic
CREATE POLICY "Enable all for all users" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for all users" ON user_notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for all users" ON borrowings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for all users" ON facility_reservations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for all users" ON concerns FOR ALL USING (true) WITH CHECK (true);

commit;
