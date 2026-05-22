import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/products";

const AddProduct = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Product Added!", description: "The product has been added to the catalog." });
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="container py-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="font-display text-3xl font-bold">Add Product</h1>
        <p className="text-muted-foreground">Add a new dupe product to the catalog</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Product Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input placeholder="e.g. Velvet Matte Lip Cream" required />
            </div>
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input placeholder="e.g. NYX" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" placeholder="9.99" required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select required>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== "All").map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the product..." rows={3} required />
          </div>
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input placeholder="https://..." required />
          </div>
          <div className="space-y-2">
            <Label>Tags (comma-separated)</Label>
            <Input placeholder="matte, long-lasting, cruelty-free" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Original Product (Optional)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Original Brand</Label>
              <Input placeholder="e.g. MAC" />
            </div>
            <div className="space-y-2">
              <Label>Original Product Name</Label>
              <Input placeholder="e.g. Retro Matte Lipstick" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Original Price ($)</Label>
            <Input type="number" step="0.01" placeholder="25.00" />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
