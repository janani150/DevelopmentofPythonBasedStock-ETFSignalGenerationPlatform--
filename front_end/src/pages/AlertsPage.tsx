import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MessageSquare, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockAlerts } from "@/lib/mockData";
import EmptyState from "@/components/ui/EmptyState";

export default function AlertsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [slackEnabled, setSlackEnabled] = useState(true);

  const channels = [
    { label: "Email Alerts", icon: Mail, enabled: emailEnabled, toggle: setEmailEnabled },
    { label: "SMS Alerts", icon: MessageSquare, enabled: smsEnabled, toggle: setSmsEnabled },
    { label: "Slack Alerts", icon: Bell, enabled: slackEnabled, toggle: setSlackEnabled },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">Alerts</h1>
          <p className="text-muted-foreground text-sm">Configure real-time trading alerts</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" /> New Alert
        </Button>
      </div>

      {/* Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {channels.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <c.icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground text-sm md:text-base">{c.label}</span>
            </div>
            <Switch checked={c.enabled} onCheckedChange={c.toggle} />
          </motion.div>
        ))}
      </div>

      {/* Alert Builder */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card">
        <h3 className="section-title text-foreground mb-4">Alert Condition Builder</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-end">
          <Input placeholder="Symbol (e.g. AAPL)" className="bg-secondary border-border text-foreground font-mono" />
          <Select defaultValue="price_above">
            <SelectTrigger className="bg-secondary border-border text-foreground"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="price_above">Price Above</SelectItem>
              <SelectItem value="price_below">Price Below</SelectItem>
              <SelectItem value="rsi_above">RSI Above</SelectItem>
              <SelectItem value="rsi_below">RSI Below</SelectItem>
              <SelectItem value="macd_cross">MACD Crossover</SelectItem>
            </SelectContent>
          </Select>
          <Input type="number" placeholder="Value" className="bg-secondary border-border text-foreground font-mono" />
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10">Create Alert</Button>
        </div>
      </motion.div>

      {/* Active Alerts */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
        <h3 className="section-title text-foreground mb-4">Active Alerts</h3>
        {mockAlerts.length === 0 ? (
          <EmptyState icon={Bell} title="No active alerts" description="Create your first alert using the builder above." />
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm min-w-[550px]">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Symbol</th>
                  <th className="pb-3 font-medium">Condition</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Created</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {mockAlerts.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 font-mono font-semibold text-foreground">{a.symbol}</td>
                    <td className="py-3 text-foreground">{a.condition}</td>
                    <td className="py-3 text-muted-foreground capitalize">{a.type}</td>
                    <td className="py-3">
                      <span className={`signal-badge-${a.status === "active" ? "buy" : a.status === "triggered" ? "hold" : "sell"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{a.createdAt}</td>
                    <td className="py-3">
                      <button className="text-muted-foreground hover:text-loss transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
