import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Lightbulb, Users, PlusCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Add Product", path: "/admin/add-product", icon: PlusCircle },
  { label: "Submissions", path: "/admin/submissions", icon: Lightbulb },
  { label: "Users", path: "/admin/users", icon: Users },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r bg-sidebar-background p-4 gap-1">
        <div className="flex items-center gap-2 px-3 py-2 mb-4">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-bold">Admin Panel</span>
        </div>
        {adminLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              location.pathname === link.path
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
        <div className="mt-auto">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Store
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden w-full">
        <div className="flex overflow-x-auto border-b bg-sidebar-background p-2 gap-1">
          {adminLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                location.pathname === link.path
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
