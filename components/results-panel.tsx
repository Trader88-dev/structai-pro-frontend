import { cn } from "@/lib/utils"
import { CircleCheck, CircleAlert, TriangleAlert } from "lucide-react"

const statusConfig = {
  ok:     { Icon: CircleCheck,   color: "text-emerald-600", ring: "ring-emerald-600/20 bg-emerald-50" },
  warn:   { Icon: CircleAlert,   color: "text-amber-600",   ring: "ring-amber-600/20 bg-amber-50" },
  danger: { Icon: TriangleAlert, color: "text-red-600",     ring: "ring-red-600/20 bg-red-50" },
}

// Génère les lignes de résultats selon la page
// Labels lisibles pour les clés de résultats
const RESULT_LABELS: Record<string, { label: string; unit: string }> = {
  G_total:            { label: "Charge permanente G",     unit: "T/ml" },
  Q_total:            { label: "Charge exploitation Q",   unit: "T/ml" },
  G_kN:               { label: "G",                       unit: "kN/ml" },
  Q_kN:               { label: "Q",                       unit: "kN/ml" },
  MRd:                { label: "Moment résistant MRd",    unit: "kN·m" },
  taux_travail:       { label: "Taux de travail η",       unit: "%" },
  taux_fleche:        { label: "Taux de travail flèche",  unit: "%" },
  d:                  { label: "Hauteur utile d",         unit: "mm" },
  enrobage:           { label: "Enrobage",                unit: "mm" },
  MEd:                { label: "Moment MEd",              unit: "kN·m" },
  MEd_tot:            { label: "Moment total MEd",        unit: "kN·m" },
  VEd:                { label: "Effort tranchant VEd",    unit: "kN" },
  NEd:                { label: "Effort normal NEd",       unit: "kN" },
  mu:                 { label: "Coefficient μ",           unit: "—" },
  alpha:              { label: "Coefficient α",           unit: "—" },
  pivot:              { label: "Pivot",                   unit: "" },
  As_calc:            { label: "As calculé",              unit: "mm²" },
  As_min:             { label: "As minimum",              unit: "mm²" },
  As_retenu:          { label: "As retenu",               unit: "mm²" },
  choix_armatures:    { label: "Choix armatures",         unit: "" },
  choix:              { label: "Choix armatures",         unit: "" },
  tau_u:              { label: "Contrainte τu",           unit: "MPa" },
  VRd_c:              { label: "Résistance VRd,c",        unit: "kN" },
  lambda_:            { label: "Élancement λ",            unit: "—" },
  lambda_lim:         { label: "λ limite",                unit: "—" },
  l0:                 { label: "Longueur efficace",       unit: "m" },
  e0:                 { label: "Excentricité e0",         unit: "mm" },
  e2:                 { label: "Excentricité e2",         unit: "mm" },
  etot:               { label: "Excentricité totale",     unit: "mm" },
  sigma_max:          { label: "Contrainte sol max",      unit: "kPa" },
  sigma_moy:          { label: "Contrainte sol moy.",     unit: "kPa" },
  sigma_min:          { label: "Contrainte sol min",      unit: "kPa" },
  B_retenue:          { label: "Largeur B retenue",       unit: "m" },
  B_requise:          { label: "Largeur B requise",       unit: "m" },
  MEd_semelle:        { label: "Moment semelle",          unit: "kN·m" },
  As_trans_calc:      { label: "As transversal calculé",  unit: "mm²/ml" },
  As_trans_retenu:    { label: "As transversal retenu",   unit: "mm²/ml" },
  choix_trans:        { label: "Choix transversal",       unit: "" },
  choix_long:         { label: "Choix longitudinal",      unit: "" },
  rho:                { label: "Rapport ρ = Lx/Ly",       unit: "—" },
  q_ELU:              { label: "Charge ELU",              unit: "kN/m²" },
  q_ELS:              { label: "Charge ELS",              unit: "kN/m²" },
  Mx_trav:            { label: "Mx en travée",            unit: "kN·m/ml" },
  My_trav:            { label: "My en travée",            unit: "kN·m/ml" },
  Mx_app:             { label: "Mx en appui",             unit: "kN·m/ml" },
  My_app:             { label: "My en appui",             unit: "kN·m/ml" },
  As_x_inf_retenu:    { label: "As x inférieurs",         unit: "mm²/ml" },
  As_y_inf_retenu:    { label: "As y inférieurs",         unit: "mm²/ml" },
  As_x_sup_retenu:    { label: "As x supérieurs",         unit: "mm²/ml" },
  As_y_sup_retenu:    { label: "As y supérieurs",         unit: "mm²/ml" },
  fleche_calculee:    { label: "Flèche calculée",         unit: "mm" },
  fleche_admissible:  { label: "Flèche admissible",       unit: "mm" },
  wk_x:              { label: "Ouverture fissure wkx",   unit: "mm" },
  wk_y:              { label: "Ouverture fissure wky",   unit: "mm" },
  wk_lim:            { label: "wk limite",               unit: "mm" },
  surface:            { label: "Surface radier",          unit: "m²" },
  Lx_retenu:          { label: "Dimension Lx",            unit: "m" },
  Ly_retenu:          { label: "Dimension Ly",            unit: "m" },
  poids_propre:       { label: "Poids propre",            unit: "kN" },
  stabilite_glissement:   { label: "Coeff. glissement",  unit: "—" },
  stabilite_renversement: { label: "Coeff. renversement", unit: "—" },
  Ka:                 { label: "Coeff. poussée Ka",       unit: "—" },
  Ea:                 { label: "Poussée totale Ea",       unit: "kN/ml" },
  As_voile_retenu:    { label: "As voile (exposé)",       unit: "mm²/ml" },
  choix_voile:        { label: "Choix voile",             unit: "" },
  As_talon_retenu:    { label: "As talon",                unit: "mm²/ml" },
  choix_talon:        { label: "Choix talon",             unit: "" },
  alpha_deg:          { label: "Angle paillasse",         unit: "°" },
  L_inclinee:         { label: "Longueur inclinée",       unit: "m" },
  As_princ_retenu:    { label: "As principal retenu",     unit: "mm²/ml" },
  choix_princ:        { label: "Choix principal",         unit: "" },
  As_rep_retenu:      { label: "As répartition retenu",   unit: "mm²/ml" },
  choix_rep:          { label: "Choix répartition",       unit: "" },
  NEd_vent:           { label: "NEd (vent)",              unit: "kN" },
  MEd_vent:           { label: "MEd (vent)",              unit: "kN·m" },
  NEd_seis:           { label: "NEd (séisme)",            unit: "kN" },
  MEd_seis:           { label: "MEd (séisme)",            unit: "kN·m" },
  cas_dim:            { label: "Cas dimensionnant",       unit: "" },
  etot_acrotere:      { label: "Excentricité totale",     unit: "mm" },
  sigma_beton:        { label: "Contrainte béton",        unit: "MPa" },
  Ax:                 { label: "Dimension Ax",            unit: "m" },
  Ay:                 { label: "Dimension Ay",            unit: "m" },
  As_x_retenu:        { label: "As x retenu",             unit: "mm²/ml" },
  choix_x:            { label: "Choix armatures x",       unit: "" },
  As_y_retenu:        { label: "As y retenu",             unit: "mm²/ml" },
  choix_y:            { label: "Choix armatures y",       unit: "" },
  perimetre_crit:     { label: "Périmètre critique",      unit: "m" },
  VEd_poinc:          { label: "VEd poinçonnement",       unit: "kN" },
  VRd_c_poinc:        { label: "VRd,c poinçonnement",     unit: "kN" },
  As_vert_retenu:     { label: "As verticaux",            unit: "mm²/ml" },
  choix_vert:         { label: "Choix verticals",         unit: "" },
  As_horiz_retenu:    { label: "As horizontaux",          unit: "mm²/ml" },
  choix_horiz:        { label: "Choix horizontaux",       unit: "" },
  As_about_retenu:    { label: "As about",                unit: "mm²/ml" },
  choix_about:        { label: "Choix about",             unit: "" },
  cisaillement_ok:    { label: "Cisaillement",            unit: "" },
  // Descente de charges v2
  intervention_label: { label: "Intervention",            unit: "" },
  R_A_ELU:            { label: "Réaction appui A (ELU)",  unit: "kN" },
  R_B_ELU:            { label: "Réaction appui B (ELU)",  unit: "kN" },
  R_A_ELS:            { label: "Réaction appui A (ELS)",  unit: "kN" },
  R_B_ELS:            { label: "Réaction appui B (ELS)",  unit: "kN" },
  N_ELS_fond:         { label: "Fondations N (ELS)",      unit: "T/ml" },
  N_ELU_fond:         { label: "Fondations N (ELU)",      unit: "kN/ml" },
  B_semelle_requise:  { label: "Semelle filante requise B ≥", unit: "m" },
  sigma_mur:          { label: "Contrainte maçonnerie σ", unit: "MPa" },
  charge_boulon:      { label: "Effort ELS par boulon",   unit: "T" },
}

