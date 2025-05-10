
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, ArrowRight, RefreshCw, ExternalLink as LinkIcon, Home, Shield, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

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
  const [error, setError] = useState<string | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentUrl(url);
      setPageTitle(title);
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, url, title]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError(null);
    
    try {
      // Try to get the title from the iframe if possible
      if (iframeRef.current?.contentDocument?.title) {
        setPageTitle(iframeRef.current.contentDocument.title);
      }
      
      // Check if we can go back or forward
      if (iframeRef.current?.contentWindow) {
        const history = iframeRef.current.contentWindow.history;
        setCanGoBack(history.length > 1);
        setCanGoForward(window.frames[0]?.length > 0);
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
    setIsLoading(true);
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.back();
      } catch (error) {
        console.error("Cannot access iframe history:", error);
        setError("Impossible de revenir en arrière");
      }
    }
  };

  const handleGoForward = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.forward();
      } catch (error) {
        console.error("Cannot access iframe history:", error);
        setError("Impossible d'avancer");
      }
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  const handleGoHome = () => {
    setIsLoading(true);
    setError(null);
    setCurrentUrl(url);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Impossible de charger la page. Veuillez réessayer ou ouvrir dans un navigateur externe.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] h-[85vh] max-h-[85vh] p-0 gap-0">
        <DialogHeader className="bg-gray-50 p-2 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-medium truncate max-w-[60%]">
              {pageTitle}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 rounded-full" 
                      onClick={onClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fermer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </DialogHeader>
        
        {/* Browser toolbar */}
        <div className="bg-gray-100 p-2 flex items-center gap-2 border-b border-gray-200">
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`h-8 w-8 ${!canGoBack ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleGoBack}
                    disabled={!canGoBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Retour</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`h-8 w-8 ${!canGoForward ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleGoForward}
                    disabled={!canGoForward}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Avancer</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Actualiser</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleGoHome}
                  >
                    <Home className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Page initiale</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          <div className="flex-1 flex items-center bg-white rounded-full px-3 py-1 text-sm overflow-hidden border border-gray-300">
            <Shield className="h-4 w-4 mr-2 text-green-500" />
            <span className="truncate text-gray-700 flex-1">
              {currentUrl}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8" 
                    onClick={handleOpenExternal}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ouvrir dans un nouvel onglet</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => alert("Ce site web est affiché dans une fenêtre sécurisée au sein de l'application.")}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Informations de sécurité</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Browser content */}
        <div className="flex-1 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-gray-600 mt-4">Chargement en cours...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <h3 className="font-medium text-red-600 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réessayer
                  </Button>
                  <Button variant="default" onClick={handleOpenExternal}>
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Ouvrir dans un navigateur externe
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            src={currentUrl}
            title={pageTitle}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
        
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Navigation sécurisée</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Cookies et données de ce site sont isolés de l'application</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Powered by FinderID</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

