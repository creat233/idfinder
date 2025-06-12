
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PendingCodesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const PendingCodesSearch = ({ searchTerm, onSearchChange }: PendingCodesSearchProps) => {
  return (
    <div className="flex items-center gap-2">
      <Search className="h-4 w-4" />
      <Input
        placeholder="Rechercher par code, email ou nom..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
