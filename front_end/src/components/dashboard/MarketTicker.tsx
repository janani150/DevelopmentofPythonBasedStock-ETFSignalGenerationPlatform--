import { mockTickerData } from "@/lib/mockData";

export default function MarketTicker() {
  const items = [...mockTickerData, ...mockTickerData];

  return (
    <div className="overflow-hidden border-b border-border bg-secondary/30 py-2">
      <div className="ticker-scroll">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-2 text-sm font-mono">
            <span className="font-semibold text-foreground">{t.symbol}</span>
            <span className="text-muted-foreground">${t.price.toFixed(2)}</span>
            <span className={t.change >= 0 ? "text-gain" : "text-loss"}>
              {t.change >= 0 ? "+" : ""}{t.change.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
