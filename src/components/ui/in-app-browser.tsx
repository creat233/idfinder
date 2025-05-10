
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight, RefreshCw, ExternalLink as LinkIcon } from "lucide-react";

interface InAppBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

export const InAppBrowser = ({ isOpen, onClose, url, title = "Site externe" }: InAppBrowserProps) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [pageTitle, setPageTitle] = useState(title);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentUrl(url);
      setIsLoading(true);
    }
  }, [isOpen, url]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    
    try {
      // Try to get the title from the iframe if possible
      if (iframeRef.current?.contentDocument?.title) {
        setPageTitle(iframeRef.current.contentDocument.title);
      }
    } catch (error) {
      // Cannot access iframe content due to same-origin policy
      console.log("Could not access iframe content:", error);
    }
  };

  const handleOpenExternal = () => {
    window.open(currentUrl, '_blank');
  };

  const handleGoBack = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.back();
      } catch (error) {
        console.error("Cannot access iframe history:", error);
      }
    }
  };

  const handleGoForward = () => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.forward();
      } catch (error) {
        console.error("Cannot access iframe history:", error);
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] h-[80vh] max-h-[80vh] p-0 gap-0">
        {/* Browser header */}
        <div className="bg-gray-100 p-2 flex items-center border-b border-gray-200 sticky top-0">
          <div className="flex items-center gap-2 mr-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8" 
              onClick={handleGoBack}
              title="Retour"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8" 
              onClick={handleGoForward}
              title="Avancer"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8" 
              onClick={handleRefresh}
              title="Actualiser"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 flex items-center bg-white rounded-full px-3 py-1 text-sm overflow-hidden border border-gray-300">
            <span className="truncate text-gray-500">
              {currentUrl}
            </span>
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8" 
              onClick={handleOpenExternal}
              title="Ouvrir dans un nouvel onglet"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8" 
              onClick={onClose}
              title="Fermer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Browser content */}
        <div className="flex-1 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={currentUrl}
            title={pageTitle}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
