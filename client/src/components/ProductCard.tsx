import { Link } from "react-router-dom";
import { Star, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/data/products";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="overflow-hidden rounded-lg bg-card shadow-sm transition-shadow hover:shadow-md" style={{ boxShadow: "var(--card-shadow)" }}>
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.savings && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground gap-1">
                <TrendingDown className="h-3 w-3" />
                Save ${product.savings.toFixed(0)}
              </Badge>
            )}
          </div>
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {product.brand}
            </p>
            <h3 className="font-display text-base font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.originalProduct && (
              <p className="text-xs text-muted-foreground">
                Dupe for{" "}
                <span className="font-medium">{product.originalBrand} {product.originalProduct}</span>
              </p>
            )}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-foreground">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                <span>{product.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
