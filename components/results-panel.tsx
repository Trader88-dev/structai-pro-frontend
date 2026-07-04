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
  return Object.entries(results)
    .filter(([k, v]) => 
      !SKIP_KEYS.has(k) && 
      typeof v !== "object" && 
      typeof v !== "boolean" &&
      v !== undefined && v !== null && v !== ""
    )
    .map(([k, v]) => {
      const def = RESULT_LABELS[k]
      const label = def?.label || k.replace(/_/g," ")
      const unit = def?.unit || ""
      const val = unit ? `${v} ${unit}` : String(v)
      return { label, value: val }
    })
    .slice(0, 14)
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
