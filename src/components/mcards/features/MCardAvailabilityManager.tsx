import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, Plus, Trash2, Clock } from 'lucide-react';
import { useMCardAvailability, AvailabilitySlot } from '@/hooks/useMCardAvailability';

interface MCardAvailabilityManagerProps {
  mcardId: string;
  isOwner: boolean;
}

export const MCardAvailabilityManager: React.FC<MCardAvailabilityManagerProps> = ({ 
  mcardId, 
  isOwner 
}) => {
  const { slots, loading, saveSlot, deleteSlot, DAYS_OF_WEEK } = useMCardAvailability(mcardId);
  const [isOpen, setIsOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleSaveSlot = async (slotData: AvailabilitySlot) => {
    await saveSlot(slotData);
    setEditingSlot(null);
  };

  const handleDeleteSlot = async (slotId: string) => {
    await deleteSlot(slotId);
  };

  // Grouper les créneaux par jour
  const slotsByDay = slots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, AvailabilitySlot[]>);

  if (!isOwner && slots.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-blue-600" />
            Horaires de disponibilité
          </div>
          <div className="flex items-center gap-2">
            {slots.length > 0 && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? 'Masquer' : 'Afficher'}
              </Button>
            )}
            {isOwner && (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-4">
                    <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Ajouter</span>
                    <span className="sm:hidden">+</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gestion des créneaux horaires</DialogTitle>
                  </DialogHeader>
                  <SlotForm 
                    mcardId={mcardId}
                    slot={editingSlot}
                    onSave={handleSaveSlot}
                    onCancel={() => setEditingSlot(null)}
                    DAYS_OF_WEEK={DAYS_OF_WEEK}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      {isVisible && (
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : slots.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            {isOwner ? "Aucun créneau configuré" : "Horaires non disponibles"}
          </div>
        ) : (
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => {
              const daySlots = slotsByDay[index] || [];
              if (daySlots.length === 0) return null;
              
              return (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">{day}</h4>
                  <div className="grid gap-2">
                    {daySlots.map((slot) => (
                      <div 
                        key={slot.id} 
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {slot.start_time} - {slot.end_time}
                          </span>
                          {!slot.is_active && (
                            <Badge variant="secondary">Inactif</Badge>
                          )}
                        </div>
                        {isOwner && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingSlot(slot);
                                setIsOpen(true);
                              }}
                            >
                              Modifier
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => slot.id && handleDeleteSlot(slot.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </CardContent>
      )}
    </Card>
  );
};

interface SlotFormProps {
  mcardId: string;
  slot: AvailabilitySlot | null;
  onSave: (slot: AvailabilitySlot) => void;
  onCancel: () => void;
  DAYS_OF_WEEK: string[];
}

const SlotForm: React.FC<SlotFormProps> = ({ mcardId, slot, onSave, onCancel, DAYS_OF_WEEK }) => {
  const [formData, setFormData] = useState<AvailabilitySlot>({
    mcard_id: mcardId,
    day_of_week: slot?.day_of_week || 1,
    start_time: slot?.start_time || '09:00',
    end_time: slot?.end_time || '17:00',
    is_active: slot?.is_active ?? true,
    ...slot
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="day">Jour de la semaine</Label>
        <Select 
          value={formData.day_of_week.toString()} 
          onValueChange={(value) => setFormData({...formData, day_of_week: parseInt(value)})}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS_OF_WEEK.map((day, index) => (
              <SelectItem key={index} value={index.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_time">Heure de début</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({...formData, start_time: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="end_time">Heure de fin</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({...formData, end_time: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
        />
        <Label>Créneau actif</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {slot ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};