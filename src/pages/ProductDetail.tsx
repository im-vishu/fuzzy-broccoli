import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, TrendingDown, ShoppingBag, Heart, Share2, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const product = products.find((p) => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Link to="/search">
          <Button variant="outline" className="mt-4">Back to Search</Button>
        </Link>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({ title: "Added to cart!", description: `${product.name} × ${quantity}` });
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate("/cart");
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/search" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
          <div className="aspect-square rounded-xl overflow-hidden bg-muted">
            <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{product.brand}</p>
            <h1 className="font-display text-3xl font-bold mt-1">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Dupe Info */}
          {product.originalProduct && (
            <div className="rounded-lg bg-muted/60 p-4 space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Dupe for</p>
              <p className="font-medium">{product.originalBrand} — {product.originalProduct}</p>
              <p className="text-sm text-muted-foreground">Original price: ${product.originalPrice?.toFixed(2)}</p>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
            {product.savings && (
              <Badge className="bg-primary text-primary-foreground gap-1">
                <TrendingDown className="h-3 w-3" /> Save ${product.savings.toFixed(0)}
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Highlights */}
          {product.highlights && (
            <div className="space-y-2">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">Highlights</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Details */}
          <div className="space-y-2 text-sm border-t border-border pt-4">
            {product.size && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">{product.size}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">{product.category}</span>
            </div>
            {product.ingredients && (
              <div>
                <span className="text-muted-foreground">Key Ingredients</span>
                <p className="text-xs text-muted-foreground/70 mt-1">{product.ingredients}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">{tag}</Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button size="lg" onClick={handleBuyNow} className="flex-1 gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90">
              <ShoppingBag className="h-4 w-4" /> Buy Now
            </Button>
            <Button size="lg" variant="outline" onClick={handleAddToCart} className="flex-1 gap-2">
              Add to Cart
            </Button>
            <Button size="lg" variant="outline">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({ title: product.name, text: `Check out ${product.name} by ${product.brand} — only $${product.price.toFixed(2)}!`, url });
              } else {
                navigator.clipboard.writeText(url);
                toast({ title: "Link copied!", description: "Product link copied to clipboard." });
              }
            }}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-bold mb-6">Ratings & Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-2 p-6 rounded-xl bg-muted/40">
            <p className="font-display text-5xl font-bold">{product.rating}</p>
            <div className="flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{product.reviews.toLocaleString()} reviews</p>
          </div>
          <div className="md:col-span-2 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = star === Math.round(product.rating) ? 55 : star === Math.round(product.rating) - 1 ? 25 : star === Math.round(product.rating) + 1 ? 12 : star >= 4 ? 5 : 3;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm w-8 text-right text-muted-foreground">{star}★</span>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm w-10 text-muted-foreground">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sample Reviews */}
        <div className="mt-8 space-y-4">
          {[
            { name: "Sarah M.", rating: 5, date: "2 weeks ago", text: `Absolutely love this ${product.name}! It's just as good as the expensive version. Will definitely repurchase.` },
            { name: "Jessica L.", rating: 4, date: "1 month ago", text: "Great quality for the price. I've been using it daily and it performs really well. Slight difference in texture from the original but still amazing value." },
            { name: "Emma K.", rating: 5, date: "3 weeks ago", text: "Can't believe how good this dupe is! My friends couldn't tell the difference. Saved so much money." },
          ].map((review, i) => (
            <div key={i} className="p-4 rounded-lg bg-card border border-border space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {review.name[0]}
                  </div>
                  <span className="font-medium text-sm">{review.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-accent text-accent" : "text-muted"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">Similar Dupes You'll Love</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
