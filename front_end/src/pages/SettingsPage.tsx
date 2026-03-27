import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";

export default function SettingsPage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    const name = localStorage.getItem("userName") || "";
    setUser({ name, email });
  }, []);

  const handleSave = async () => {
    try {
      const email = localStorage.getItem("userEmail") || "";
      const res = await fetch(`${API_BASE}/api/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: user.name }),
      });
      if (res.ok) {
        localStorage.setItem("userName", user.name);
        setMessage("✅ Settings saved successfully!");
      } else {
        setMessage("❌ Failed to save settings");
      }
    } catch {
      setMessage("⚠️ Server error");
    }
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {message && (
        <div className="bg-green-500 text-white p-2 rounded">{message}</div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">
          Configure your account and preferences
        </p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card space-y-4"
      >
        <h3 className="section-title text-foreground">Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Full Name
            </label>
            <Input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="bg-secondary border-border text-foreground"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Email
            </label>
            <Input
              value={user.email}
              readOnly
              className="bg-secondary border-border text-foreground opacity-70 cursor-not-allowed"
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Save Changes
        </Button>
      </motion.div>

      {/* API Configuration block removed — app uses yfinance, no API key required */}

      {/* Risk Tolerance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-card space-y-4"
      >
        <h3 className="section-title text-foreground">Risk Tolerance</h3>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Conservative</span>
            <span className="text-muted-foreground">Aggressive</span>
          </div>
          <Slider defaultValue={[60]} max={100} step={1} className="w-full" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Enable stop-loss automation
          </span>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Auto-rebalance portfolio
          </span>
          <Switch />
        </div>
      </motion.div>
    </div>
  );
}
