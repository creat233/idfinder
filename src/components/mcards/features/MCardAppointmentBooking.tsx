import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, CheckCircle2, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { AvailabilitySelector } from './AvailabilitySelector';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { localDateValue } from './bookingSlots';

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmation, setConfirmation] = useState<{ id: string; date: string; time: string } | null>(null);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !formData.clientName || !formData.clientEmail) {
      toast({
        variant: "destructive",
        title: "Champs manquants",
        description: "Veuillez remplir tous les champs obligatoires (nom, email, date et heure)"
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.clientEmail)) {
      toast({
        variant: "destructive",
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide"
      });
      return;
    }

    if (loading) return;
    if (!navigator.onLine) {
      setSubmitError('Une connexion internet est nécessaire pour confirmer votre réservation.');
      return;
    }
    setLoading(true);
    setSubmitError('');
    try {
      const { data, error } = await supabase.rpc('book_mcard_appointment', {
        p_mcard_id: mcardId,
        p_date: selectedDate,
        p_time: selectedTime,
        p_client_name: formData.clientName.trim(),
        p_client_email: formData.clientEmail.trim(),
        p_client_phone: formData.clientPhone.trim(),
        p_subject: formData.subject.trim(),
        p_message: formData.message.trim(),
        p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      });
      if (error) {
        if (error.code === '23505') {
          setSelectedTime('');
          setRefreshKey(value => value + 1);
          throw new Error('Ce créneau vient d’être réservé. Veuillez choisir un autre horaire.');
        }
        throw new Error(error.message || 'Impossible de confirmer la réservation. Réessayez.');
      }
      if (!data) throw new Error('La réservation n’a pas été confirmée. Réessayez.');
      setConfirmation({ id: data, date: selectedDate, time: selectedTime });
      setRefreshKey(value => value + 1);
      toast({ title: 'Rendez-vous confirmé', description: `Votre créneau chez ${mcardOwnerName} est réservé.` });
      setFormData({ clientName: '', clientEmail: '', clientPhone: '', subject: '', message: '' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Impossible de confirmer la réservation.';
      setSubmitError(message);
        } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => {
      setIsOpen(open);
      if (open) { setConfirmation(null); setSubmitError(''); setSelectedTime(''); setSelectedDate(localDateValue()); setRefreshKey(value => value + 1); }
    }}>
      <DialogTrigger asChild>
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 active:scale-95 text-xs sm:text-sm h-9 sm:h-10">
          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Prendre rendez-vous</span>
          <span className="xs:hidden">RDV</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Rendez-vous avec {mcardOwnerName}
          </DialogTitle>
        </DialogHeader>

        {confirmation ? (
          <div role="status" className="space-y-4 text-center py-4">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Votre rendez-vous est confirmé !</h3>
            <p>Le {new Date(`${confirmation.date}T12:00:00`).toLocaleDateString('fr-FR')} à {confirmation.time}, avec {mcardOwnerName}.</p>
            <p className="text-sm text-muted-foreground">Ce créneau vous est réservé. Le propriétaire a été informé.</p>
            <p className="text-xs text-muted-foreground break-all">Référence : {confirmation.id}</p>
            <Button onClick={() => setIsOpen(false)}>Fermer</Button>
          </div>
        ) : <div className="space-y-4">
          {/* Sélection de date et heure avec créneaux configurés */}
          <AvailabilitySelector
            refreshKey={refreshKey}
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
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="clientName"
                  maxLength={120}
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
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="clientEmail"
                  type="email"
                  maxLength={254}
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
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="clientPhone"
                  type="tel"
                  maxLength={50}
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
                maxLength={200}
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Consultation, réunion, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="message"
                  maxLength={2000}
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
            <Card className="bg-muted border-border">
              <CardContent className="pt-4">
                <h4 className="font-semibold text-foreground mb-2">Récapitulatif</h4>
                <div className="text-sm text-foreground space-y-1">
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

          {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}

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
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {loading ? 'Réservation…' : 'Confirmer'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * Champs obligatoires
          </p>
        </div>}
      </DialogContent>
    </Dialog>
  );
};