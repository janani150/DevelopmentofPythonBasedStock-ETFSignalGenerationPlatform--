import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export function StatCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20 bg-secondary" />
            <Skeleton className="h-5 w-5 rounded bg-secondary" />
          </div>
          <Skeleton className="h-8 w-24 bg-secondary" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div className="glass-card">
      <Skeleton className="h-5 w-32 mb-4 bg-secondary" />
      <Skeleton className={`w-full bg-secondary rounded-lg`} style={{ height }} />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="glass-card">
      <Skeleton className="h-5 w-32 mb-4 bg-secondary" />
      <div className="space-y-3">
        <div className="flex gap-4 border-b border-border pb-3">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 bg-secondary" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1 bg-secondary" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <Skeleton className="h-8 w-48 mb-2 bg-secondary" />
        <Skeleton className="h-4 w-72 bg-secondary" />
      </div>
      <StatCardSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ChartSkeleton height={200} />
      </div>
      <TableSkeleton />
    </motion.div>
  );
}
