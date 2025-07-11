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
    <div className="p-4 border-t bg-gray-50">
      <div className="flex gap-3">
        <Textarea
          placeholder="Tapez votre message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={2}
          className="flex-1 resize-none"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || sending}
          className="self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}