
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink as ExternalLinkIcon, Globe } from "lucide-react";
import { InAppBrowser } from "./in-app-browser";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  title?: string;
  useInAppBrowser?: boolean;
}

export const ExternalLink = ({ 
  href, 
  children, 
  className = "", 
  showIcon = true,
  title = "Lien externe",
  useInAppBrowser = true
}: ExternalLinkProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [url, setUrl] = useState(href);

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setUrl(href); // Ensure we have the latest URL
    setIsConfirmOpen(true);
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank');
    setIsConfirmOpen(false);
  };

  const handleOpenInApp = () => {
    setIsConfirmOpen(false);
    setIsBrowserOpen(true);
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

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
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
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Annuler
            </Button>
            {useInAppBrowser && (
              <Button variant="default" onClick={handleOpenInApp} className="flex-1 sm:flex-auto">
                <Globe className="mr-2 h-4 w-4" />
                Ouvrir dans l'application
              </Button>
            )}
            <Button variant="secondary" onClick={handleOpenExternal}>
              <ExternalLinkIcon className="mr-2 h-4 w-4" />
              Ouvrir dans un nouvel onglet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* In-App Browser */}
      <InAppBrowser
        isOpen={isBrowserOpen}
        onClose={() => setIsBrowserOpen(false)}
        url={url}
        title={title}
      />
    </>
  );
};
