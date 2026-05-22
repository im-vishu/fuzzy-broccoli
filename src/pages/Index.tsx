import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { motion } from "framer-motion";

const Index = () => {
  const featured = products.slice(0, 8);
  const topSavings = [...products].sort((a, b) => (b.savings ?? 0) - (a.savings ?? 0)).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-primary py-24 md:py-32">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Beauty Dupes Marketplace
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
              Look Expensive.<br />
              <span className="italic">Spend Less.</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-lg">
              Discover affordable alternatives to your favorite high-end beauty products. Community-curated, expert-verified.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/search">
                <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                  <Search className="h-4 w-4" />
                  Browse Dupes
                </Button>
              </Link>
              <Link to="/suggest">
                <Button size="lg" variant="secondary" className="gap-2 font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Suggest a Dupe
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b">
        <div className="container grid grid-cols-2 md:grid-cols-4 divide-x">
          {[
            { label: "Products", value: "500+" },
            { label: "Avg Savings", value: "68%" },
            { label: "Community Members", value: "12K" },
            { label: "Dupes Verified", value: "320" },
          ].map((stat) => (
            <div key={stat.label} className="py-6 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold">Trending Dupes</h2>
            <p className="text-sm text-muted-foreground mt-1">Community favorites this week</p>
          </div>
          <Link to="/search" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Biggest Savings */}
      <section className="bg-muted/40 py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-5 w-5 text-primary" />
                <h2 className="font-display text-2xl font-bold">Biggest Savings</h2>
              </div>
              <p className="text-sm text-muted-foreground">Maximum value, minimum price</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSavings.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto space-y-4"
        >
          <h2 className="font-display text-3xl font-bold">Know a Great Dupe?</h2>
          <p className="text-muted-foreground">Help the community save money by suggesting affordable alternatives to expensive beauty products.</p>
          <Link to="/suggest">
            <Button size="lg" className="gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90">
              <Sparkles className="h-4 w-4" /> Suggest a Dupe
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
