import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import momoAiAvatar from '@/assets/momo-ai-avatar.png';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface MomoAIChatProps {
  onBack: () => void;
}

export const MomoAIChat = ({ onBack }: MomoAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour ! Je suis Momo, votre assistant IA. Je peux vous aider avec vos questions sur votre MCard, vous donner des conseils sur l\'optimisation de votre profil, ou simplement discuter avec vous. Comment puis-je vous aider aujourd\'hui ?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMomoResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Réponses contextuelles basées sur les mots-clés
    if (lowerMessage.includes('mcard') || lowerMessage.includes('carte')) {
      return 'Pour optimiser votre MCard, je vous recommande de :\n• Ajouter une photo de profil professionnelle\n• Remplir votre description avec vos compétences clés\n• Ajouter vos réseaux sociaux professionnels\n• Publier régulièrement des statuts pour rester visible\n\nAvez-vous des questions spécifiques sur votre carte ?';
    }

    if (lowerMessage.includes('photo') || lowerMessage.includes('profil') || lowerMessage.includes('image')) {
      return 'Pour votre photo de profil, voici mes conseils :\n• Utilisez une photo récente et professionnelle\n• Assurez-vous que votre visage est bien visible\n• Évitez les photos trop sombres ou floues\n• Les formats JPG, PNG et WebP sont acceptés\n\nSi vous avez des difficultés à télécharger votre photo, vérifiez qu\'elle ne dépasse pas 5 MB.';
    }

    if (lowerMessage.includes('message') || lowerMessage.includes('conversation')) {
      return 'Pour bien gérer vos messages :\n• Répondez rapidement pour maintenir l\'engagement\n• Soyez professionnel dans vos échanges\n• Utilisez les options de blocage si nécessaire\n• Vous pouvez supprimer des conversations entières\n\nY a-t-il un problème spécifique avec vos messages ?';
    }

    if (lowerMessage.includes('produit') || lowerMessage.includes('service')) {
      return 'Pour vos produits et services :\n• Ajoutez des photos attractives\n• Rédigez des descriptions claires et détaillées\n• Utilisez les bonnes catégories (Produit, Service, Article)\n• Mettez à jour régulièrement vos offres\n\nVoulez-vous des conseils sur une catégorie en particulier ?';
    }

    if (lowerMessage.includes('plan') || lowerMessage.includes('premium') || lowerMessage.includes('essentiel')) {
      return 'Concernant les plans :\n• Plan Essentiel : Idéal pour débuter (10 produits/services, 5 statuts/jour)\n• Plan Premium : Pour les professionnels actifs (50 produits/services, 20 statuts/jour)\n• Plan Ultime : Pour les entreprises (illimité)\n\nQuel plan correspond le mieux à vos besoins ?';
    }

    if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('problème')) {
      return 'Je suis là pour vous aider ! Voici ce que je peux faire :\n• Conseils pour optimiser votre MCard\n• Aide avec les fonctionnalités\n• Suggestions pour améliorer votre visibilité\n• Support technique\n\nDites-moi précisément ce qui vous préoccupe.';
    }

    // Réponses générales
    const responses = [
      'C\'est une excellente question ! Pouvez-vous me donner plus de détails pour que je puisse mieux vous aider ?',
      'Je comprends votre préoccupation. Dans votre situation, je recommande de vérifier vos paramètres et de vous assurer que tout est correctement configuré.',
      'Merci pour votre message ! Pour vous donner le meilleur conseil, pourriez-vous me préciser quel aspect de votre MCard vous souhaitez améliorer ?',
      'Intéressant ! Avez-vous essayé de consulter la section d\'aide ou de contacter le support technique pour ce type de question ?'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulation du délai de réponse de l'IA
    setTimeout(() => {
      const momoResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateMomoResponse(userMessage.content),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, momoResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // 1-3 secondes
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-10 w-10 ring-2 ring-blue-300">
          <AvatarImage src={momoAiAvatar} alt="Momo AI" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">Momo AI</h3>
          <p className="text-xs text-gray-600">Assistant intelligent</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={momoAiAvatar} alt="Momo AI" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className={`max-w-[80%] ${message.isUser ? 'order-first' : ''}`}>
              <div
                className={`p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {message.isUser && (
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gray-600 text-white">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={momoAiAvatar} alt="Momo AI" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSend} 
            size="sm"
            disabled={!newMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};