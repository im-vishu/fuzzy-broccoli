import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allBrands = [...new Set(products.map((p) => p.brand))].sort();
const maxPrice = Math.ceil(Math.max(...products.map((p) => p.price)));

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"price" | "rating" | "savings">("savings");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [selectedBrand, setSelectedBrand] = useState("all");

  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.originalProduct?.toLowerCase().includes(query.toLowerCase()) ||
        p.originalBrand?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchesBrand = selectedBrand === "all" || p.brand === selectedBrand;
      return matchesQuery && matchesCategory && matchesPrice && matchesBrand;
    });

    result.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return (b.savings ?? 0) - (a.savings ?? 0);
    });

    return result;
  }, [query, activeCategory, sortBy, priceRange, selectedBrand]);

  const hasActiveFilters = selectedBrand !== "all" || priceRange[0] > 0 || priceRange[1] < maxPrice;

  const clearFilters = () => {
    setSelectedBrand("all");
    setPriceRange([0, maxPrice]);
    setActiveCategory("All");
    setQuery("");
  };

  return (
    <div className="container py-8">
      <div className="space-y-2 mb-8">
        <h1 className="font-display text-3xl font-bold">Find Your Dupe</h1>
        <p className="text-muted-foreground">Search by product name, brand, or original product</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dupes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["savings", "price", "rating"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={sortBy === s ? "default" : "outline"}
              onClick={() => setSortBy(s)}
              className="capitalize"
            >
              {s === "savings" ? "Best Savings" : s === "price" ? "Lowest Price" : "Top Rated"}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-lg border bg-card">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Price Range: ${priceRange[0]} – ${priceRange[1]}</label>
          <Slider
            min={0}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={(v) => setPriceRange(v as [number, number])}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48 space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {allBrands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="self-end">
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <SlidersHorizontal className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No dupes found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} products found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
