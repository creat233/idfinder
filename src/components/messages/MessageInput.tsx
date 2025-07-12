
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
    <div className="p-4 border-t bg-white shadow-lg">
      <div className="flex gap-3 items-end">
        <Textarea
          placeholder="Tapez votre message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          className="flex-1 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white h-[80px]"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
