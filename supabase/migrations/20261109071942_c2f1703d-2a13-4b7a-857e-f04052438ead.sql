CREATE SCHEMA IF NOT EXISTS mcard_booking_private;
REVOKE ALL ON SCHEMA mcard_booking_private FROM PUBLIC;
GRANT USAGE ON SCHEMA mcard_booking_private TO anon,authenticated,service_role;
ALTER FUNCTION public.get_mcard_booking_slots(uuid,date) SET SCHEMA mcard_booking_private;
ALTER FUNCTION public.book_mcard_appointment(uuid,date,time,text,text,text,text,text,text) SET SCHEMA mcard_booking_private;
CREATE FUNCTION public.get_mcard_booking_slots(p_mcard_id uuid,p_date date)
RETURNS TABLE(start_time time,end_time time,is_reserved boolean)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path='' AS $$ SELECT * FROM mcard_booking_private.get_mcard_booking_slots(p_mcard_id,p_date); $$;
REVOKE ALL ON FUNCTION public.get_mcard_booking_slots(uuid,date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_mcard_booking_slots(uuid,date) TO anon,authenticated,service_role;
CREATE FUNCTION public.book_mcard_appointment(p_mcard_id uuid,p_date date,p_time time,p_client_name text,p_client_email text,p_client_phone text DEFAULT NULL,p_subject text DEFAULT NULL,p_message text DEFAULT NULL,p_timezone text DEFAULT 'UTC')
RETURNS uuid LANGUAGE sql SECURITY INVOKER SET search_path='' AS $$ SELECT mcard_booking_private.book_mcard_appointment(p_mcard_id,p_date,p_time,p_client_name,p_client_email,p_client_phone,p_subject,p_message,p_timezone); $$;
REVOKE ALL ON FUNCTION public.book_mcard_appointment(uuid,date,time,text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_mcard_appointment(uuid,date,time,text,text,text,text,text,text) TO anon,authenticated,service_role;