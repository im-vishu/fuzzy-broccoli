import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Submission {
  id: string;
  user: string;
  originalBrand: string;
  originalProduct: string;
  originalPrice: number;
  dupeBrand: string;
  dupeProduct: string;
  dupePrice: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

const initialSubmissions: Submission[] = [
  { id: "1", user: "Sarah M.", originalBrand: "MAC", originalProduct: "Ruby Woo", originalPrice: 22, dupeBrand: "Revlon", dupeProduct: "Fire & Ice", dupePrice: 8.99, reason: "Almost identical shade and matte finish.", status: "pending", date: "2026-04-10" },
  { id: "2", user: "Alex K.", originalBrand: "NARS", originalProduct: "Orgasm Blush", originalPrice: 38, dupeBrand: "Milani", dupeProduct: "Baked Blush Luminoso", dupePrice: 9.49, reason: "Same golden shimmer and peach tone.", status: "approved", date: "2026-04-09" },
  { id: "3", user: "Jordan L.", originalBrand: "Drunk Elephant", originalProduct: "Protini Polypeptide Cream", originalPrice: 68, dupeBrand: "CeraVe", dupeProduct: "Moisturizing Cream", dupePrice: 16.99, reason: "Similar ceramide-rich formula.", status: "pending", date: "2026-04-08" },
  { id: "4", user: "Mia T.", originalBrand: "Charlotte Tilbury", originalProduct: "Pillow Talk Lipstick", originalPrice: 35, dupeBrand: "Revlon", dupeProduct: "Pink in the Afternoon", dupePrice: 7.99, reason: "Nearly identical nude pink shade.", status: "rejected", date: "2026-04-07" },
  { id: "5", user: "Taylor R.", originalBrand: "Tom Ford", originalProduct: "Lost Cherry", originalPrice: 390, dupeBrand: "Zara", dupeProduct: "Red Temptation", dupePrice: 25.90, reason: "Very close cherry-almond scent profile.", status: "pending", date: "2026-04-06" },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, variant: "outline" as const },
  approved: { label: "Approved", icon: CheckCircle, variant: "default" as const },
  rejected: { label: "Rejected", icon: XCircle, variant: "destructive" as const },
};

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered = filter === "all" ? submissions : submissions.filter((s) => s.status === filter);

  const updateStatus = (id: string, status: "approved" | "rejected") => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Submissions</h1>
        <p className="text-sm text-muted-foreground">Review community dupe suggestions</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            className="capitalize"
            onClick={() => setFilter(f)}
          >
            {f} {f !== "all" && `(${submissions.filter((s) => s.status === f).length})`}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((sub) => {
          const config = statusConfig[sub.status];
          return (
            <div key={sub.id} className="rounded-xl border bg-card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium">{sub.user} <span className="text-muted-foreground">· {sub.date}</span></p>
                </div>
                <Badge variant={config.variant} className="capitalize gap-1 text-xs">
                  <config.icon className="h-3 w-3" />
                  {config.label}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Original</p>
                  <p className="text-sm font-medium">{sub.originalBrand} — {sub.originalProduct}</p>
                  <p className="text-xs text-muted-foreground">${sub.originalPrice.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-primary/5 p-3 border border-primary/10">
                  <p className="text-xs text-primary mb-1">Dupe</p>
                  <p className="text-sm font-medium">{sub.dupeBrand} — {sub.dupeProduct}</p>
                  <p className="text-xs text-primary font-medium">${sub.dupePrice.toFixed(2)} · Save ${(sub.originalPrice - sub.dupePrice).toFixed(2)}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic">"{sub.reason}"</p>
              {sub.status === "pending" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateStatus(sub.id, "approved")} className="gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateStatus(sub.id, "rejected")} className="gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSubmissions;
