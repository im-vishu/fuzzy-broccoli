import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { categories } from "@/data/products";

const SuggestDupe = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({ title: "Dupe Submitted!", description: "Thanks for helping the community. We'll review your suggestion." });
  };

  if (submitted) {
    return (
      <div className="container py-20 text-center max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">Thank You!</h1>
        <p className="text-muted-foreground mb-6">Your dupe suggestion has been submitted for review. We'll notify you once it's approved.</p>
        <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another</Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="space-y-2 mb-8">
        <h1 className="font-display text-3xl font-bold">Suggest a Dupe</h1>
        <p className="text-muted-foreground">Know an affordable alternative? Share it with the community!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Original Product</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input placeholder="e.g. Charlotte Tilbury" required />
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input placeholder="e.g. Pillow Talk Lipstick" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input type="number" placeholder="35.00" step="0.01" required />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">The Dupe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input placeholder="e.g. Revlon" required />
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input placeholder="e.g. Super Lustrous Lipstick" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" placeholder="8.99" step="0.01" required />
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
            <Label>Why is this a good dupe?</Label>
            <Textarea placeholder="Describe the similarity in formula, finish, shade, etc." rows={4} required />
          </div>
          <div className="space-y-2">
            <Label>Image URL (optional)</Label>
            <Input placeholder="https://..." />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90">
          <Send className="h-4 w-4" /> Submit Dupe
        </Button>
      </form>
    </div>
  );
};

export default SuggestDupe;
