import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2, History } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockBacktestResults, mockEquityCurve } from "@/lib/mockData";
import { StatCardSkeleton, ChartSkeleton } from "@/components/ui/PageSkeleton";
import EmptyState from "@/components/ui/EmptyState";

const strategies = ["Moving Average Crossover", "RSI Mean Reversion", "MACD Momentum", "Bollinger Band Breakout"];

export default function Backtesting() {
  const [ran, setRan] = useState(false);
  const [loading, setLoading] = useState(false);
  const r = mockBacktestResults;

  const handleRun = () => {
    setLoading(true);
    setTimeout(() => {
      setRan(true);
      setLoading(false);
    }, 1500);
  };

  const metrics = [
    { label: "Sharpe Ratio", value: r.sharpeRatio.toFixed(2), good: r.sharpeRatio > 1 },
    { label: "Max Drawdown", value: `${r.maxDrawdown}%`, good: false },
    { label: "Win Rate", value: `${r.winRate}%`, good: r.winRate > 50 },
    { label: "CAGR", value: `${r.cagr}%`, good: true },
    { label: "Total Trades", value: r.totalTrades.toString(), good: true },
    { label: "Profit Factor", value: r.profitFactor.toFixed(1), good: r.profitFactor > 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">Backtesting</h1>
        <p className="text-muted-foreground text-sm">Test trading strategies against historical data</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 items-end">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Strategy</label>
            <Select defaultValue={strategies[0]}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {strategies.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Start Date</label>
            <Input type="date" defaultValue="2024-01-01" className="bg-secondary border-border text-foreground" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">End Date</label>
            <Input type="date" defaultValue="2024-12-31" className="bg-secondary border-border text-foreground" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Initial Capital</label>
            <Input type="number" defaultValue="100000" className="bg-secondary border-border text-foreground font-mono" />
          </div>
          <Button onClick={handleRun} disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 h-10">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            {loading ? "Running..." : "Run Backtest"}
          </Button>
        </div>
      </motion.div>

      {loading && (
        <div className="space-y-4">
          <StatCardSkeleton count={6} />
          <ChartSkeleton height={300} />
        </div>
      )}

      {!ran && !loading && (
        <EmptyState
          icon={History}
          title="No Backtest Results"
          description="Configure a strategy above and click Run Backtest to analyze performance against historical data."
        />
      )}

      {ran && !loading && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {metrics.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card text-center">
                <span className="stat-label text-xs">{m.label}</span>
                <span className={`stat-value text-lg md:text-2xl ${m.good ? "text-gain" : "text-loss"}`}>{m.value}</span>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
            <h3 className="section-title text-foreground mb-4">Performance Chart</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockEquityCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 18%)" />
                <XAxis dataKey="date" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: "hsl(222, 41%, 10%)", border: "1px solid hsl(222, 20%, 18%)", borderRadius: 8, color: "hsl(210, 20%, 93%)" }} />
                <Line type="monotone" dataKey="value" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={false} name="Strategy" />
                <Line type="monotone" dataKey="benchmark" stroke="hsl(215, 15%, 55%)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Benchmark" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
            <h3 className="section-title text-foreground mb-4">Trade History</h3>
            <div className="overflow-x-auto -mx-5 px-5">
              <table className="w-full text-sm min-w-[650px]">
                <thead>
                  <tr className="text-left text-muted-foreground border-b border-border">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Symbol</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Entry</th>
                    <th className="pb-3 font-medium">Exit</th>
                    <th className="pb-3 font-medium">P&L</th>
                    <th className="pb-3 font-medium">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {r.trades.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 text-muted-foreground">{t.date}</td>
                      <td className="py-3 font-mono font-semibold text-foreground">{t.symbol}</td>
                      <td className="py-3"><span className={`signal-badge-${t.type === "LONG" ? "buy" : "sell"}`}>{t.type}</span></td>
                      <td className="py-3 font-mono text-foreground">${t.entry.toFixed(2)}</td>
                      <td className="py-3 font-mono text-foreground">${t.exit.toFixed(2)}</td>
                      <td className={`py-3 font-mono ${t.pnl >= 0 ? "text-gain" : "text-loss"}`}>{t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}</td>
                      <td className={`py-3 font-mono ${t.pnlPercent >= 0 ? "text-gain" : "text-loss"}`}>{t.pnlPercent >= 0 ? "+" : ""}{t.pnlPercent.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
