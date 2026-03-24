import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    apiKey: ""
  });

  const [message, setMessage] = useState("");
  
  useEffect(() => {
    fetch("http://localhost:5000/api/user")
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => {
        console.log(err);
        setMessage("⚠️ Failed to load user data");
      });
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      if (res.ok) {
        setMessage("✅ Settings saved successfully!");
      } else {
        setMessage("❌ Failed to save settings");
      }
    } catch (error) {
      setMessage("⚠️ Server error");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Alert Message */}
      {message && (
        <div className="bg-green-500 text-white p-2 rounded">
          {message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
        <p className="text-muted-foreground">Configure your account and preferences</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card space-y-4">
        <h3 className="section-title text-foreground">Profile</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
            <Input 
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="bg-secondary border-border text-foreground"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
            <Input 
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="bg-secondary border-border text-foreground"
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

      {/* API Keys */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.05 }} 
        className="glass-card space-y-4"
      >
        <h3 className="section-title text-foreground">API Configuration</h3>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">API Key</label>
          <Input 
            type="password"
            value={user.apiKey}
            onChange={(e) => setUser({ ...user, apiKey: e.target.value })}
            className="bg-secondary border-border text-foreground font-mono"
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Data Provider</label>
          <Select defaultValue="alpha_vantage">
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="alpha_vantage">Alpha Vantage</SelectItem>
              <SelectItem value="polygon">Polygon.io</SelectItem>
              <SelectItem value="yahoo">Yahoo Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Risk */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }} 
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
          <span className="text-sm text-muted-foreground">Enable stop-loss automation</span>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Auto-rebalance portfolio</span>
          <Switch />
        </div>

      </motion.div>
    </div>
  );
}
