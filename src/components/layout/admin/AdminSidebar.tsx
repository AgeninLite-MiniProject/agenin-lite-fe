import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, FileText, LogOut } from "lucide-react";
import logoAgeninLite from "@/assets/ageninliteBlue.webp";
import { useAuthStore } from "@/store/auth.store";

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
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-indigo-50/40 border-r h-full flex flex-col">
      <div className="p-6 pb-2 flex flex-col items-start gap-1">
        <img src={logoAgeninLite} alt="AgeninLite Logo" className="h-7 object-contain" />
        <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest pl-1">Admin</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
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
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-semibold text-slate-700 truncate">Super Admin</span>
          <button 
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-slate-100"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
