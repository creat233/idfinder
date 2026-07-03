import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  otherUserId: string;
  currentUserId: string;
  onDeleted: () => void;
  children: React.ReactNode;
  containerClassName?: string;
}

export function SwipeableConversationItem({
  otherUserId,
  currentUserId,
  onDeleted,
  children,
  containerClassName,
}: Props) {
  const [offset, setOffset] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const startX = useRef<number | null>(null);
  const currentX = useRef(0);

  const REVEAL = -88;

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = offset;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = e.touches[0].clientX - startX.current;
    const next = Math.min(0, Math.max(REVEAL * 1.4, currentX.current + delta));
    setOffset(next);
  };
  const onTouchEnd = () => {
    startX.current = null;
    setOffset(offset < REVEAL / 2 ? REVEAL : 0);
  };

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    const { error } = await supabase
      .from("mcard_messages")
      .delete()
      .or(
        `and(sender_id.eq.${currentUserId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${currentUserId})`
      );
    if (error) {
      toast.error("Impossible de supprimer la conversation");
    } else {
      toast.success("Conversation supprimée");
      onDeleted();
    }
  };

  return (
    <div className="relative overflow-hidden">
      <button
        type="button"
        onClick={handleDelete}
        className="absolute right-0 top-0 bottom-0 w-[88px] bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center gap-1 text-xs font-medium"
        aria-label="Supprimer la conversation"
      >
        <Trash2 className="h-5 w-5" />
        {confirming ? "Confirmer" : "Supprimer"}
      </button>
      <div
        className={containerClassName}
        style={{ transform: `translateX(${offset}px)`, transition: startX.current ? "none" : "transform 0.2s ease" }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