// Libellés/unités spécifiques à une page (résout la collision q_ELU dalle/DDC)
const PAGE_LABEL_OVERRIDES: Record<string, Record<string, { label: string; unit: string }>> = {
  "descente-charges": {
    q_ELU: { label: "Charge ELU 1,35G+1,50Q", unit: "kN/ml" },
  },
}

const SKIP_KEYS = new Set(["messages","norme","bidirectionnelle","fleche_ok","fissuration_ok",
  "cisaillement_ok","lx_ly_ok","sigma_ok","portance_ok","glissement_ok","renversement_ok",
  "poinconnement_ok","sigma_ok_enc","armatures_cis","armatures_cisaillement","elance",
  "As_x_min","As_x_calc","As_y_calc","As_x_inf_min","As_x_inf_calc","As_y_inf_min",
  "As_y_inf_calc","As_vert_min","As_vert_max","As_vert_calc","As_horiz_min","As_about_calc",
  "As_trans_min","As_long_min","As_voile_calc","As_talon_calc","As_princ_calc","As_princ_min",
  "fleche_calc","fleche_adm","As_rep_min","sigma_min_sol","debord","ex","ey",
  "l_elastique_x","l_elastique_y","wk_x","wk_y","wk_lim","sigma_c","sigma_s",
  "As_about_calc","As_voile_horiz","choix_voile_horiz","As_voile_horiz","Eq","Ea",
  "perimetre_crit","VEd_poinc","VRd_c_poinc"])

