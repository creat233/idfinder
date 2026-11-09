-- Exercise the real booking functions without leaving test bookings or notifications.
DO $$
DECLARE
  v_card uuid;
  v_date date := current_date + 7;
  v_booking uuid;
BEGIN
  BEGIN
    SELECT id INTO v_card FROM public.mcards LIMIT 1;
    IF v_card IS NULL THEN RAISE EXCEPTION 'Booking test requires an existing MCard'; END IF;
    UPDATE public.mcards SET is_published=true, subscription_status='active', subscription_expires_at=now()+interval '1 year' WHERE id=v_card;
    UPDATE public.mcard_availability_slots SET is_active=false WHERE mcard_id=v_card;
    INSERT INTO public.mcard_availability_slots(mcard_id,day_of_week,start_time,end_time,is_active)
    VALUES(v_card,extract(dow FROM v_date)::integer,'09:00','11:00',true);
    IF (SELECT count(*) FROM public.get_mcard_booking_slots(v_card,v_date)) <> 2 THEN
      RAISE EXCEPTION 'Expected exactly two configured hourly slots';
    END IF;
    v_booking := public.book_mcard_appointment(v_card,v_date,'09:00','Reservation test','booking-test@example.invalid');
    IF NOT EXISTS(SELECT 1 FROM public.mcard_appointments WHERE id=v_booking) THEN
      RAISE EXCEPTION 'Reservation was not persisted';
    END IF;
    IF NOT EXISTS(SELECT 1 FROM public.get_mcard_booking_slots(v_card,v_date) WHERE start_time='09:00' AND is_reserved) THEN
      RAISE EXCEPTION 'Reserved slot must be blocked';
    END IF;
    BEGIN
      PERFORM public.book_mcard_appointment(v_card,v_date,'09:00','Duplicate test','booking-test@example.invalid');
      RAISE EXCEPTION 'Duplicate booking unexpectedly succeeded';
    EXCEPTION WHEN unique_violation THEN NULL;
    END;
    BEGIN
      PERFORM public.book_mcard_appointment(v_card,v_date,'15:00','Invalid slot test','booking-test@example.invalid');
      RAISE EXCEPTION 'Unconfigured slot unexpectedly succeeded';
    EXCEPTION WHEN raise_exception THEN
      IF SQLERRM <> 'Ce créneau n’est pas disponible' THEN RAISE; END IF;
    END;
    RAISE EXCEPTION USING ERRCODE='ZX001', MESSAGE='Rollback successful reservation test';
  EXCEPTION WHEN SQLSTATE 'ZX001' THEN
    RAISE NOTICE 'PASS: configured slots, persistence, reserved-slot visibility, duplicate rejection, unconfigured-slot rejection; all test data rolled back';
  END;
END;
$$;