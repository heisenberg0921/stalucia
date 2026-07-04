-- Enable Realtime for all interactive tables
-- Run this in your Supabase SQL Editor to allow instant UI updates without refreshing

begin;

-- Remove the supabase_realtime publication if it already exists to avoid errors
drop publication if exists supabase_realtime;

-- Create the publication
create publication supabase_realtime;

-- Add the relevant tables to the publication
alter publication supabase_realtime add table concerns;
alter publication supabase_realtime add table borrowings;
alter publication supabase_realtime add table facility_reservations;
alter publication supabase_realtime add table events;
alter publication supabase_realtime add table user_notifications;
alter publication supabase_realtime add table audit_log;
alter publication supabase_realtime add table security_log;
alter publication supabase_realtime add table users;

commit;
