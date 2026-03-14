// Mock data for the AI Stock Signal Platform

export const mockSignals = [
  { id: 1, symbol: "AAPL", name: "Apple Inc.", signal: "BUY", confidence: 87, price: 178.72, change: 2.34, changePercent: 1.33 },
  { id: 2, symbol: "TSLA", name: "Tesla Inc.", signal: "SELL", confidence: 72, price: 248.50, change: -5.12, changePercent: -2.02 },
  { id: 3, symbol: "NVDA", name: "NVIDIA Corp.", signal: "BUY", confidence: 94, price: 875.30, change: 12.45, changePercent: 1.44 },
  { id: 4, symbol: "MSFT", name: "Microsoft Corp.", signal: "HOLD", confidence: 61, price: 415.20, change: 0.85, changePercent: 0.20 },
  { id: 5, symbol: "AMZN", name: "Amazon.com Inc.", signal: "BUY", confidence: 81, price: 185.60, change: 3.22, changePercent: 1.77 },
  { id: 6, symbol: "GOOGL", name: "Alphabet Inc.", signal: "HOLD", confidence: 55, price: 141.80, change: -0.45, changePercent: -0.32 },
  { id: 7, symbol: "META", name: "Meta Platforms", signal: "BUY", confidence: 78, price: 505.75, change: 8.90, changePercent: 1.79 },
  { id: 8, symbol: "SPY", name: "SPDR S&P 500", signal: "BUY", confidence: 68, price: 512.30, change: 1.50, changePercent: 0.29 },
];

export const mockEquityCurve = [
  { date: "Jan", value: 100000, benchmark: 100000 },
  { date: "Feb", value: 103200, benchmark: 101500 },
  { date: "Mar", value: 107800, benchmark: 99800 },
  { date: "Apr", value: 112500, benchmark: 103200 },
  { date: "May", value: 109300, benchmark: 102100 },
  { date: "Jun", value: 118700, benchmark: 106500 },
  { date: "Jul", value: 124500, benchmark: 108200 },
  { date: "Aug", value: 121800, benchmark: 107800 },
  { date: "Sep", value: 130200, benchmark: 110500 },
  { date: "Oct", value: 135600, benchmark: 112300 },
  { date: "Nov", value: 142800, benchmark: 115600 },
  { date: "Dec", value: 148500, benchmark: 118200 },
];

export const mockSignalDistribution = [
  { name: "BUY", value: 45, fill: "hsl(160, 84%, 39%)" },
  { name: "SELL", value: 25, fill: "hsl(0, 72%, 51%)" },
  { name: "HOLD", value: 30, fill: "hsl(38, 92%, 50%)" },
];

export const mockPortfolioAllocation = [
  { name: "Tech", value: 35, fill: "hsl(221, 83%, 53%)" },
  { name: "Healthcare", value: 20, fill: "hsl(160, 84%, 39%)" },
  { name: "Finance", value: 18, fill: "hsl(250, 83%, 60%)" },
  { name: "Energy", value: 12, fill: "hsl(38, 92%, 50%)" },
  { name: "Consumer", value: 15, fill: "hsl(0, 72%, 51%)" },
];

export const mockTickerData = [
  { symbol: "AAPL", price: 178.72, change: 1.33 },
  { symbol: "GOOGL", price: 141.80, change: -0.32 },
  { symbol: "MSFT", price: 415.20, change: 0.20 },
  { symbol: "AMZN", price: 185.60, change: 1.77 },
  { symbol: "NVDA", price: 875.30, change: 1.44 },
  { symbol: "TSLA", price: 248.50, change: -2.02 },
  { symbol: "META", price: 505.75, change: 1.79 },
  { symbol: "SPY", price: 512.30, change: 0.29 },
  { symbol: "QQQ", price: 438.90, change: 0.85 },
  { symbol: "BRK.B", price: 408.15, change: 0.12 },
];

export const mockFeatureImportance = [
  { feature: "RSI (14)", importance: 0.23 },
  { feature: "MACD Signal", importance: 0.19 },
  { feature: "Volume MA", importance: 0.16 },
  { feature: "Bollinger Band", importance: 0.14 },
  { feature: "EMA (50)", importance: 0.11 },
  { feature: "ATR (14)", importance: 0.09 },
  { feature: "Stochastic", importance: 0.08 },
];

