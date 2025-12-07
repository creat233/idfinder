import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, MessageSquareText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutoReplySettings {
  enabled: boolean;
  selectedMessage: string;
  customMessage: string;
}

const PREDEFINED_MESSAGES = [
  {
    id: "vacation",
    label: "En vacances",
    message: "Bonjour ! Je suis actuellement en vacances et ne suis pas disponible. Je vous répondrai dès mon retour. Merci de votre patience !"
  },
  {
    id: "busy",
    label: "Occupé",
    message: "Bonjour ! Je suis actuellement occupé et ne peux pas répondre immédiatement. Je vous contacterai dès que possible."
  },
  {
    id: "away",
    label: "Absent temporairement",
    message: "Bonjour ! Je suis temporairement absent. Je reviendrai vers vous très prochainement. Merci pour votre message !"
  },
  {
    id: "weekend",
    label: "Week-end",
    message: "Bonjour ! C'est le week-end et je ne consulte pas mes messages. Je vous répondrai dès lundi. Bon week-end !"
  },
  {
    id: "custom",
    label: "Message personnalisé",
    message: ""
  }
];

interface AutoReplySettingsProps {
  userId: string;
}

export function AutoReplySettingsDialog({ userId }: AutoReplySettingsProps) {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AutoReplySettings>({
    enabled: false,
    selectedMessage: "vacation",
    customMessage: ""
  });
  const { toast } = useToast();

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(`autoReply_${userId}`);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Erreur chargement paramètres auto-réponse:", error);
      }
    }
  }, [userId]);

  const handleSave = () => {
    localStorage.setItem(`autoReply_${userId}`, JSON.stringify(settings));
    toast({
      title: "Paramètres enregistrés",
      description: settings.enabled 
        ? "Les messages d'absence automatique sont activés"
        : "Les messages d'absence automatique sont désactivés"
    });
    setOpen(false);
  };

  const getCurrentMessage = () => {
    if (settings.selectedMessage === "custom") {
      return settings.customMessage;
    }
    return PREDEFINED_MESSAGES.find(m => m.id === settings.selectedMessage)?.message || "";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
          title="Paramètres d'absence"
        >
          <Settings className="h-5 w-5" />
          {settings.enabled && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-primary" />
            Message d'absence automatique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Activation */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="auto-reply-toggle" className="font-medium">
                Activer les réponses automatiques
              </Label>
              <p className="text-sm text-muted-foreground">
                Envoyer un message automatique quand vous êtes absent
              </p>
            </div>
            <Switch
              id="auto-reply-toggle"
              checked={settings.enabled}
              onCheckedChange={(enabled) => 
                setSettings(prev => ({ ...prev, enabled }))
              }
            />
          </div>

          {/* Sélection du message */}
          <div className={`space-y-3 ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <Label className="font-medium">Choisir un message</Label>
            <RadioGroup
              value={settings.selectedMessage}
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, selectedMessage: value }))
              }
              className="space-y-2"
            >
              {PREDEFINED_MESSAGES.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                    settings.selectedMessage === msg.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <RadioGroupItem value={msg.id} id={msg.id} className="mt-1" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor={msg.id} className="font-medium cursor-pointer">
                      {msg.label}
                    </Label>
                    {msg.message && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {msg.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Message personnalisé */}
          {settings.selectedMessage === "custom" && settings.enabled && (
            <div className="space-y-2">
              <Label htmlFor="custom-message" className="font-medium">
                Votre message personnalisé
              </Label>
              <Textarea
                id="custom-message"
                placeholder="Écrivez votre message d'absence personnalisé..."
                value={settings.customMessage}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, customMessage: e.target.value }))
                }
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {settings.customMessage.length}/500 caractères
              </p>
            </div>
          )}

          {/* Aperçu */}
          {settings.enabled && getCurrentMessage() && (
            <div className="space-y-2">
              <Label className="font-medium">Aperçu du message</Label>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700 italic">
                  "{getCurrentMessage()}"
                </p>
              </div>
            </div>
          )}

          {/* Bouton sauvegarder */}
          <Button onClick={handleSave} className="w-full">
            Enregistrer les paramètres
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook pour obtenir le message d'absence actuel
export function useAutoReplyMessage(userId: string): string | null {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem(`autoReply_${userId}`);
    if (savedSettings) {
      try {
        const settings: AutoReplySettings = JSON.parse(savedSettings);
        if (settings.enabled) {
          if (settings.selectedMessage === "custom") {
            setMessage(settings.customMessage || null);
          } else {
            const predefined = PREDEFINED_MESSAGES.find(m => m.id === settings.selectedMessage);
            setMessage(predefined?.message || null);
          }
        } else {
          setMessage(null);
        }
      } catch (error) {
        setMessage(null);
      }
    }
  }, [userId]);

  return message;
}

// Fonction pour vérifier si l'auto-réponse est activée
export function getAutoReplySettings(userId: string): AutoReplySettings | null {
  const savedSettings = localStorage.getItem(`autoReply_${userId}`);
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch {
      return null;
    }
  }
  return null;
}
