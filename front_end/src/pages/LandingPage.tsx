import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Activity, BarChart3, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import MarketTicker from "@/components/dashboard/MarketTicker";

const features = [
  { icon: Zap, title: "AI Signal Generation", desc: "ML-powered BUY/SELL signals with confidence scores" },
  { icon: Activity, title: "Real-Time Backtesting", desc: "Test strategies against historical data instantly" },
  { icon: Bell, title: "Smart Alerts", desc: "Custom alerts via email, SMS, and Slack" },
  { icon: BarChart3, title: "Performance Analytics", desc: "Deep portfolio analytics with risk metrics" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MarketTicker />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 h-16 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">SignalAI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log In</Button>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 relative overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />

        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: "hsl(var(--primary))" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="signal-badge-buy mb-6 mx-auto w-fit">
            <TrendingUp className="w-4 h-4" />
            AI-Powered Trading Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
            Smart Trading Signals for{" "}
            <span className="glow-text">Stocks & ETFs</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Harness machine learning to generate actionable BUY, SELL, and HOLD signals. 
            Backtest strategies, monitor performance, and stay ahead of the market.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base h-12 animate-pulse-glow">
                Start Trading Smarter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary px-8 text-base h-12">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass-card-hover text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        © 2026 SignalAI. AI-Powered Stock & ETF Signal Platform.
      </footer>
    </div>
  );
}
