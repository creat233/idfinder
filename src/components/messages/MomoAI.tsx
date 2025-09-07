import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle } from 'lucide-react';
import momoAiAvatar from '@/assets/momo-ai-avatar.png';

interface MomoAIProps {
  onStartChat: () => void;
  className?: string;
}

export const MomoAI = ({ onStartChat, className = "" }: MomoAIProps) => {
  return (
    <div className={`p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-12 w-12 ring-2 ring-blue-300">
          <AvatarImage src={momoAiAvatar} alt="Momo AI" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
            <Bot className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900">Momo AI</h3>
          <p className="text-sm text-gray-600">Assistant intelligent</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-700 mb-3">
        Bonjour ! Je suis Momo, votre assistant IA. Je peux vous aider avec vos questions, 
        vous donner des conseils sur votre MCard ou simplement discuter avec vous.
      </p>
      
      <Button 
        onClick={onStartChat}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        size="sm"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Commencer une conversation
      </Button>
    </div>
  );
};