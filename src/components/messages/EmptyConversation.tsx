import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function EmptyConversation() {
  return (
    <Card className="h-full">
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium mb-2">Sélectionnez une conversation</h3>
          <p className="text-sm">Choisissez une conversation dans la liste pour commencer à discuter</p>
        </div>
      </div>
    </Card>
  );
}