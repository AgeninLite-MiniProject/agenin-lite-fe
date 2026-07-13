import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, FileText, LogOut } from "lucide-react";
import logoAgeninLite from "../../../assets/ageninliteBlue.webp";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/axios";

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
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient.post('/api/auth/logout', { refresh_token: refreshToken });
    } catch (error) {
      console.warn("Logout API failed, but clearing local state anyway");
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
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
            disabled={isLoggingOut}
            className="text-slate-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
            title="Logout"
          >
            {isLoggingOut ? (
              <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <LogOut className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
