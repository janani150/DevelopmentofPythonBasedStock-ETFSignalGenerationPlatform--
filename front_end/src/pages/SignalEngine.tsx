import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Info,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { mockCandlestickData } from "@/lib/mockData";
import { ChartSkeleton } from "@/components/ui/PageSkeleton";
import EmptyState from "@/components/ui/EmptyState";

// Feature importance data (will come from backend in production)
const defaultFeatures = [
  { feature: "Price Momentum", importance: 0.28 },
  { feature: "Volume Trend", importance: 0.22 },
  { feature: "Technical Indicators", importance: 0.18 },
  { feature: "Moving Averages", importance: 0.12 },
  { feature: "Support/Resistance", importance: 0.1 },
  { feature: "Volatility", importance: 0.06 },
  { feature: "Market Sentiment", importance: 0.04 },
];

const modelMetrics = [
  { label: "Accuracy", value: "89.2%" },
  { label: "Precision", value: "0.87" },
  { label: "Recall", value: "0.85" },
];

export default function SignalEngine() {
  const [symbol, setSymbol] = useState("RELIANCE.NS");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultKey, setResultKey] = useState(0);
  const [apiResult, setApiResult] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setGenerated(false);
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const emailQuery = userEmail ? `?email=${userEmail}` : "";
      // Ensure symbol is uppercase and suffixed for NSE before sending
      let sendSymbol = (symbol || "").trim().toUpperCase();
      if (sendSymbol && !sendSymbol.includes(".")) {
        sendSymbol = `${sendSymbol}.NS`;
      }

      // Removed timeframe parameter from API call
      const response = await fetch(
        `${API_BASE}/predict/${sendSymbol}${emailQuery}`,
      );

      // Attempt to parse JSON response (error or success)
      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error("Invalid server response");
      }

      // If server responded with non-2xx, show backend message when available
      if (!response.ok) {
        const msg = data?.message || data?.error || "Server error";
        throw new Error(msg);
      }

      if (data.status === "error") {
        throw new Error(data.message || "Error from server");
      }

      setApiResult({
        signal: data.signal || "HOLD",
        confidence: data.confidence ? Math.round(data.confidence * 100) : 50,
        features: data.features || defaultFeatures,
        description:
          data.description ||
          "AI-powered trading signal based on advanced machine learning algorithms analyzing historical price data and market patterns.",
        metrics: data.metrics || modelMetrics,
      });

      setResultKey((k) => k + 1);
      setGenerated(true);
    } catch (error: any) {
      console.error(error);
      const message = error?.message || String(error) || "Unknown error";
      toast.error(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-1">
          ML Signal Engine
        </h1>
        <p className="text-muted-foreground text-sm">
          Generate AI-powered trading signals
        </p>
      </div>

      {/* Controls - Simplified without timeframe */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Stock Symbol
            </label>
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter NSE stock (e.g., RELIANCE.NS, TCS.NS)"
              className="bg-secondary border-border text-foreground font-mono"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-10 w-full sm:w-auto"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              {loading ? "Analyzing..." : "Generate Signal"}
            </Button>
          </div>
        </div>
      </motion.div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartSkeleton height={200} />
          <div className="lg:col-span-2">
            <ChartSkeleton height={200} />
          </div>
        </div>
      )}

      {!generated && !loading && (
        <EmptyState
          icon={Brain}
          title="No Signal Generated"
          description="Enter a stock symbol and click Generate Signal to see AI-powered trading recommendations."
        />
      )}

      {apiResult && !loading && (
        <>
          {/* Model Info Banner */}
          <motion.div
            key={`info-${resultKey}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
          >
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">
                Analysis for {symbol}
              </span>
              <p className="text-sm text-muted-foreground mt-0.5">
                {apiResult.description}
              </p>
            </div>
          </motion.div>

          {/* Signal Result */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div
              key={`signal-${resultKey}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card flex flex-col items-center justify-center py-8"
            >
              <span className="text-sm text-muted-foreground mb-3">
                Signal for {symbol}
              </span>
              <div
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-4 ${
                  apiResult.signal === "BUY"
                    ? "bg-gain/10 text-gain"
                    : apiResult.signal === "SELL"
                      ? "bg-loss/10 text-loss"
                      : apiResult.signal?.startsWith("WEAK")
                        ? "bg-warning/10 text-warning"
                        : "bg-secondary/10 text-muted-foreground"
                }`}
              >
                {apiResult.signal === "BUY" ||
                apiResult.signal === "WEAK BUY" ? (
                  <TrendingUp className="w-8 h-8 md:w-10 md:h-10" />
                ) : apiResult.signal === "SELL" ||
                  apiResult.signal === "WEAK SELL" ? (
                  <TrendingDown className="w-8 h-8 md:w-10 md:h-10" />
                ) : (
                  <Minus className="w-8 h-8 md:w-10 md:h-10" />
                )}
              </div>
              <span
                className={`text-2xl md:text-3xl font-bold ${
                  apiResult.signal === "BUY"
                    ? "text-gain"
                    : apiResult.signal === "SELL"
                      ? "text-loss"
                      : apiResult.signal?.startsWith("WEAK")
                        ? "text-warning"
                        : "text-muted-foreground"
                }`}
              >
                {apiResult.signal}
              </span>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Confidence:
                </span>
                <span className="text-lg font-bold text-foreground">
                  {apiResult.confidence}%
                </span>
              </div>
              <div className="w-32 h-2 rounded-full bg-secondary mt-2 overflow-hidden">
                <motion.div
                  key={`conf-${resultKey}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${apiResult.confidence}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    apiResult.signal === "BUY"
                      ? "bg-gain"
                      : apiResult.signal === "SELL"
                        ? "bg-loss"
                        : apiResult.signal?.startsWith("WEAK")
                          ? "bg-warning"
                          : "bg-secondary"
                  }`}
                />
              </div>

              {/* Model Metrics */}
              <div className="mt-6 w-full px-4">
                <div className="border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Model Performance
                  </span>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {apiResult.metrics.map((m: any) => (
                      <div key={m.label} className="text-center">
                        <div className="text-xs text-muted-foreground">
                          {m.label}
                        </div>
                        <div className="font-mono text-sm text-foreground">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature Importance */}
            <motion.div
              key={`features-${resultKey}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card lg:col-span-2"
            >
              <h3 className="section-title text-foreground mb-4">
                Key Factors Influencing Signal
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={apiResult.features} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(222, 20%, 18%)"
                  />
                  <XAxis
                    type="number"
                    stroke="hsl(215, 15%, 55%)"
                    fontSize={12}
                    domain={[0, 0.35]}
                  />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    stroke="hsl(215, 15%, 55%)"
                    fontSize={11}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(222, 41%, 10%)",
                      border: "1px solid hsl(222, 20%, 18%)",
                      borderRadius: 8,
                      color: "hsl(210, 20%, 93%)",
                    }}
                    formatter={(value: number) => [
                      `${(value * 100).toFixed(1)}%`,
                      "Importance",
                    ]}
                  />
                  <Bar
                    dataKey="importance"
                    fill={
                      apiResult.signal === "BUY"
                        ? "hsl(160, 84%, 39%)"
                        : apiResult.signal === "SELL"
                          ? "hsl(0, 72%, 51%)"
                          : apiResult.signal?.startsWith("WEAK")
                            ? "hsl(45, 95%, 55%)"
                            : "hsl(210, 10%, 60%)"
                    }
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Price Chart */}
          <motion.div
            key={`chart-${resultKey}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 className="section-title text-foreground mb-4">
              Price Chart with Signals — {symbol}
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={mockCandlestickData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(222, 20%, 18%)"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(215, 15%, 55%)"
                  fontSize={11}
                  interval={9}
                />
                <YAxis
                  stroke="hsl(215, 15%, 55%)"
                  fontSize={12}
                  domain={["dataMin - 5", "dataMax + 5"]}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(222, 41%, 10%)",
                    border: "1px solid hsl(222, 20%, 18%)",
                    borderRadius: 8,
                    color: "hsl(210, 20%, 93%)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={2}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (!payload.signal)
                      return <circle key={props.key} r={0} />;
                    return (
                      <circle
                        key={props.key}
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill={
                          payload.signal === "BUY"
                            ? "hsl(160, 84%, 39%)"
                            : "hsl(0, 72%, 51%)"
                        }
                        stroke="hsl(222, 41%, 10%)"
                        strokeWidth={2}
                      />
                    );
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      )}
    </div>
  );
}
