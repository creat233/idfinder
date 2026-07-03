import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trash2, MessageCircle, ShoppingCart, ArrowLeft, X, Clock, Truck, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MCardMessageDialog } from '@/components/mcards/MCardMessageDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

interface OwnerGroup {
  mcardId: string;
  ownerName: string;
  ownerUserId?: string;
  slug?: string;
  profilePicture?: string | null;
  deliveryHours?: string | null;
  products: any[];
  subtotal: number;
  currency: string;
}

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<{
    mcardId: string;
    ownerName: string;
    ownerUserId: string;
    productName: string;
  } | null>(null);
  const [mcardInfo, setMcardInfo] = useState<Record<string, { slug?: string; profile_picture_url?: string | null; delivery_hours?: string | null }>>({});
  const navigate = useNavigate();

  // Fetch delivery_hours + slug/profile for each unique mcard
  useEffect(() => {
    const ids = Array.from(new Set(cartItems.map((i) => i.mcardId).filter(Boolean)));
    if (ids.length === 0) return;
    (async () => {
      const { data } = await supabase
        .from('mcards')
        .select('id, slug, profile_picture_url, delivery_hours')
        .in('id', ids);
      if (data) {
        const map: any = {};
        data.forEach((m: any) => (map[m.id] = m));
        setMcardInfo(map);
      }
    })();
  }, [cartItems]);

  const handleContactOwner = (item: any) => {
    if (item.mcardOwnerUserId && item.mcardOwnerName) {
      setSelectedContact({
        mcardId: item.mcardId,
        ownerName: item.mcardOwnerName,
        ownerUserId: item.mcardOwnerUserId,
        productName: item.name,
      });
      setContactDialogOpen(true);
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageDialogOpen(true);
  };

  const handleOwnerClick = (group: OwnerGroup) => {
    const target = group.slug || group.mcardId;
    navigate(`/mcard/${target}`);
  };

  // Group + classify by MCard owner, sorted by owner name
  const groupedItems: OwnerGroup[] = Object.values(
    cartItems.reduce((acc, item) => {
      const key = item.mcardId;
      if (!acc[key]) {
        acc[key] = {
          mcardId: item.mcardId,
          ownerName: item.mcardOwnerName || 'Propriétaire inconnu',
          ownerUserId: item.mcardOwnerUserId,
          products: [],
          subtotal: 0,
          currency: item.currency || 'FCFA',
        };
      }
      acc[key].products.push(item);
      acc[key].subtotal += Number(item.price) || 0;
      return acc;
    }, {} as Record<string, OwnerGroup>)
  )
    .map((g) => ({
      ...g,
      slug: mcardInfo[g.mcardId]?.slug,
      profilePicture: mcardInfo[g.mcardId]?.profile_picture_url,
      deliveryHours: mcardInfo[g.mcardId]?.delivery_hours,
    }))
    .sort((a, b) => a.ownerName.localeCompare(b.ownerName));

  // Total in dominant currency (fallback to FCFA)
  const totalByCurrency = cartItems.reduce((acc, item) => {
    const c = item.currency || 'FCFA';
    acc[c] = (acc[c] || 0) + (Number(item.price) || 0);
    return acc;
  }, {} as Record<string, number>);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 py-8 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon Panier</h1>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h3>
            <p className="text-gray-600 mb-6">Explorez les cartes vérifiées pour découvrir des produits et services intéressants</p>
            <Button onClick={() => navigate('/mcards-verifiees')} className="bg-primary hover:bg-primary/90">
              Découvrir les produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/40 py-6 pb-32 md:pb-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-2" aria-label="Retour">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Mon Panier</h1>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </Badge>
          </div>
          <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Vider</span>
          </Button>
        </div>

        {/* Total summary sticky */}
        <div className="sticky top-2 z-10 mb-6 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl shadow-xl p-4 sm:p-5 flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm opacity-90">Total du panier</p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-baseline">
              {Object.entries(totalByCurrency).map(([cur, amt]) => (
                <span key={cur} className="text-xl sm:text-3xl font-bold">
                  {amt.toLocaleString()} <span className="text-sm font-medium opacity-90">{cur}</span>
                </span>
              ))}
            </div>
            <p className="text-[11px] sm:text-xs opacity-80 mt-0.5">
              {groupedItems.length} vendeur{groupedItems.length > 1 ? 's' : ''} · {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
            </p>
          </div>
          <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 opacity-80" />
        </div>

        {/* Groups by MCard */}
        <div className="space-y-5">
          {groupedItems.map((group) => (
            <div key={group.mcardId} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              {/* Owner header */}
              <div className="p-4 sm:p-5 border-b bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleOwnerClick(group)}
                    className="flex items-center gap-3 group text-left"
                  >
                    {group.profilePicture ? (
                      <img src={group.profilePicture} alt={group.ownerName} className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20" />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        <Store className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {group.ownerName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {group.products.length} article{group.products.length > 1 ? 's' : ''} · Sous-total{' '}
                        <span className="font-semibold text-green-600">
                          {group.subtotal.toLocaleString()} {group.currency}
                        </span>
                      </p>
                    </div>
                  </button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOwnerClick(group)}>
                      Voir carte
                    </Button>
                    {group.ownerUserId && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleContactOwner({
                            mcardId: group.mcardId,
                            mcardOwnerName: group.ownerName,
                            mcardOwnerUserId: group.ownerUserId,
                            name: group.products.map((p) => p.name).join(', '),
                          })
                        }
                        className="bg-primary hover:bg-primary/90"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Contacter
                      </Button>
                    )}
                  </div>
                </div>

                {/* Delivery hours - shown ONLY if owner set them */}
                {group.deliveryHours && group.deliveryHours.trim() !== '' && (
                  <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <Truck className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Horaires de livraison
                      </p>
                      <p className="text-sm text-amber-900/90 whitespace-pre-line">{group.deliveryHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Products grid: 1 col mobile, 2 tablet, 3 desktop */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.products.map((item) => (
                  <div key={item.id} className="border rounded-xl p-3 flex flex-col hover:shadow-md transition-shadow">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer"
                        onClick={() => handleImageClick(item.image_url)}
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">{item.name}</h4>
                      <Badge variant="secondary" className="text-[10px] mt-1">
                        {item.category}
                      </Badge>
                      {item.description && (
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-base font-bold text-green-600">
                        {item.price.toLocaleString()} {item.currency}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                        aria-label="Retirer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Ajouté {format(item.addedAt, 'dd MMM HH:mm', { locale: fr })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Image dialog */}
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-gradient-to-br from-black/95 to-gray-900/95 border-none overflow-hidden">
            <div className="relative w-full h-full min-h-[80vh] flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setImageDialogOpen(false)}
                className="absolute top-6 right-6 z-50 text-white/80 hover:text-white hover:bg-white/10 rounded-full border border-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="relative p-8 w-full h-full flex items-center justify-center">
                <img src={selectedImage} alt="Image" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {selectedContact && (
          <MCardMessageDialog
            isOpen={contactDialogOpen}
            onOpenChange={(open) => {
              setContactDialogOpen(open);
              if (!open) setSelectedContact(null);
            }}
            recipientId={selectedContact.ownerUserId}
            recipientName={selectedContact.ownerName}
            mcardId={selectedContact.mcardId}
          />
        )}
      </div>
    </div>
  );
}
