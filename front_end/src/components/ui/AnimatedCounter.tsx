import { useEffect, useState } from "react";
import { useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export default function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const numericMatch = value.match(/[\d,.]+/);
  const numeric = numericMatch ? parseFloat(numericMatch[0].replace(/,/g, "")) : 0;
  const prefix = numericMatch ? value.slice(0, value.indexOf(numericMatch[0])) : "";
  const suffix = numericMatch ? value.slice(value.indexOf(numericMatch[0]) + numericMatch[0].length) : "";
  const hasComma = numericMatch ? numericMatch[0].includes(",") : false;
  const decimals = numericMatch && numericMatch[0].includes(".") ? numericMatch[0].split(".")[1].length : 0;

  const spring = useSpring(0, { duration: 1200, bounce: 0 });
  const display = useTransform(spring, (v) => {
    const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    if (hasComma) {
      const [int, dec] = formatted.split(".");
      const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return dec ? `${withCommas}.${dec}` : withCommas;
    }
    return formatted;
  });

  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    spring.set(numeric);
    const unsub = display.on("change", (v) => setDisplayValue(v));
    return unsub;
  }, [numeric]);

  if (!numericMatch) return <span className={className}>{value}</span>;

  return (
    <span className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
