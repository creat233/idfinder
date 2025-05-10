
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink as ExternalLinkIcon, X } from "lucide-react";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  title?: string;
}

export const ExternalLink = ({ 
  href, 
  children, 
  className = "", 
  showIcon = true,
  title = "Lien externe"
}: ExternalLinkProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(href);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setUrl(href); // Ensure we have the latest URL
    setIsOpen(true);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      <a 
        href={href} 
        className={className}
        onClick={handleLinkClick}
      >
        {children}
        {showIcon && <ExternalLinkIcon className="ml-1 inline-block h-4 w-4" />}
      </a>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de visiter un site externe:
              <div className="my-2 bg-gray-50 p-2 rounded-md break-all">
                {url}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleOpenExternal}>
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Ouvrir le lien
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
