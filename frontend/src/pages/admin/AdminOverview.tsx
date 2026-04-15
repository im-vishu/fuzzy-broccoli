import { Link } from "react-router-dom";
import { Package, Users, TrendingUp, Plus, Eye, Trash2, Edit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";

const stats = [
  { label: "Total Products", value: "48", icon: Package, trend: "+12%" },
  { label: "Total Users", value: "1,234", icon: Users, trend: "+8%" },
  { label: "Dupes Submitted", value: "89", icon: Sparkles, trend: "+23%" },
  { label: "Revenue", value: "$4,521", icon: TrendingUp, trend: "+15%" },
];

const recentSubmissions = [
  { user: "Sarah M.", original: "MAC Ruby Woo", dupe: "Revlon Fire & Ice", status: "pending" },
  { user: "Alex K.", original: "NARS Orgasm Blush", dupe: "Milani Baked Blush", status: "approved" },
  { user: "Jordan L.", original: "Drunk Elephant Protini", dupe: "CeraVe Moisturizing Cream", status: "pending" },
];

const AdminOverview = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store</p>
        </div>
        <Link to="/admin/add-product">
          <Button className="gap-2 gradient-primary text-primary-foreground border-0 hover:opacity-90">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium text-primary">{stat.trend}</span>
            </div>
            <p className="font-display text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Recent Products</h2>
            <Link to="/admin/products" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.brand} · ${p.price}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Dupe Submissions</h2>
            <Link to="/admin/submissions" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.map((sub, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{sub.user}</p>
                  <Badge variant={sub.status === "approved" ? "default" : "outline"} className="capitalize text-xs">
                    {sub.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="line-through">{sub.original}</span> → <span className="font-medium text-foreground">{sub.dupe}</span>
                </p>
                {sub.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" className="h-7 text-xs">Approve</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Reject</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
