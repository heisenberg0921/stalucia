-- ============================================================
-- Barangay Sta. Lucia — Revert ISO/IEC 27001 Database Additions
-- ============================================================

-- 1. Drop the newly added ISO 27001 tables
DROP TABLE IF EXISTS security_incidents CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;

-- 2. Remove the enriched security columns from the activity_log table
ALTER TABLE activity_log DROP COLUMN IF EXISTS severity;
ALTER TABLE activity_log DROP COLUMN IF EXISTS ip_address;
ALTER TABLE activity_log DROP COLUMN IF EXISTS resource_type;
ALTER TABLE activity_log DROP COLUMN IF EXISTS resource_id;

-- 3. Remove the MFA and login tracking columns from the users table
ALTER TABLE users DROP COLUMN IF EXISTS last_login_at;
ALTER TABLE users DROP COLUMN IF EXISTS mfa_enabled;
ALTER TABLE users DROP COLUMN IF EXISTS failed_mfa_count;

-- Note: The core tables (users, equipment, bookings, etc.) remain fully intact.
