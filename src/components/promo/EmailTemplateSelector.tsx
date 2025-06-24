
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, ChevronDown } from "lucide-react";
import { templateCategories } from "./email-templates/template-list";
import { useState } from "react";

interface EmailTemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
}

export const EmailTemplateSelector = ({ onTemplateSelect }: EmailTemplateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Choisir un modèle
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-96 overflow-y-auto p-2">
        <div className="grid gap-4">
          {templateCategories.map((category) => {
            const filteredTemplates = category.templates.filter(t => t.contexts.includes('bulk'));
            if (filteredTemplates.length === 0) return null;

            return (
              <div key={category.name}>
                <h4 className="font-medium text-sm text-muted-foreground mb-2 px-2">{category.name}</h4>
                <div className="grid gap-1">
                  {filteredTemplates.map(({ id, label }) => (
                    <Button
                      key={id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTemplateSelect(id)}
                      className="w-full justify-start"
                    >
                      <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
