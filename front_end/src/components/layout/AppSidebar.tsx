import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Brain,
  History,
  PieChart,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  X,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Signal Engine", path: "/dashboard/signals", icon: Brain },
  { title: "Backtesting", path: "/dashboard/backtest", icon: History },
  { title: "Portfolio Analytics", path: "/dashboard/portfolio", icon: PieChart },
  { title: "Alerts", path: "/dashboard/alerts", icon: Bell },
  { title: "Market Data", path: "/dashboard/market", icon: BarChart3 },
  { title: "Settings", path: "/dashboard/settings", icon: Settings },
];

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarContent = (isMobile: boolean) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        {(isMobile || !collapsed) && (
          <span className="font-bold text-foreground whitespace-nowrap">SignalAI</span>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="ml-auto text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? onMobileClose : undefined}
              className="block"
            >
              <div className={`nav-item ${isActive ? "active" : ""}`}>
                <item.icon className="w-5 h-5 shrink-0" />
                {(isMobile || !collapsed) && (
                  <span className="whitespace-nowrap">{item.title}</span>
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle - desktop only */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden md:flex fixed left-0 top-0 h-screen z-40 flex-col border-r border-border bg-sidebar overflow-hidden"
      >
        {sidebarContent(false)}
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="fixed left-0 top-0 h-screen w-[280px] z-50 flex flex-col border-r border-border bg-sidebar md:hidden"
            >
              {sidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
