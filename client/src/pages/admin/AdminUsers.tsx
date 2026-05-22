import { User, Shield, Star, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const mockUsers = [
  { id: "1", name: "Sarah Mitchell", email: "sarah.m@email.com", role: "user", reviews: 12, suggestions: 3, joined: "2026-01-15" },
  { id: "2", name: "Alex Kim", email: "alex.k@email.com", role: "moderator", reviews: 45, suggestions: 8, joined: "2025-11-20" },
  { id: "3", name: "Jordan Lee", email: "jordan.l@email.com", role: "user", reviews: 7, suggestions: 2, joined: "2026-03-01" },
  { id: "4", name: "Mia Thompson", email: "mia.t@email.com", role: "admin", reviews: 0, suggestions: 0, joined: "2025-06-10" },
  { id: "5", name: "Taylor Reed", email: "taylor.r@email.com", role: "user", reviews: 23, suggestions: 5, joined: "2026-02-14" },
  { id: "6", name: "Casey Park", email: "casey.p@email.com", role: "user", reviews: 3, suggestions: 1, joined: "2026-04-01" },
];

const roleColors: Record<string, string> = {
  admin: "bg-primary text-primary-foreground",
  moderator: "bg-accent text-accent-foreground",
  user: "",
};

const AdminUsers = () => {
  const [search, setSearch] = useState("");
  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">{mockUsers.length} registered users</p>
      </div>

      <div className="relative mb-6">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Reviews</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Suggestions</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`capitalize text-xs ${roleColors[u.role]}`}>
                      {u.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                      {u.role === "moderator" && <Star className="h-3 w-3 mr-1" />}
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{u.reviews}</td>
                  <td className="px-4 py-3">{u.suggestions}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