function getRows(results: any, page: string) {
  if (!results) return []
  const isDDC = page === "descente-charges"
  const keepZero = new Set(["G_total","Q_total","G_kN","Q_kN"])
  return Object.entries(results)
    .filter(([k, v]) => 
      !SKIP_KEYS.has(k) && 
      k !== "intervention" &&
      typeof v !== "object" && 
      typeof v !== "boolean" &&
      v !== undefined && v !== null && v !== "" &&
      // DDC : masquer les sorties non pertinentes pour l'intervention (à 0)
      (!isDDC || v !== 0 || keepZero.has(k))
    )
    .map(([k, v]) => {
      const def = PAGE_LABEL_OVERRIDES[page]?.[k] || RESULT_LABELS[k]
      const label = def?.label || k.replace(/_/g," ")
      const unit = def?.unit || ""
      const val = unit ? `${v} ${unit}` : String(v)
      return { label, value: val }
    })
    .slice(0, isDDC ? 20 : 14)
}

// Génère les vérifications selon la page
function getVerifications(results: any, page: string) {
  if (!results) return []
  const verifs: { label: string; detail: string; status: "ok"|"warn"|"danger" }[] = []

  // Vérifications communes selon les champs booléens
  const boolFields: Record<string, { label: string; invertOk?: boolean }> = {
    sigma_ok:          { label: "Pression sol" },
    flexion_ok:        { label: "Flexion profilé (η ≤ 100%)" },
    fleche_ok:         { label: "Flèche ELS" },
    mur_ok:            { label: "Contrainte maçonnerie (σ ≤ σ_adm)" },
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
      // Descente de charges : ne montrer que les vérifications actives
      if (page === "descente-charges") {
        if ((key === "flexion_ok" || key === "fleche_ok") && !results.MRd) return
        if (key === "mur_ok" && !results.sigma_mur) return
      }
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
  const isDDC = activePage === "descente-charges"
  const sousTitre = isDDC
    ? "Descente de charges EC0/EC1 — vérification Eurocode 3 (EN 1993-1-1)"
    : "Calcul conforme Eurocode 2 (EN 1992-1-1)"
  const detail: any[] = isDDC && Array.isArray(results.detail_niveaux) ? results.detail_niveaux : []

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Résultats du dimensionnement</h2>
        <p className="text-xs text-muted-foreground">{sousTitre}</p>
      </div>
      <div className="p-5">
        {detail.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tableau de descente des charges (T/ml)
            </h3>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="px-2.5 py-2 text-left font-medium">Niveau</th>
                    <th className="px-2.5 py-2 text-right font-medium">Larg. (m)</th>
                    <th className="px-2.5 py-2 text-right font-medium">Mur g1</th>
                    <th className="px-2.5 py-2 text-right font-medium">Plancher g2</th>
                    <th className="px-2.5 py-2 text-right font-medium">q</th>
                    <th className="px-2.5 py-2 text-right font-medium">G</th>
                    <th className="px-2.5 py-2 text-right font-medium">Q</th>
                    <th className="px-2.5 py-2 text-right font-medium">Cumul G</th>
                    <th className="px-2.5 py-2 text-right font-medium">Cumul Q</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono">
                  {detail.map((d, i) => (
                    <tr key={i} title={d.provenance || ""} className={d.provenance ? "cursor-help" : ""}>
                      <td className="px-2.5 py-1.5 font-sans text-foreground">{d.designation}</td>
                      <td className="px-2.5 py-1.5 text-right">{d.largeur ?? "—"}</td>
                      <td className="px-2.5 py-1.5 text-right">{d.g1}</td>
                      <td className="px-2.5 py-1.5 text-right">{d.g2}</td>
                      <td className="px-2.5 py-1.5 text-right">{d.q}</td>
                      <td className="px-2.5 py-1.5 text-right font-semibold">{d.G}</td>
                      <td className="px-2.5 py-1.5 text-right font-semibold">{d.Q}</td>
                      <td className="px-2.5 py-1.5 text-right text-muted-foreground">{d.cumul_G ?? "—"}</td>
                      <td className="px-2.5 py-1.5 text-right text-muted-foreground">{d.cumul_Q ?? "—"}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/50 font-semibold">
                    <td className="px-2.5 py-2 font-sans">TOTAL {results.G_total !== undefined && Number(results.intervention ? 1 : 1) ? "" : ""}</td>
                    <td colSpan={4}></td>
                    <td className="px-2.5 py-2 text-right">{results.G_total}</td>
                    <td className="px-2.5 py-2 text-right">{results.Q_total}</td>
                    <td colSpan={2} className="px-2.5 py-2 text-right font-sans text-[10px] text-muted-foreground">après fraction reprise</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">
              Survolez une ligne pour voir la provenance des valeurs déterminées automatiquement (demi-portées, composition de plancher, usage).
            </p>
          </div>
        )}
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
