import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CarCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <Card className="overflow-hidden rounded-16 border border-slate-200/80 bg-white/70 backdrop-blur-sm h-full flex flex-col p-0 gap-0">
      <Skeleton className="relative aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex justify-between gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-12 shrink-0" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-3 w-24 mt-1" />
        <div className="flex-1" />
        <div className="pt-2.5 border-t border-slate-100 mt-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-40 mt-2" />
        </div>
        {!compact && (
          <div className="flex gap-2 pt-1 mt-1">
            <Skeleton className="h-8 flex-1 rounded-lg" />
            <Skeleton className="h-8 flex-1 rounded-lg" />
          </div>
        )}
      </div>
    </Card>
  )
}
