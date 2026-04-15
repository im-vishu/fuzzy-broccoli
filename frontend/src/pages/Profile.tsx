import { User, Heart, ShoppingBag, Settings, LogOut, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

const Profile = () => {
  const favorites = products.slice(0, 3);

  return (
    <div className="container py-8 max-w-4xl">
      {/* Profile header */}
      <div className="rounded-xl border bg-card p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
          <User className="h-10 w-10 text-primary-foreground" />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="font-display text-2xl font-bold">Beauty Enthusiast</h1>
          <p className="text-muted-foreground text-sm">beauty.lover@email.com</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
            <Badge variant="outline"><Star className="h-3 w-3 mr-1" /> Dupe Hunter</Badge>
            <Badge variant="outline">12 Reviews</Badge>
            <Badge variant="outline">3 Suggestions</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Settings className="h-4 w-4 mr-1" /> Settings</Button>
          <Button variant="ghost" size="sm"><LogOut className="h-4 w-4 mr-1" /> Logout</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Heart, label: "Favorites", value: "12" },
          { icon: ShoppingBag, label: "Orders", value: "5" },
          { icon: Star, label: "Reviews", value: "8" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border bg-card p-4 text-center">
            <stat.icon className="h-5 w-5 mx-auto text-primary mb-2" />
            <p className="font-display text-xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Favorites */}
      <div>
        <h2 className="font-display text-xl font-bold mb-4">My Favorites</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {favorites.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
