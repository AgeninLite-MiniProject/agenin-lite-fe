import { Outlet, Link, useLocation } from "react-router-dom"
import Navbar, { menuItems } from "./Navbar"
import Footer from "./Footer"
import { cn } from "@/lib/utils";

const MainLayout = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen h-[100dvh] flex-col bg-background overflow-hidden relative">
        <div className="shrink-0">
          <Navbar/>
        </div>
        
        <main className="flex-1 flex flex-col overflow-y-auto pb-[76px] md:pb-0">
            <div className="flex-1 flex flex-col">
              <Outlet/>
            </div>
            <div className="shrink-0 mt-auto hidden md:block">
              <Footer/>
            </div>
        </main>

        {/* MOBILE BOTTOM NAVIGATION */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] bg-white border-t border-border flex items-center justify-around h-[68px] shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 px-1 transition-all",
                  active ? "text-primary" : "text-slate-400 hover:text-primary/70"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center p-1.5 rounded-full transition-all",
                  active ? "bg-transparent" : "bg-transparent"
                )}>
                  <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[10px] md:text-xs font-semibold tracking-wide truncate w-full text-center",
                  active ? "font-bold" : "font-medium"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
    </div>
  )
}

export default MainLayout