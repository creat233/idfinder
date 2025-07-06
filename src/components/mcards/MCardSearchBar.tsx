import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface MCardSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const MCardSearchBar = ({ 
  onSearch, 
  placeholder = "Rechercher par nom, entreprise, téléphone, produit...",
  className = ""
}: MCardSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="flex-1 relative">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>
      <Button type="submit">
        Rechercher
      </Button>
    </form>
  );
};