export const mockCandlestickData = Array.from({ length: 60 }, (_, i) => {
  const base = 170 + Math.sin(i / 5) * 15 + Math.random() * 8;
  const open = base + (Math.random() - 0.5) * 4;
  const close = base + (Math.random() - 0.5) * 4;
  const high = Math.max(open, close) + Math.random() * 3;
  const low = Math.min(open, close) - Math.random() * 3;
  return {
    date: `Day ${i + 1}`,
    open: +open.toFixed(2),
    close: +close.toFixed(2),
    high: +high.toFixed(2),
    low: +low.toFixed(2),
    signal: i === 15 ? "BUY" : i === 35 ? "SELL" : i === 50 ? "BUY" : null,
  };
});

export const mockBacktestResults = {
  sharpeRatio: 1.85,
  maxDrawdown: -12.4,
  winRate: 68.5,
  cagr: 24.7,
  totalTrades: 156,
  profitFactor: 2.3,
  trades: [
    { id: 1, symbol: "AAPL", entry: 165.20, exit: 178.50, pnl: 13.30, pnlPercent: 8.05, date: "2024-01-15", type: "LONG" },
    { id: 2, symbol: "TSLA", entry: 260.00, exit: 245.80, pnl: -14.20, pnlPercent: -5.46, date: "2024-02-03", type: "SHORT" },
    { id: 3, symbol: "NVDA", entry: 680.50, exit: 875.30, pnl: 194.80, pnlPercent: 28.63, date: "2024-03-12", type: "LONG" },
    { id: 4, symbol: "MSFT", entry: 395.00, exit: 415.20, pnl: 20.20, pnlPercent: 5.11, date: "2024-04-08", type: "LONG" },
    { id: 5, symbol: "AMZN", entry: 178.30, exit: 170.15, pnl: -8.15, pnlPercent: -4.57, date: "2024-05-22", type: "LONG" },
    { id: 6, symbol: "META", entry: 470.00, exit: 505.75, pnl: 35.75, pnlPercent: 7.61, date: "2024-06-10", type: "LONG" },
  ],
};

export const mockAlerts = [
  { id: 1, symbol: "AAPL", condition: "Price > $180", status: "active", type: "price", createdAt: "2024-12-01" },
  { id: 2, symbol: "TSLA", condition: "RSI < 30", status: "active", type: "indicator", createdAt: "2024-12-05" },
  { id: 3, symbol: "SPY", condition: "MACD Crossover", status: "triggered", type: "signal", createdAt: "2024-12-08" },
  { id: 4, symbol: "NVDA", condition: "Price > $900", status: "active", type: "price", createdAt: "2024-12-10" },
  { id: 5, symbol: "MSFT", condition: "Volume > 50M", status: "expired", type: "volume", createdAt: "2024-11-20" },
];

export const mockMarketData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.72, change: 1.33, volume: "52.3M", marketCap: "2.78T", sector: "Technology", pe: 28.5 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 415.20, change: 0.20, volume: "22.1M", marketCap: "3.09T", sector: "Technology", pe: 35.2 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -0.32, volume: "25.8M", marketCap: "1.76T", sector: "Technology", pe: 23.1 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.60, change: 1.77, volume: "48.2M", marketCap: "1.93T", sector: "Consumer", pe: 60.8 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.30, change: 1.44, volume: "38.5M", marketCap: "2.16T", sector: "Technology", pe: 65.3 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: -2.02, volume: "95.1M", marketCap: "791B", sector: "Consumer", pe: 72.4 },
  { symbol: "META", name: "Meta Platforms", price: 505.75, change: 1.79, volume: "15.6M", marketCap: "1.29T", sector: "Technology", pe: 27.8 },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.40, change: 0.55, volume: "8.9M", marketCap: "571B", sector: "Finance", pe: 11.2 },
  { symbol: "JNJ", name: "Johnson & Johnson", price: 156.20, change: -0.15, volume: "6.2M", marketCap: "376B", sector: "Healthcare", pe: 18.9 },
  { symbol: "XOM", name: "Exxon Mobil", price: 104.80, change: 0.95, volume: "14.3M", marketCap: "438B", sector: "Energy", pe: 12.1 },
];

export const mockTopGainers = [
  { symbol: "NVDA", name: "NVIDIA", change: 4.52, price: 875.30 },
  { symbol: "AMD", name: "AMD", change: 3.88, price: 178.40 },
  { symbol: "SMCI", name: "Super Micro", change: 3.21, price: 920.15 },
];

export const mockTopLosers = [
  { symbol: "TSLA", name: "Tesla", change: -2.02, price: 248.50 },
  { symbol: "BA", name: "Boeing", change: -1.85, price: 198.30 },
  { symbol: "INTC", name: "Intel", change: -1.45, price: 43.80 },
];
