import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

type Status = "ok" | "warn" | "danger"

type MetricCardProps = {
  label: string
  value: string
  unit: string
  badge: string
  status: Status
  hint: string
}

const statusStyles: Record<Status, { badge: string; bar: string; Icon: React.ElementType }> = {
  ok: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    bar: "bg-emerald-500",
    Icon: ArrowDownRight,
  },
  warn: {
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    bar: "bg-amber-500",
    Icon: Minus,
  },
  danger: {
    badge: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    bar: "bg-red-500",
    Icon: ArrowUpRight,
  },
}

function MetricCard({ label, value, unit, badge, status, hint }: MetricCardProps) {
  const s = statusStyles[status]
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
      <span className={cn("absolute inset-y-0 left-0 w-1", s.bar)} aria-hidden="true" />
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            s.badge,
          )}
        >
          <s.Icon className="size-3" aria-hidden="true" />
          {badge}
        </span>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  )
}

const metrics: MetricCardProps[] = [
  {
    label: "Moment résistant Mrd",
    value: "248.6",
    unit: "kN·m",
    badge: "Vérifié",
    status: "ok",
    hint: "Med = 186.2 kN·m · ratio 0.75",
  },
  {
    label: "Effort tranchant Vrd",
    value: "312.0",
    unit: "kN",
    badge: "Limite",
    status: "warn",
    hint: "Ved = 271.4 kN · ratio 0.87",
  },
  {
    label: "Flèche instantanée",
    value: "22.4",
    unit: "mm",
    badge: "Dépassé",
    status: "danger",
    hint: "Limite L/250 = 18.0 mm",
  },
  {
    label: "Taux d'armature ρ",
    value: "1.18",
    unit: "%",
    badge: "Optimal",
    status: "ok",
    hint: "Min 0.13% · Max 4.00%",
  },
]

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} />
      ))}
    </div>
  )
}
