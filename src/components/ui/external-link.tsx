
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink as ExternalLinkIcon, Globe, Shield } from "lucide-react";
import { InAppBrowser } from "./in-app-browser";
import { Badge } from "@/components/ui/badge";

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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              {title}
            </DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de visiter un site externe:
            </DialogDescription>
          </DialogHeader>
          
          <div className="my-3">
            <div className="bg-gray-50 p-3 rounded-md break-all border border-gray-200">
              <Badge variant="outline" className="mb-2 bg-blue-50">URL</Badge>
              <p className="text-sm font-mono word-break">{url}</p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsConfirmOpen(false)}
              className="sm:order-1"
            >
              Annuler
            </Button>
            {useInAppBrowser && (
              <Button 
                variant="default" 
                onClick={handleOpenInApp} 
                className="flex-1 sm:flex-auto sm:order-3"
              >
                <Globe className="mr-2 h-4 w-4" />
                Ouvrir dans l'application
              </Button>
            )}
            <Button 
              variant="secondary" 
              onClick={handleOpenExternal}
              className="sm:order-2"
            >
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

