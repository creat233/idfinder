import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Clock } from 'lucide-react';
import { useMCardAvailability } from '@/hooks/useMCardAvailability';

interface AvailabilitySelectorProps {
  mcardId: string;
  selectedDate: string;
  selectedTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  mcardId,
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange
}) => {
  const { slots, DAYS_OF_WEEK } = useMCardAvailability(mcardId);
  const [availableSlots, setAvailableSlots] = useState<Array<{value: string, label: string}>>([]);

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Générer les créneaux disponibles en fonction de la date sélectionnée
  useEffect(() => {
    if (!selectedDate || slots.length === 0) {
      // Créneaux par défaut si aucune configuration
      const defaultSlots = [
        { value: '09:00', label: '09:00' },
        { value: '10:00', label: '10:00' },
        { value: '11:00', label: '11:00' },
        { value: '14:00', label: '14:00' },
        { value: '15:00', label: '15:00' },
        { value: '16:00', label: '16:00' }
      ];
      setAvailableSlots(defaultSlots);
      return;
    }

    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj.getDay();
    
    // Filtrer les créneaux pour le jour sélectionné
    const daySlots = slots.filter(slot => 
      slot.day_of_week === dayOfWeek && slot.is_active
    );

    if (daySlots.length === 0) {
      setAvailableSlots([]);
      return;
    }

    // Générer les créneaux d'une heure entre start_time et end_time
    const timeSlots: Array<{value: string, label: string}> = [];
    
    daySlots.forEach(slot => {
      const [startHour, startMin] = slot.start_time.split(':').map(Number);
      const [endHour, endMin] = slot.end_time.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        
        if (!timeSlots.find(t => t.value === timeStr)) {
          timeSlots.push({
            value: timeStr,
            label: timeStr
          });
        }
        
        // Incrémenter d'une heure
        currentHour += 1;
        if (currentHour >= 24) break;
      }
    });
    
    setAvailableSlots(timeSlots.sort((a, b) => a.value.localeCompare(b.value)));
  }, [selectedDate, slots]);

  // Reset selectedTime si plus disponible
  useEffect(() => {
    if (selectedTime && !availableSlots.find(slot => slot.value === selectedTime)) {
      onTimeChange('');
    }
  }, [availableSlots, selectedTime, onTimeChange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date souhaitée</Label>
          <input
            id="date"
            type="date"
            min={getMinDate()}
            max={getMaxDate()}
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Heure préférée</Label>
          <Select value={selectedTime} onValueChange={onTimeChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner l'heure" />
            </SelectTrigger>
            <SelectContent>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {slot.label}
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Aucun créneau disponible ce jour
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedDate && (
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          <CalendarClock className="h-4 w-4 text-blue-600" />
          <span className="text-sm">
            {availableSlots.length > 0 ? (
              <>Créneaux disponibles le {DAYS_OF_WEEK[new Date(selectedDate).getDay()]} : {availableSlots.length} créneaux</>
            ) : (
              <>Aucun créneau configuré pour le {DAYS_OF_WEEK[new Date(selectedDate).getDay()]}</>
            )}
          </span>
          {availableSlots.length === 0 && (
            <Badge variant="secondary">Jour non disponible</Badge>
          )}
        </div>
      )}
    </div>
  );
};