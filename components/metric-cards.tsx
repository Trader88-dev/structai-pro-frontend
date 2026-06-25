import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"

type Status = "ok" | "warn" | "danger"
const statusStyles: Record<Status, { badge: string; bar: string; Icon: React.ElementType }> = {
  ok:     { badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20", bar: "bg-emerald-500", Icon: ArrowDownRight },
  warn:   { badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",       bar: "bg-amber-500",   Icon: Minus },
  danger: { badge: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",             bar: "bg-red-500",     Icon: ArrowUpRight },
}

function MetricCard({ label, value, unit, badge, status, hint }: {
  label: string; value: string; unit: string; badge: string; status: Status; hint: string
}) {
  const s = statusStyles[status]
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-sm">
      <span className={cn("absolute inset-y-0 left-0 w-1", s.bar)} />
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", s.badge)}>
          <s.Icon className="size-3" />{badge}
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

function getMetrics(results: any, page: string, norme: string) {
  const mu_lim = norme === "EC2" ? 0.372 : 0.186

  const maps: Record<string, any[]> = {
    "poutre-simple": [
      { label:"MEd", value:String(results.MEd), unit:"kN.m", badge:"Calculé", status:"ok", hint:`VEd = ${results.VEd} kN` },
      { label:"μ", value:String(results.mu), unit:"—", badge:results.mu<=mu_lim?`≤${mu_lim} ✓`:`>${mu_lim} ✗`, status:results.mu<=mu_lim?"ok":"danger", hint:`Pivot ${results.pivot}` },
      { label:"As retenu", value:String(results.As_retenu), unit:"mm²", badge:results.choix_armatures, status:"ok", hint:`calc=${results.As_calc} min=${results.As_min}` },
      { label:"Cisaillement", value:String(results.VEd), unit:"kN", badge:!results.armatures_cisaillement?"✓ Béton":"⚠ Cadres", status:!results.armatures_cisaillement?"ok":"warn", hint:`VRd,c=${results.VRd_c} kN` },
    ],
    "poteau": [
      { label:"NEd", value:String(results.NEd), unit:"kN", badge:"ELU", status:"ok", hint:`λ = ${results.lambda_}` },
      { label:"Élancement", value:String(results.lambda_), unit:"—", badge:results.elance?"Élancé ⚠":"Court ✅", status:results.elance?"warn":"ok", hint:`λlim = ${results.lambda_lim}` },
      { label:"etot", value:String(results.etot), unit:"mm", badge:"Excentricité", status:"ok", hint:`e0=${results.e0} + e2=${results.e2}` },
      { label:"As retenu", value:String(results.As_retenu), unit:"mm²", badge:results.choix_armatures, status:"ok", hint:`min=${results.As_min}` },
    ],
    "semelle-filante": [
      { label:"σmax ELS", value:String(results.sigma_max), unit:"kPa", badge:results.sigma_ok?"✓ OK":"✗ Dépassé", status:results.sigma_ok?"ok":"danger", hint:`σmoy=${results.sigma_moy} kPa` },
      { label:"Largeur B", value:String(results.B_retenue), unit:"m", badge:"Retenue", status:"ok", hint:`min=${results.B_requise} m` },
      { label:"MEd semelle", value:String(results.MEd_semelle), unit:"kN.m", badge:"ELU", status:"ok", hint:"Flexion dalle" },
      { label:"As trans", value:String(results.As_trans_retenu), unit:"mm²/ml", badge:results.choix_trans, status:"ok", hint:`calc=${results.As_trans_calc}` },
    ],
    "dalle-pleine": [
      { label:"ρ = Lx/Ly", value:String(results.rho), unit:"—", badge:results.bidirectionnelle?"Bidir. ✓":"Unidir.", status:results.bidirectionnelle?"ok":"warn", hint:`q ELU = ${results.q_ELU} kN/m²` },
      { label:"Mx travée", value:String(results.Mx_trav), unit:"kN.m/ml", badge:"Marcus", status:"ok", hint:`My = ${results.My_trav}` },
      { label:"As x inf", value:String(results.As_x_inf_retenu), unit:"mm²/ml", badge:results.choix_x_inf, status:"ok", hint:`min=${results.As_x_inf_min}` },
      { label:"Flèche", value:String(results.fleche_calculee), unit:"mm", badge:results.fleche_ok?"✓ OK":"✗ Dépassé", status:results.fleche_ok?"ok":"danger", hint:`adm=${results.fleche_admissible} mm` },
    ],
    "poutre-continue": [
      { label:"Travées", value:String(results.travees_res?.length||"—"), unit:"", badge:"Caquot", status:"ok" as Status, hint:"Méthode forfaitaire" },
      { label:"M max travée", value:String(results.travees_res?.[0]?.M_trav||"—"), unit:"kN.m", badge:"ELU", status:"ok" as Status, hint:"Travée 1" },
      { label:"As max", value:String(results.travees_res?.[0]?.As_trav_retenu||"—"), unit:"mm²", badge:results.travees_res?.[0]?.choix_trav||"—", status:"ok" as Status, hint:"Travée 1" },
      { label:"Flèche T1", value:String(results.travees_res?.[0]?.fleche||"—"), unit:"mm", badge:results.travees_res?.[0]?.fleche_ok?"✓ OK":"✗ Dépasse", status:(results.travees_res?.[0]?.fleche_ok?"ok":"warn") as Status, hint:`adm=${results.travees_res?.[0]?.fleche_adm} mm` },
    ],
    "voile": [
      { label:"NEd", value:String(results.NEd), unit:"kN", badge:"ELU", status:"ok", hint:`MEd=${results.MEd_tot} kN.m` },
      { label:"λ élancement", value:String(results.lambda_), unit:"—", badge:results.elance?"Élancé ⚠":"Court ✅", status:results.elance?"warn":"ok", hint:`λlim=${results.lambda_lim}` },
      { label:"As vert.", value:String(results.As_vert_retenu), unit:"mm²/ml", badge:results.choix_vert, status:"ok", hint:`calc=${results.As_vert_calc}` },
      { label:"Cisaillement", value:String(results.VEd), unit:"kN", badge:results.cisaillement_ok?"✓ OK":"⚠ Armatures", status:results.cisaillement_ok?"ok":"warn", hint:`VRd,c=${results.VRd_c} kN` },
    ],
    "radier": [
      { label:"Surface", value:String(results.surface), unit:"m²", badge:`${results.Lx_retenu}×${results.Ly_retenu}m`, status:"ok", hint:"Dimensions retenues" },
      { label:"σmax ELS", value:String(results.sigma_max), unit:"kPa", badge:results.sigma_ok?"✓ OK":"✗ Dépassé", status:results.sigma_ok?"ok":"danger", hint:`σmoy=${results.sigma_moy}` },
      { label:"As x inf", value:String(results.As_x_inf_retenu), unit:"mm²/ml", badge:results.choix_x_inf, status:"ok", hint:`y: ${results.As_y_inf_retenu}` },
      { label:"NEd", value:String(results.NEd), unit:"kN", badge:"ELU", status:"ok", hint:`Poids propre=${results.poids_propre} kN` },
    ],
    "mur-soutenement": [
      { label:"Fg glissement", value:String(results.stabilite_glissement), unit:"—", badge:results.glissement_ok?"✓ ≥1.5":"✗ <1.5", status:results.glissement_ok?"ok":"danger", hint:"Coefficient sécurité" },
      { label:"Fr renversement", value:String(results.stabilite_renversement), unit:"—", badge:results.renversement_ok?"✓ ≥2.0":"✗ <2.0", status:results.renversement_ok?"ok":"danger", hint:"Coefficient sécurité" },
      { label:"σmax sol", value:String(results.sigma_max), unit:"kPa", badge:results.portance_ok?"✓ OK":"✗ Dépassé", status:results.portance_ok?"ok":"danger", hint:`Ka=${results.Ka}` },
      { label:"As voile", value:String(results.As_voile_retenu), unit:"mm²/ml", badge:results.choix_voile, status:"ok", hint:"Nappe exposée" },
    ],
    "escalier": [
      { label:"α paillasse", value:String(results.alpha_deg), unit:"°", badge:"Inclinaison", status:"ok" as Status, hint:`L inclinée = ${results.L_inclinee} m` },
      { label:"MEd", value:String(results.MEd), unit:"kN.m", badge:"ELU", status:"ok" as Status, hint:`VEd = ${results.VEd} kN` },
      { label:"As princ.", value:String(results.As_princ_retenu), unit:"mm²/ml", badge:results.choix_princ, status:"ok" as Status, hint:`calc=${results.As_princ_calc}` },
      { label:"Flèche", value:"—", unit:"", badge:results.fleche_ok?"✓ OK":"✗ Dépasse", status:(results.fleche_ok?"ok":"warn") as Status, hint:"L/d vérifié" },
    ],
    "linteau": [
      { label:"MEd", value:String(results.MEd), unit:"kN.m", badge:"ELU", status:"ok" as Status, hint:`VEd = ${results.VEd} kN` },
      { label:"μ", value:String(results.mu), unit:"—", badge:results.mu<=0.372?"≤0.372 ✓":">0.372 ✗", status:(results.mu<=0.372?"ok":"danger") as Status, hint:"Pivot A" },
      { label:"As retenu", value:String(results.As_retenu), unit:"mm²", badge:results.choix, status:"ok" as Status, hint:`calc=${results.As_calc}` },
      { label:"Cisaillement", value:String(results.VEd), unit:"kN", badge:!results.armatures_cis?"✓ Béton":"⚠ Cadres", status:(!results.armatures_cis?"ok":"warn") as Status, hint:`VRd,c=${results.VRd_c} kN` },
    ],
    "acrotere": [
      { label:"MEd", value:String(results.MEd), unit:"kN.m", badge:results.cas_dim||"Dim.", status:"ok" as Status, hint:`NEd=${results.NEd} kN` },
      { label:"e totale", value:String(results.etot), unit:"mm", badge:"Excentricité", status:"ok" as Status, hint:`d=${results.d} mm` },
      { label:"As retenu", value:String(results.As_retenu), unit:"mm²/ml", badge:results.choix||"—", status:"ok" as Status, hint:`min=${results.As_min}` },
      { label:"σ béton", value:String(results.sigma_beton), unit:"MPa", badge:results.sigma_ok?"✓ OK":"✗ Dépasse", status:(results.sigma_ok?"ok":"danger") as Status, hint:"Encastrement" },
    ],
    "semelle-isolee": [
      { label:"Dim. semelle", value:`${results.Ax}×${results.Ay}`, unit:"m", badge:`S=${results.surface}m²`, status:"ok" as Status, hint:"Dimensions retenues" },
      { label:"σmax ELS", value:String(results.sigma_max), unit:"kPa", badge:results.sigma_ok?"✓ OK":"✗ Dépassé", status:(results.sigma_ok?"ok":"danger") as Status, hint:`σmoy=${results.sigma_moy} kPa` },
      { label:"As x", value:String(results.As_x_retenu), unit:"mm²/ml", badge:results.choix_x, status:"ok" as Status, hint:`calc=${results.As_x_calc}` },
      { label:"Poinçonnement", value:String(results.VEd_poinc), unit:"kN", badge:results.poinconnement_ok?"✓ OK":"✗ Dépasse", status:(results.poinconnement_ok?"ok":"danger") as Status, hint:`VRd,c=${results.VRd_c_poinc} kN` },
    ],
  }

  return maps[page] || []
}

export function MetricCards({ results, norme, activePage }: { results: any; norme: string; activePage: string }) {
  if (!results) return null
  const metrics = getMetrics(results, activePage, norme)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(m => <MetricCard key={m.label} {...m} />)}
    </div>
  )
}
