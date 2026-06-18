"use client"

import { cn } from "@/lib/utils"
import { CircleCheck, CircleAlert, TriangleAlert } from "lucide-react"

export function PoutreContinueResults({ results }: { results: any }) {
  if (!results) return (
    <div className="rounded-lg border border-border bg-card shadow-sm flex items-center justify-center min-h-[300px]">
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Renseignez les données et cliquez sur</p>
        <p className="text-sm font-semibold mt-1">▶ Calculer</p>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Infos globales */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Informations générales</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Hauteur utile d</div>
          <div className="font-semibold text-right">{results.d} mm</div>
          <div className="text-muted-foreground">As minimum</div>
          <div className="font-semibold text-right">{results.As_min} mm²</div>
        </div>
      </div>

      {/* Résultats par travée */}
      {results.travees_res?.map((t: any, i: number) => (
        <div key={i} className="rounded-lg border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Travée {t.numero} — L = {t.L} m</h3>
            <span className="text-xs text-muted-foreground">q ELU = {t.q_ELU} kN/m</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Moments & Efforts */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Moments & Efforts</p>
                <dl className="divide-y divide-border rounded-md border border-border">
                  {[
                    { label:"M travée",     value:`${t.M_trav} kN.m` },
                    { label:"M appui G",    value:`${t.M_app_g} kN.m` },
                    { label:"M appui D",    value:`${t.M_app_d} kN.m` },
                    { label:"V gauche",     value:`${t.V_g} kN` },
                    { label:"V droit",      value:`${t.V_d} kN` },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between px-3 py-1.5">
                      <dt className="text-xs text-muted-foreground">{r.label}</dt>
                      <dd className="text-xs font-semibold">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Armatures */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Armatures</p>
                <dl className="divide-y divide-border rounded-md border border-border">
                  {[
                    { label:"Travée",     value:t.choix_trav },
                    { label:"Chapeau G",  value:t.choix_chap_g },
                    { label:"Chapeau D",  value:t.choix_chap_d },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between px-3 py-1.5">
                      <dt className="text-xs text-muted-foreground">{r.label}</dt>
                      <dd className="text-xs font-semibold text-blue-600">{r.value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Vérifications */}
                <div className="mt-3 flex flex-col gap-1.5">
                  {[
                    { label:"Flèche", ok: t.fleche_ok, detail:`${t.fleche} ≤ ${t.fleche_adm} mm` },
                    { label:"Fissuration", ok: t.fissuration_ok, detail:`wk=${t.wk} ≤ ${t.wk_lim} mm` },
                    { label:"Cisaillement", ok: !t.armatures_cis, detail:`VRd,c=${t.VRd_c} kN` },
                  ].map(v => (
                    <div key={v.label} className={cn(
                      "flex items-center gap-2 rounded px-2.5 py-1.5 text-xs",
                      v.ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {v.ok
                        ? <CircleCheck className="size-3.5 shrink-0" />
                        : <CircleAlert className="size-3.5 shrink-0" />
                      }
                      <span className="font-medium">{v.label}</span>
                      <span className="ml-auto opacity-70">{v.detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Messages */}
      {results.messages?.length > 0 && (
        <div className="flex flex-col gap-1.5">
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
  )
}
