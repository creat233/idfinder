import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { BookingSlot, canBookSlot, localDateValue } from './bookingSlots';

interface AvailabilitySelectorProps {
  mcardId: string;
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  refreshKey?: number;
}

export const AvailabilitySelector = ({ mcardId, selectedDate, selectedTime, onDateChange, onTimeChange, refreshKey = 0 }: AvailabilitySelectorProps) => {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setSlots([]);
    setError('');
    if (!selectedDate) return;
    setLoading(true);
    supabase.rpc('get_mcard_booking_slots', { p_mcard_id: mcardId, p_date: selectedDate }).then(({ data, error: queryError }) => {
      if (!active) return;
      if (queryError) setError('Impossible de charger les créneaux. Vérifiez votre connexion.');
      else setSlots(data ?? []);
      setLoading(false);
    });
    return () => { active = false; };
  }, [mcardId, selectedDate, refreshKey, retry]);

  useEffect(() => {
    if (!loading && selectedTime && !slots.some(slot => slot.start_time.slice(0, 5) === selectedTime && canBookSlot(selectedDate, slot))) onTimeChange('');
  }, [slots, selectedTime, selectedDate, loading, onTimeChange]);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const freeCount = slots.filter(slot => canBookSlot(selectedDate, slot)).length;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="appointment-date">Date souhaitée</Label>
          <Input id="appointment-date" type="date" min={localDateValue()} max={localDateValue(maxDate)} value={selectedDate} onChange={event => { onTimeChange(''); onDateChange(event.target.value); }} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="appointment-time">Créneau disponible</Label>
          <Select value={selectedTime} onValueChange={onTimeChange} disabled={!selectedDate || loading || !!error || !freeCount}>
            <SelectTrigger id="appointment-time"><SelectValue placeholder={loading ? 'Chargement…' : 'Choisir un créneau'} /></SelectTrigger>
            <SelectContent>
              {slots.map(slot => <SelectItem key={slot.start_time} value={slot.start_time.slice(0, 5)} disabled={!canBookSlot(selectedDate, slot)}>
                {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)}{slot.is_reserved ? ' · Réservé' : !canBookSlot(selectedDate, slot) ? ' · Passé' : ''}
              </SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div aria-live="polite" className="text-sm text-muted-foreground">
        {error ? <><p role="alert">{error}</p><Button variant="outline" size="sm" onClick={() => setRetry(value => value + 1)}>Réessayer</Button></> : selectedDate && !loading ? (freeCount ? `${freeCount} créneau(x) disponible(s). Les créneaux réservés ne peuvent pas être choisis.` : 'Aucun créneau disponible pour cette date. Choisissez un autre jour.') : 'Choisissez une date pour voir les disponibilités.'}
      </div>
    </div>
  );
};
