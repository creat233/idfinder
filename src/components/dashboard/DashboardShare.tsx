
import { Button } from "@/components/ui/button";
import { Share2, Download, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DashboardShare = () => {
  const { toast } = useToast();

  const handleInviteFriend = () => {
    const siteUrl = window.location.origin;
    const apkUrl = `${siteUrl}/FinderID (1).apk`;
    const message = `🔍 Découvre FinderID - L'app qui aide à retrouver les pièces d'identité perdues !\n\n📱 Site web: ${siteUrl}\n💾 Télécharger l'app Android: ${apkUrl}\n\nRejoins-nous pour une communauté solidaire ! 🤝`;
    
    if (navigator.share) {
      navigator.share({
        title: 'FinderID - Retrouvez vos papiers perdus',
        text: message,
        url: siteUrl
      });
    } else {
      navigator.clipboard.writeText(message);
      toast({
        title: "Lien copié !",
        description: "Le message d'invitation a été copié dans le presse-papiers",
      });
    }
  };

  const handleDownloadAPK = () => {
    const link = document.createElement('a');
    link.href = '/FinderID (1).apk';
    link.download = 'FinderID.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Téléchargement démarré",
      description: "L'application FinderID est en cours de téléchargement",
    });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Partagez FinderID avec vos proches</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Plus nous sommes nombreux, plus nous avons de chances de retrouver les documents perdus rapidement !
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleInviteFriend}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-full"
          >
            <Share2 className="mr-2 h-5 w-5" />
            Partager le lien du site
          </Button>
          
          <Button 
            onClick={handleDownloadAPK}
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-full"
          >
            <Download className="mr-2 h-5 w-5" />
            Partager l'app Android
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-white/10 rounded-lg max-w-md mx-auto">
          <p className="text-sm mb-2">Lien du site web :</p>
          <div className="flex items-center gap-2 bg-white/20 rounded p-2">
            <Link className="h-4 w-4" />
            <span className="text-sm font-mono">{window.location.origin}</span>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-white/20 p-1"
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin);
                toast({ title: "Lien copié !", description: "Le lien a été copié dans le presse-papiers" });
              }}
            >
              📋
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
