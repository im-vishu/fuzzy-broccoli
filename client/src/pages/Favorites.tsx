import { Heart } from "lucide-react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const Favorites = () => {
  const favorites = products.slice(0, 6);

  return (
    <div className="container py-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">My Favorites</h1>
          <p className="text-sm text-muted-foreground">{favorites.length} saved dupes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
