import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Users, FileText, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Audit Logs",
    href: "/admin/audit",
    icon: FileText,
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-indigo-50/40 border-r h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">AgeninLite Admin</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-medium"
                  : "text-slate-600 hover:bg-indigo-100/50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500"}`} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-indigo-100">
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">Super Admin</p>
          </div>
          <button className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-slate-100">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
