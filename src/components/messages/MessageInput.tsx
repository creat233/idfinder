
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  sending: boolean;
}

export function MessageInput({ value, onChange, onSend, sending }: MessageInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !sending) {
        onSend();
      }
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-t border-gray-200">
      <div className="flex gap-3 items-end max-w-full">
        <div className="flex-1 relative">
          <Textarea
            placeholder="Tapez votre message..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            className="flex-1 resize-none border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl text-base p-4 pr-12 min-h-[52px] max-h-[120px] bg-white shadow-sm transition-all duration-200"
          />
        </div>
        <Button
          onClick={onSend}
          disabled={!value.trim() || sending}
          size="lg"
          className="px-4 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-[52px] min-w-[52px] shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
