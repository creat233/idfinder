import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { AvailabilitySelector } from './AvailabilitySelector';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface MCardAppointmentBookingProps {
  mcardId: string;
  mcardOwnerId: string;
  mcardOwnerName: string;
  phoneNumber?: string;
}

export const MCardAppointmentBooking = ({
  mcardId,
  mcardOwnerId,
  mcardOwnerName,
  phoneNumber
}: MCardAppointmentBookingProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Créneaux horaires disponibles
  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00', available: true },
    { id: '2', time: '10:00', available: true },
    { id: '3', time: '11:00', available: false },
    { id: '4', time: '14:00', available: true },
    { id: '5', time: '15:00', available: true },
    { id: '6', time: '16:00', available: true },
    { id: '7', time: '17:00', available: false },
  ];

  // Obtenir la date minimum (aujourd'hui)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Obtenir la date maximum (3 mois)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.clientName || !formData.clientEmail) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    setLoading(true);
    try {
      // Créer un message avec les détails du rendez-vous
      const appointmentMessage = `
📅 DEMANDE DE RENDEZ-VOUS

Date: ${new Date(selectedDate).toLocaleDateString('fr-FR')}
Heure: ${selectedTime}
Sujet: ${formData.subject || 'Non spécifié'}

Client: ${formData.clientName}
Email: ${formData.clientEmail}
Téléphone: ${formData.clientPhone || 'Non fourni'}

Message:
${formData.message || 'Aucun message supplémentaire'}

---
Merci de confirmer ou proposer un autre créneau.
      `.trim();

      const { error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: (await supabase.auth.getUser()).data.user?.id || '',
          recipient_id: mcardOwnerId,
          mcard_id: mcardId,
          subject: `Demande de rendez-vous - ${new Date(selectedDate).toLocaleDateString('fr-FR')} à ${selectedTime}`,
          message: appointmentMessage
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Votre demande de rendez-vous a été envoyée avec succès."
      });

      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        subject: '',
        message: ''
      });
      setIsOpen(false);

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
          <Calendar className="h-4 w-4 mr-2" />
          Prendre rendez-vous
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            Rendez-vous avec {mcardOwnerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Sélection de date et heure avec créneaux configurés */}
          <AvailabilitySelector
            mcardId={mcardId}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
          />

          {/* Informations client */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="clientName">Votre nom *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  placeholder="Nom complet"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Votre email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  placeholder="email@exemple.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Votre téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="clientPhone"
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                  placeholder="+221 XX XXX XX XX"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet du rendez-vous</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Consultation, réunion, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Détails supplémentaires..."
                  className="pl-10 min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          {selectedDate && selectedTime && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-green-800 mb-2">Récapitulatif</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Date :</strong> {new Date(selectedDate).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Heure :</strong> {selectedTime}</p>
                  <p><strong>Avec :</strong> {mcardOwnerName}</p>
                  {phoneNumber && (
                    <p><strong>Téléphone :</strong> {phoneNumber}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedDate || !selectedTime || !formData.clientName || !formData.clientEmail}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Envoi...' : 'Confirmer'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            * Champs obligatoires
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};