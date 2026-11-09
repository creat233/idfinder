GRANT SELECT ON public.mcard_availability_slots TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.mcard_availability_slots TO authenticated;
GRANT ALL ON public.mcard_availability_slots TO service_role;
CREATE TABLE public.mcard_appointments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 mcard_id uuid NOT NULL REFERENCES public.mcards(id) ON DELETE CASCADE,
 visitor_id uuid,
 appointment_date date NOT NULL,
 start_time time NOT NULL,
 end_time time NOT NULL,
 client_name text NOT NULL,
 client_email text NOT NULL,
 client_phone text,
 subject text,
 message text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(mcard_id, appointment_date, start_time)
);
GRANT SELECT ON public.mcard_appointments TO authenticated;
GRANT ALL ON public.mcard_appointments TO service_role;
ALTER TABLE public.mcard_appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners and registered visitors read their bookings" ON public.mcard_appointments FOR SELECT TO authenticated USING (visitor_id = auth.uid() OR EXISTS (SELECT 1 FROM public.mcards m WHERE m.id=mcard_id AND m.user_id=auth.uid()));
CREATE TRIGGER update_mcard_appointments_updated_at BEFORE UPDATE ON public.mcard_appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE FUNCTION public.get_mcard_booking_slots(p_mcard_id uuid, p_date date)
RETURNS TABLE(start_time time, end_time time, is_reserved boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 WITH configured AS (
 SELECT DISTINCT t::time AS start_time, LEAST(t + interval '1 hour', p_date + s.end_time)::time AS end_time
 FROM public.mcard_availability_slots s
 JOIN public.mcards m ON m.id=s.mcard_id
 CROSS JOIN LATERAL generate_series(p_date+s.start_time, p_date+s.end_time-interval '1 second', interval '1 hour') t
 WHERE s.mcard_id=p_mcard_id AND s.is_active AND s.day_of_week=extract(dow FROM p_date)::integer
 AND m.is_published AND m.subscription_status='active'
 AND (m.subscription_expires_at IS NULL OR m.subscription_expires_at>now())
 AND s.start_time<s.end_time
 )
 SELECT c.start_time, max(c.end_time), EXISTS (
 SELECT 1 FROM public.mcard_appointments a WHERE a.mcard_id=p_mcard_id AND a.appointment_date=p_date
 AND a.start_time < max(c.end_time) AND a.end_time > c.start_time)
 FROM configured c GROUP BY c.start_time ORDER BY c.start_time;
$$;
REVOKE ALL ON FUNCTION public.get_mcard_booking_slots(uuid,date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_mcard_booking_slots(uuid,date) TO anon,authenticated,service_role;
CREATE FUNCTION public.book_mcard_appointment(p_mcard_id uuid, p_date date, p_time time, p_client_name text, p_client_email text, p_client_phone text DEFAULT NULL, p_subject text DEFAULT NULL, p_message text DEFAULT NULL, p_timezone text DEFAULT 'UTC')
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_end time; v_reserved boolean; v_id uuid; v_owner uuid; v_details text;
BEGIN
 IF p_date IS NULL OR p_time IS NULL OR NOT EXISTS(SELECT 1 FROM pg_timezone_names WHERE name=p_timezone) THEN RAISE EXCEPTION 'Date ou fuseau horaire invalide'; END IF;
 IF (p_date+p_time) AT TIME ZONE p_timezone <= now() THEN RAISE EXCEPTION 'Ce créneau est déjà passé'; END IF;
 IF length(trim(coalesce(p_client_name,''))) NOT BETWEEN 1 AND 120 OR length(coalesce(p_client_email,''))>254 OR p_client_email IS NULL OR p_client_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR length(coalesce(p_client_phone,''))>50 OR length(coalesce(p_subject,''))>200 OR length(coalesce(p_message,''))>2000 THEN RAISE EXCEPTION 'Coordonnées invalides'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(p_mcard_id::text || p_date::text,0));
 SELECT s.end_time,s.is_reserved INTO v_end,v_reserved FROM public.get_mcard_booking_slots(p_mcard_id,p_date) s WHERE s.start_time=p_time;
 IF NOT FOUND THEN RAISE EXCEPTION 'Ce créneau n’est pas disponible'; END IF;
 IF v_reserved THEN RAISE EXCEPTION 'Ce créneau est déjà réservé' USING ERRCODE='23505'; END IF;
 SELECT user_id INTO v_owner FROM public.mcards WHERE id=p_mcard_id AND is_published AND subscription_status='active' FOR SHARE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Cette carte n’est pas disponible'; END IF;
 INSERT INTO public.mcard_appointments(mcard_id,visitor_id,appointment_date,start_time,end_time,client_name,client_email,client_phone,subject,message)
 VALUES(p_mcard_id,auth.uid(),p_date,p_time,v_end,trim(p_client_name),trim(p_client_email),p_client_phone,p_subject,p_message) RETURNING id INTO v_id;
 v_details := trim(p_client_name) || ' a réservé le ' || to_char(p_date,'DD/MM/YYYY') || ' à ' || to_char(p_time,'HH24:MI') || E'\nEmail : ' || trim(p_client_email) || E'\nTéléphone : ' || coalesce(p_client_phone,'') || E'\nSujet : ' || coalesce(p_subject,'') || E'\n' || coalesce(p_message,'');
 INSERT INTO public.notifications(user_id,type,title,message) VALUES(v_owner,'new_appointment','Nouveau rendez-vous confirmé',v_details);
 IF auth.uid() IS NOT NULL THEN
 INSERT INTO public.mcard_messages(sender_id,recipient_id,mcard_id,subject,message,is_read) VALUES(auth.uid(),v_owner,p_mcard_id,'Demande de rendez-vous confirmée - ' || to_char(p_date,'DD/MM/YYYY') || ' à ' || to_char(p_time,'HH24:MI'),v_details,false);
 END IF;
 RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.book_mcard_appointment(uuid,date,time,text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_mcard_appointment(uuid,date,time,text,text,text,text,text,text) TO anon,authenticated,service_role;