import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ArrowLeftRight,
  Clock,
  User,
  Bell,
  ChevronDown,
  Settings,
  HelpCircle,
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

const menuItems = [
  { label: "Home", path: "/dashboard", icon: Home },
  { label: "Downline", path: "/downline", icon: Users },
  { label: "Transaksi", path: "/transaksi", icon: ArrowLeftRight },
  { label: "Riwayat", path: "/riwayat", icon: Clock },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT — Logo (text only) */}
        <Link
          to="/dashboard"
          className="font-heading text-lg font-bold text-primary"
        >
          AgeninLite
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
                  : "border-b-2 border-transparent pb-1 text-foreground hover:border-primary/30 hover:text-primary",
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
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Budi Santoso"
                />
                <AvatarFallback>BS</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                Budi Santoso
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
