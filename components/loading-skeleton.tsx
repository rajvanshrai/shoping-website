import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="aspect-square bg-muted animate-pulse rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-8 w-20 bg-muted rounded animate-pulse" />
          <div className="h-12 w-12 bg-muted rounded-full animate-pulse" />
        </div>
      </div>
    </Card>
  )
}

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </div>
  )
}
