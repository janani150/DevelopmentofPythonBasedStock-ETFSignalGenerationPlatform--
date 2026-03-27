import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";
import { Search, Bell, Menu, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import LiveClock from "@/components/ui/LiveClock";

interface TopNavbarProps {
  onMenuToggle?: () => void;
}

interface Notification {
  _id: string;
  symbol: string;
  condition: string;
  target: number;
  live_price: number;
  message: string;
  read: boolean;
  triggeredAt: string;
}

export default function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // ✅ Fetch real triggered notifications from backend
  const fetchNotifications = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(
        `${API_BASE}/api/alerts/notifications/${userEmail}`,
      );
      const data = await res.json();
      if (data.status === "success") {
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count);
      }
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // ✅ Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userEmail]);

  // ✅ Mark all as read when bell is opened
  const handleBellOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      try {
        await fetch(`${API_BASE}/api/alerts/notifications/${userEmail}/read`, {
          method: "POST",
        });
        setUnreadCount(0);
        // Update local state to mark all as read
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (e) {
        console.error("Failed to mark notifications as read:", e);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-14 md:h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 gap-3">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden text-muted-foreground hover:text-foreground shrink-0"
        onClick={onMenuToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Search bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground h-9 md:h-10 text-sm"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <LiveClock />

        {/* ✅ Real Notifications Bell */}
        <Popover open={open} onOpenChange={handleBellOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-foreground h-9 w-9"
            >
              <Bell className="w-5 h-5" />
              {/* ✅ Real unread count badge */}
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0" align="end">
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="text-xs text-primary font-medium">
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Alerts will appear here when triggered
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => {
                      navigate("/dashboard/alerts");
                      setOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-secondary/50 transition-colors flex items-start gap-2 border-b border-border/30 last:border-0"
                  >
                    {/* Unread dot */}
                    {!n.read ? (
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    ) : (
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        🔔 {n.symbol} Alert Triggered!
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {n.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {n.triggeredAt}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-border">
              <button
                onClick={() => {
                  navigate("/dashboard/alerts");
                  setOpen(false);
                }}
                className="w-full text-xs text-primary hover:underline text-center py-1"
              >
                View all alerts →
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
              <Settings className="w-4 h-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-loss focus:text-loss"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
