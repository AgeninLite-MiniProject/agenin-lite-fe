import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ArrowLeftRight,
  Clock,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

const menuItems = [
  { label: "Home", path: "/dashboard" },
  { label: "Downline", path: "/downline" },
  { label: "Transaksi", path: "/transaksi" },
  { label: "Riwayat", path: "/riwayat" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const userName = useAuthStore((state) => state.name) || "Agent";
  const userInitials = userName.substring(0, 2).toUpperCase();
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT — Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img
            src="/src/assets/ageninliteBlue.webp"
            alt="AgeninLite Logo"
            className="h-6"
          />
        </Link>

        {/* CENTER — Menu */}
        <nav className="flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "inline-block font-heading text-sm font-medium transition-colors",
                isActive(item.path)
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "border-b-2 border-transparent pb-1 text-muted-foreground hover:border-primary/30 hover:text-primary",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT — Bell + Avatar */}
        <div className="flex items-center gap-4">
          {/* Avatar + name dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full px-2 py-1 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="size-8">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0D8ABC&color=fff`}
                  alt={userName}
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                {userName}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profil")}>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                {isLoggingOut ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin size-4 text-destructive" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Keluar...
                  </span>
                ) : (
                  <>
                    <LogOut className="size-4" />
                    Logout
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
