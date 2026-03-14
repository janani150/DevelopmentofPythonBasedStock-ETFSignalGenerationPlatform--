import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
      <Clock className="w-3.5 h-3.5" />
      <span>{time.toLocaleTimeString()}</span>
    </div>
  );
}
