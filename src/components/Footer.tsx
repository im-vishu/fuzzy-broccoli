import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">Fuzzy-Broccoli</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Your go-to destination for beauty dupes. Look expensive, spend less.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Shop</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/search?category=Face" className="block hover:text-primary">Face</Link>
            <Link to="/search?category=Eyes" className="block hover:text-primary">Eyes</Link>
            <Link to="/search?category=Lips" className="block hover:text-primary">Lips</Link>
            <Link to="/search?category=Skincare" className="block hover:text-primary">Skincare</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Community</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/suggest" className="block hover:text-primary">Suggest a Dupe</Link>
            <Link to="/search" className="block hover:text-primary">Browse All</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold mb-3">Account</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/profile" className="block hover:text-primary">My Profile</Link>
            <Link to="/favorites" className="block hover:text-primary">Favorites</Link>
            <Link to="/orders" className="block hover:text-primary">Orders</Link>
          </div>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © 2026 Fuzzy-Broccoli. All rights reserved.
      </div>
    </footer>
  );
}
