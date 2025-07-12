
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
    <div className="p-4 bg-white border-t-2 border-gray-200 shadow-lg">
      <div className="flex gap-3 items-end max-w-4xl mx-auto">
        <Textarea
          placeholder="Tapez votre message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={3}
          className="flex-1 resize-none border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-base p-3 min-h-[60px] max-h-[120px]"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || sending}
          size="lg"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-[60px] min-w-[60px] shadow-md"
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
