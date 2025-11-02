import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Search, Filter, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MCardProduct } from '@/types/mcard';
import { ProductImageModal } from '@/components/mcards/view/ProductImageModal';

const AllMCardProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products = [], mcardId = '', ownerName = '' } = location.state || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredProducts, setFilteredProducts] = useState<MCardProduct[]>(products);

  // Filtrer les produits
  useEffect(() => {
    let filtered = products;

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p: MCardProduct) => p.category === selectedCategory);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p: MCardProduct) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  // Obtenir les catégories uniques
  const uniqueCategories = Array.from(new Set((products as MCardProduct[]).map((p: MCardProduct) => p.category))) as string[];
  const categories: string[] = ['all', ...uniqueCategories];

  const handleProductClick = (product: MCardProduct) => {
    // Navigation vers les détails ou autre action
    console.log('Product clicked:', product);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-24 md:pb-8">
      {/* Header avec gradient */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary via-purple-600 to-pink-600 shadow-xl">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Tous les Produits & Services
              </h1>
              {ownerName && (
                <p className="text-white/90 text-sm sm:text-base mt-1">
                  De {ownerName}
                </p>
              )}
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Filtres de catégories */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Catégories</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category: string) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`cursor-pointer whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'Tous' : category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 mb-6">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4 text-center">
              <Package className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
              <p className="text-xs text-muted-foreground">Total produits</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardContent className="p-4 text-center">
              <Search className="h-5 w-5 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{filteredProducts.length}</p>
              <p className="text-xs text-muted-foreground">Affichés</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grille de produits */}
      <div className="container mx-auto px-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Aucun produit trouvé
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Essayez avec d'autres mots-clés"
                : 'Aucun produit dans cette catégorie'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-border bg-card"
              >
                <CardContent className="p-0">
                  {/* Image du produit */}
                  {product.image_url && (
                    <ProductImageModal imageUrl={product.image_url} product={product}>
                      <div className="relative h-48 overflow-hidden cursor-pointer">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-black/60 backdrop-blur-sm text-white border-0">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </ProductImageModal>
                  )}

                  {/* Informations du produit */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Prix */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl">
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">
                        {product.price.toLocaleString()} {product.currency}
                      </span>
                      <ShoppingCart className="h-5 w-5 text-green-500" />
                    </div>

                    {/* Bouton d'action */}
                    <Button
                      onClick={() => handleProductClick(product)}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Voir les détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMCardProducts;
