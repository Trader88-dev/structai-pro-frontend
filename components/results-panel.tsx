import { cn } from "@/lib/utils"
import { CircleCheck, CircleAlert, TriangleAlert } from "lucide-react"

const statusConfig = {
  ok:     { Icon: CircleCheck,   color: "text-emerald-600", ring: "ring-emerald-600/20 bg-emerald-50" },
  warn:   { Icon: CircleAlert,   color: "text-amber-600",   ring: "ring-amber-600/20 bg-amber-50" },
  danger: { Icon: TriangleAlert, color: "text-red-600",     ring: "ring-red-600/20 bg-red-50" },
}

// Génère les lignes de résultats selon la page
function getRows(results: any, page: string) {
  if (!results) return []
  const skip = ["messages","norme"]
  return Object.entries(results)
    .filter(([k]) => !skip.includes(k) && typeof results[k] !== "object" && typeof results[k] !== "boolean")
    .map(([k, v]) => ({ label: k.replace(/_/g," "), value: String(v) }))
    .slice(0, 12)
}

// Génère les vérifications selon la page
function getVerifications(results: any, page: string) {
  if (!results) return []
  const verifs: { label: string; detail: string; status: "ok"|"warn"|"danger" }[] = []

  // Vérifications communes selon les champs booléens
  const boolFields: Record<string, { label: string; invertOk?: boolean }> = {
    sigma_ok:          { label: "Pression sol" },
    fleche_ok:         { label: "Flèche ELS" },
    fissuration_ok:    { label: "Fissuration ELS" },
    cisaillement_ok:   { label: "Cisaillement" },
    lx_ly_ok:          { label: "Rapport Lx/Ly" },
    bidirectionnelle:  { label: "Dalle bidirectionnelle" },
    portance_ok:       { label: "Portance sol" },
    glissement_ok:     { label: "Stabilité glissement" },
    renversement_ok:   { label: "Stabilité renversement" },
    poinconnement_ok:  { label: "Poinçonnement" },
    sigma_ok_enc:      { label: "Contrainte encastrement" },
    armatures_cis:     { label: "Cisaillement béton seul", invertOk: true },
    armatures_cisaillement: { label: "Cisaillement béton seul", invertOk: true },
    elance:            { label: "Voile court (non élancé)", invertOk: true },
  }

  Object.entries(boolFields).forEach(([key, cfg]) => {
    if (key in results) {
      const val = results[key] as boolean
      const ok = cfg.invertOk ? !val : val
      verifs.push({ label: cfg.label, detail: ok ? "✓ Vérifié" : "✗ Non vérifié", status: ok ? "ok" : "danger" })
    }
  })

  return verifs.slice(0, 6)
}

export function ResultsPanel({ results, activePage }: { results: any; activePage?: string }) {
  if (!results) return (
    <div className="rounded-lg border border-border bg-card shadow-sm flex items-center justify-center min-h-[300px]">
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Renseignez les données et cliquez sur</p>
        <p className="text-sm font-semibold mt-1">▶ Calculer</p>
      </div>
    </div>
  )

  const rows = getRows(results, activePage || "")
  const verifications = getVerifications(results, activePage || "")

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Résultats du dimensionnement</h2>
        <p className="text-xs text-muted-foreground">Calcul conforme Eurocode 2 (EN 1992-1-1)</p>
      </div>
      <div className="p-5">
        <dl className="divide-y divide-border rounded-md border border-border">
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-3.5 py-2.5">
              <dt className="text-sm text-muted-foreground capitalize">{row.label}</dt>
              <dd className="font-mono text-sm font-semibold text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>

        {verifications.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Vérifications réglementaires
            </h3>
            <ul className="flex flex-col gap-2">
              {verifications.map(v => {
                const c = statusConfig[v.status]
                return (
                  <li key={v.label} className="flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5">
                    <span className={cn("flex size-7 items-center justify-center rounded-full ring-1 ring-inset", c.ring)}>
                      <c.Icon className={cn("size-4", c.color)} />
                    </span>
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium text-foreground">{v.label}</span>
                      <span className="font-mono text-[11px] text-muted-foreground">{v.detail}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {results.messages?.length > 0 && (
          <div className="mt-4 flex flex-col gap-1.5">
            {results.messages.map((m: string, i: number) => (
              <div key={i} className={cn(
                "rounded px-3 py-2 text-xs",
                m.includes("⚠") ? "bg-amber-50 text-amber-700" :
                m.includes("ERREUR") ? "bg-red-50 text-red-700" :
                "bg-blue-50 text-blue-700"
              )}>→ {m}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
