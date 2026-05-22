import { ShoppingBag, Package, Truck, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mockOrders = [
  {
    id: "ORD-001",
    date: "2026-04-10",
    status: "delivered",
    items: [
      { name: "Velvet Matte Lip Cream", brand: "Fuzzy-Broccoli Picks", price: 8.99, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=100&h=100&fit=crop" },
      { name: "Glow Serum Foundation", brand: "e.l.f.", price: 6.00, image: "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=100&h=100&fit=crop" },
    ],
    total: 14.99,
  },
  {
    id: "ORD-002",
    date: "2026-04-05",
    status: "shipped",
    items: [
      { name: "Lash Paradise Mascara", brand: "L'Oréal", price: 11.99, image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=100&h=100&fit=crop" },
    ],
    total: 11.99,
  },
  {
    id: "ORD-003",
    date: "2026-03-28",
    status: "delivered",
    items: [
      { name: "Hydrating Facial Cleanser", brand: "CeraVe", price: 14.99, image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&h=100&fit=crop" },
      { name: "Niacinamide 10% + Zinc 1%", brand: "The Ordinary", price: 5.90, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop" },
    ],
    total: 20.89,
  },
];

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  processing: { label: "Processing", icon: Package, color: "text-muted-foreground" },
  shipped: { label: "Shipped", icon: Truck, color: "text-accent" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "text-primary" },
};

const Orders = () => {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">My Orders</h1>
          <p className="text-sm text-muted-foreground">{mockOrders.length} orders</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockOrders.map((order) => {
          const config = statusConfig[order.status];
          return (
            <div key={order.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <Badge variant="outline" className={`gap-1 ${config.color}`}>
                  <config.icon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              <div className="space-y-3 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                    </div>
                    <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-sm font-medium">Total: <span className="font-display text-lg">${order.total.toFixed(2)}</span></p>
                <Link to="/search">
                  <Button variant="outline" size="sm">Reorder</Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
