import { cn } from "@/lib/utils"
import { CircleCheck, CircleAlert, TriangleAlert } from "lucide-react"

type Row = {
  label: string
  value: string
  unit: string
}

type Verification = {
  label: string
  detail: string
  status: "ok" | "warn" | "danger"
}

const results: Row[] = [
  { label: "Section d'acier requise As", value: "1608", unit: "mm²" },
  { label: "Armatures proposées", value: "4 HA25", unit: "= 1963 mm²" },
  { label: "Bras de levier z", value: "462", unit: "mm" },
  { label: "Position axe neutre x", value: "94.8", unit: "mm" },
  { label: "Armatures d'effort tranchant", value: "HA8 / 150", unit: "mm" },
  { label: "Enrobage nominal", value: "30", unit: "mm" },
]

const verifications: Verification[] = [
  { label: "Flexion ELU", detail: "Med / Mrd = 0.75", status: "ok" },
  { label: "Effort tranchant ELU", detail: "Ved / Vrd = 0.87", status: "warn" },
  { label: "Flèche ELS", detail: "22.4 mm > L/250", status: "danger" },
  { label: "Ouverture fissures wk", detail: "0.21 mm ≤ 0.30 mm", status: "ok" },
]

const statusConfig = {
  ok: { Icon: CircleCheck, color: "text-emerald-600", ring: "ring-emerald-600/20 bg-emerald-50" },
  warn: { Icon: CircleAlert, color: "text-amber-600", ring: "ring-amber-600/20 bg-amber-50" },
  danger: { Icon: TriangleAlert, color: "text-red-600", ring: "ring-red-600/20 bg-red-50" },
}

export function ResultsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Résultats du dimensionnement</h2>
        <p className="text-xs text-muted-foreground">Calcul conforme Eurocode 2 (EN 1992-1-1)</p>
      </div>

      <div className="p-5">
        <dl className="divide-y divide-border rounded-md border border-border">
          {results.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-3.5 py-2.5">
              <dt className="text-sm text-muted-foreground">{row.label}</dt>
              <dd className="flex items-baseline gap-1 text-right">
                <span className="font-mono text-sm font-semibold tabular-nums text-foreground">{row.value}</span>
                <span className="text-xs text-muted-foreground">{row.unit}</span>
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Vérifications réglementaires
        </h3>
        <ul className="flex flex-col gap-2">
          {verifications.map((v) => {
            const c = statusConfig[v.status]
            return (
              <li
                key={v.label}
                className="flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5"
              >
                <span className={cn("flex size-7 items-center justify-center rounded-full ring-1 ring-inset", c.ring)}>
                  <c.Icon className={cn("size-4", c.color)} aria-hidden="true" />
                </span>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">{v.label}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{v.detail}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
