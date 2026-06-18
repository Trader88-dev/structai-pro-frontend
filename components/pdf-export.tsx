"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type PdfExportProps = {
  projet: string
  ingenieur: string
  norme: string
  activePage: string
  inputs: any
  results: any
  schemaRef?: React.RefObject<HTMLDivElement | null>
}

const PAGE_LABELS: Record<string, string> = {
  "poutre-simple":   "Poutre rectangulaire - Flexion simple",
  "poteau":          "Poteau rectangulaire - Compression composee",
  "semelle-filante": "Semelle filante",
  "semelle-isolee":  "Semelle isolee",
  "radier":          "Radier general",
  "dalle-pleine":    "Dalle pleine bidirectionnelle",
  "poutre-continue": "Poutre continue - Methode Caquot",
  "voile":           "Voile BA",
  "escalier":        "Escalier BA",
  "acrotere":        "Acrotere",
  "linteau":         "Linteau",
  "mur-soutenement": "Mur de soutenement",
}

const INPUT_UNITS: Record<string, string> = {
  b:"mm", h:"mm", L:"m", portee:"m", g_k:"kN/m", q_k:"kN/m",
  N_k:"kN", M_k:"kN.m", longueur:"m", h_semelle:"mm", b_mur:"mm",
  sigma_sol:"kPa", Lx:"m", Ly:"m", epaisseur:"mm", debord:"mm",
  ks:"kN/m3", H:"m", e_voile:"mm", B_semelle:"m", e_semelle:"mm",
  h_acrotere:"m", e_acrotere:"mm", q_vent:"kN/m2",
  L_h:"m", hauteur:"m", ep:"mm",
}

const RESULT_UNITS: Record<string, string> = {
  MEd:"kN.m", VEd:"kN", d:"mm", enrobage:"mm",
  mu:"--", alpha:"--", pivot:"",
  As_calc:"mm2", As_min:"mm2", As_retenu:"mm2",
  tau_u:"MPa", VRd_c:"kN", choix_armatures:"",
  NEd:"kN", lambda_:"--", lambda_lim:"--",
  etot:"mm", e0:"mm", e2:"mm", MEd_tot:"kN.m", l0:"m",
  sigma_max:"kPa", sigma_moy:"kPa", sigma_min:"kPa",
  B_retenue:"m", B_requise:"m", debord:"mm",
  MEd_semelle:"kN.m", As_trans_calc:"mm2/ml", As_trans_min:"mm2/ml",
  As_trans_retenu:"mm2/ml", As_long_min:"mm2/ml",
  choix_trans:"", choix_long:"",
  rho:"--", Mx_trav:"kN.m/ml", My_trav:"kN.m/ml",
  Mx_app:"kN.m/ml", My_app:"kN.m/ml",
  As_x_inf_calc:"mm2/ml", As_x_inf_min:"mm2/ml", As_x_inf_retenu:"mm2/ml",
  As_y_inf_calc:"mm2/ml", As_y_inf_retenu:"mm2/ml",
  As_x_sup_retenu:"mm2/ml", As_y_sup_retenu:"mm2/ml",
  fleche_calculee:"mm", fleche_admissible:"mm",
  wk_x:"mm", wk_y:"mm", wk_lim:"mm",
  sigma_c:"MPa", sigma_s:"MPa",
  q_ELU:"kN/m2", q_ELS:"kN/m2",
  surface:"m2", poids_propre:"kN",
  ex:"m", ey:"m", l_elastique_x:"m", l_elastique_y:"m",
  As_vert_calc:"mm2/ml", As_vert_min:"mm2", As_vert_max:"mm2",
  As_vert_retenu:"mm2/ml", choix_vert:"",
  As_horiz_min:"mm2/ml", As_horiz_retenu:"mm2/ml", choix_horiz:"",
  As_about_calc:"mm2", As_about_retenu:"mm2", choix_about:"",
  Ka:"--", Ea:"kN/ml", Eq:"kN/ml",
  stabilite_glissement:"--", stabilite_renversement:"--", stabilite_portance:"--",
  sigma_min_sol:"kPa",
  As_voile_calc:"mm2/ml", As_voile_retenu:"mm2/ml", choix_voile:"",
  As_voile_horiz:"mm2/ml", choix_voile_horiz:"",
  As_talon_calc:"mm2/ml", As_talon_retenu:"mm2/ml", choix_talon:"",
  alpha_deg:"deg", L_inclinee:"m",
  As_princ_calc:"mm2/ml", As_princ_min:"mm2/ml",
  As_princ_retenu:"mm2/ml", choix_princ:"",
  As_rep_retenu:"mm2/ml", choix_rep:"",
  NEd_vent:"kN", MEd_vent:"kN.m",
  NEd_seis:"kN", MEd_seis:"kN.m",
  cas_dim:"", etot_acrotere:"mm",
  As_calc_acrotere:"mm2/ml", As_min_acrotere:"mm2/ml",
  As_retenu_acrotere:"mm2/ml", choix_acrotere:"",
  As_rep_acrotere:"mm2/ml", choix_rep_acrotere:"",
  sigma_beton:"MPa",
  Ax:"m", Ay:"m", As_x_calc:"mm2/ml", As_x_retenu:"mm2/ml",
  As_y_calc:"mm2/ml", As_y_retenu:"mm2/ml",
  perimetre_crit:"m", VEd_poinc:"kN", VRd_c_poinc:"kN",
  mu_:"--", As_:"mm2",
}

const BOOL_VERIFS: Record<string, { label: string; invert?: boolean }> = {
  sigma_ok:               { label: "Pression sol verifiee" },
  fleche_ok:              { label: "Fleche ELS verifiee" },
  fissuration_ok:         { label: "Fissuration ELS verifiee" },
  cisaillement_ok:        { label: "Cisaillement verifie" },
  armatures_cisaillement: { label: "Cisaillement - Armatures transversales requises", invert: true },
  glissement_ok:          { label: "Stabilite au glissement" },
  renversement_ok:        { label: "Stabilite au renversement" },
  portance_ok:            { label: "Portance sol verifiee" },
  poinconnement_ok:       { label: "Poinconnement verifie" },
  lx_ly_ok:               { label: "Rapport Lx/Ly acceptable" },
  bidirectionnelle:       { label: "Dalle bidirectionnelle" },
  elance:                 { label: "Voile court non elance", invert: true },
}

// Nettoyer les emojis et caracteres speciaux
function clean(str: string): string {
  return String(str)
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[✅❌⚠️🔴🟠🟢✓✗→]/g, "")
    .replace(/[^\x00-\x7FÀ-ÿ€°²³µ·]/g, "")
    .trim()
}

export function PdfExportButton({
  projet, ingenieur, norme, activePage, inputs, results, schemaRef
}: PdfExportProps) {
  const [loading, setLoading] = useState(false)

  const generatePDF = async () => {
    setLoading(true)
    try {
      const { default: jsPDF } = await import("jspdf")

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })
      const pw = 210, ph = 297, mg = 15
      const cw = pw - 2 * mg
      let y = mg

      // ── EN-TETE ──────────────────────────────────────────────────────────
      doc.setFillColor(24, 95, 165)
      doc.rect(0, 0, pw, 22, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14); doc.setFont("helvetica", "bold")
      doc.text("StructAI Pro", mg, 10)
      doc.setFontSize(9); doc.setFont("helvetica", "normal")
      doc.text("Logiciel de calcul de structures beton arme", mg, 16)
      doc.text(norme + " - EC0 - EC1", pw - mg, 14, { align: "right" })
      y = 30

      // ── TITRE ────────────────────────────────────────────────────────────
      doc.setTextColor(24, 95, 165)
      doc.setFontSize(13); doc.setFont("helvetica", "bold")
      doc.text(PAGE_LABELS[activePage] || activePage, mg, y)
      y += 8

      // ── INFOS PROJET ─────────────────────────────────────────────────────
      doc.setFillColor(245, 247, 250)
      doc.setDrawColor(220, 220, 220)
      doc.rect(mg, y, cw, 18, "FD")
      doc.setTextColor(60, 60, 60)
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal")
      const date = new Date().toLocaleDateString("fr-FR", { day:"2-digit", month:"long", year:"numeric" })
      doc.text("Projet : " + (projet || "--"), mg + 3, y + 6)
      doc.text("Ingenieur : " + (ingenieur || "--"), mg + 3, y + 13)
      doc.text("Date : " + date, pw - mg - 3, y + 6, { align: "right" })
      doc.text("Beton : " + (inputs.beton||"C25/30") + "  |  Acier : " + (inputs.acier||"B500B"), pw - mg - 3, y + 13, { align: "right" })
      y += 24

      // ── 1. DONNEES D'ENTREE ───────────────────────────────────────────────
      doc.setTextColor(24, 95, 165)
      doc.setFontSize(10); doc.setFont("helvetica", "bold")
      doc.text("1. Donnees d'entree", mg, y)
      y += 7

      const skipInputs = ["norme","beton","acier","enrobage_classe","classe_fissuration","appui","conditions_appui","zone_sismique","appui_x1","appui_x2","appui_y1","appui_y2"]
      const inputEntries = Object.entries(inputs).filter(([k]) => !skipInputs.includes(k))

      doc.setFontSize(8.5)
      inputEntries.forEach(([key, val], i) => {
        if (y > ph - 30) { doc.addPage(); y = mg }
        doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255)
        doc.rect(mg, y - 4, cw, 6.5, "F")
        doc.setTextColor(90, 90, 90); doc.setFont("helvetica", "normal")
        doc.text(key.replace(/_/g, " "), mg + 3, y)
        doc.setTextColor(20, 20, 20); doc.setFont("helvetica", "bold")
        const unit = INPUT_UNITS[key] || ""
        doc.text(String(val) + (unit ? " " + unit : ""), pw - mg - 3, y, { align: "right" })
        doc.setFont("helvetica", "normal")
        y += 6.5
      })
      y += 6

      // ── 2. RESULTATS ──────────────────────────────────────────────────────
      if (y > ph - 40) { doc.addPage(); y = mg }
      doc.setTextColor(24, 95, 165)
      doc.setFontSize(10); doc.setFont("helvetica", "bold")
      doc.text("2. Resultats du dimensionnement", mg, y)
      y += 7

      const skipResults = ["messages","norme","travees_res"]
      const resultEntries = Object.entries(results).filter(([k, v]) =>
        !skipResults.includes(k) && typeof v !== "object" && typeof v !== "boolean"
      )

      doc.setFontSize(8.5)
      resultEntries.forEach(([key, val], i) => {
        if (y > ph - 30) { doc.addPage(); y = mg }
        doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 249 : 255, i % 2 === 0 ? 250 : 255)
        doc.rect(mg, y - 4, cw, 6.5, "F")
        doc.setTextColor(90, 90, 90); doc.setFont("helvetica", "normal")
        doc.text(clean(key.replace(/_/g, " ")), mg + 3, y)
        doc.setTextColor(20, 20, 20); doc.setFont("helvetica", "bold")
        const unit = RESULT_UNITS[key] || ""
        doc.text(clean(String(val)) + (unit ? " " + unit : ""), pw - mg - 3, y, { align: "right" })
        doc.setFont("helvetica", "normal")
        y += 6.5
      })
      y += 6

      // ── 3. VERIFICATIONS ──────────────────────────────────────────────────
      const verifs = Object.entries(BOOL_VERIFS)
        .filter(([k]) => k in results)
        .map(([k, cfg]) => ({
          label: cfg.label,
          ok: cfg.invert ? !(results[k] as boolean) : (results[k] as boolean)
        }))

      if (verifs.length > 0) {
        if (y > ph - 50) { doc.addPage(); y = mg }
        doc.setTextColor(24, 95, 165)
        doc.setFontSize(10); doc.setFont("helvetica", "bold")
        doc.text("3. Verifications reglementaires", mg, y)
        y += 7

        verifs.forEach(({ label, ok }, i) => {
          if (y > ph - 20) { doc.addPage(); y = mg }
          doc.setFillColor(ok ? 240 : 255, ok ? 253 : 243, ok ? 244 : 243)
          doc.rect(mg, y - 4, cw, 6.5, "F")
          doc.setDrawColor(ok ? 180 : 220, ok ? 220 : 180, ok ? 200 : 180)
          doc.rect(mg, y - 4, cw, 6.5, "D")
          doc.setTextColor(ok ? 22 : 160, ok ? 100 : 30, ok ? 50 : 30)
          doc.setFontSize(8.5); doc.setFont("helvetica", "normal")
          doc.text((ok ? "[OK]  " : "[NON] ") + label, mg + 3, y)
          doc.setFont("helvetica", "bold")
          doc.text(ok ? "VERIFIE" : "NON VERIFIE", pw - mg - 3, y, { align: "right" })
          doc.setFont("helvetica", "normal")
          y += 6.5
        })
        y += 6
      }

      // ── 4. OBSERVATIONS ───────────────────────────────────────────────────
      if (results.messages?.length > 0) {
        if (y > ph - 40) { doc.addPage(); y = mg }
        doc.setTextColor(24, 95, 165)
        doc.setFontSize(10); doc.setFont("helvetica", "bold")
        doc.text("4. Observations", mg, y)
        y += 7

        results.messages.forEach((msg: string) => {
          if (y > ph - 20) { doc.addPage(); y = mg }
          doc.setTextColor(70, 70, 70)
          doc.setFontSize(8); doc.setFont("helvetica", "normal")
          const lines = doc.splitTextToSize("> " + clean(msg), cw - 4)
          doc.text(lines, mg + 3, y)
          y += lines.length * 5 + 2
        })
        y += 4
      }

      // ── 5. SCHEMA SVG ────────────────────────────────────────────────────
      if (schemaRef?.current) {
        const svgEl = schemaRef.current.querySelector("svg")
        if (svgEl) {
          if (y > ph - 90) { doc.addPage(); y = mg }
          doc.setTextColor(24, 95, 165)
          doc.setFontSize(10); doc.setFont("helvetica", "bold")
          doc.text("5. Schema structural", mg, y)
          y += 7

          try {
            // Serialiser le SVG
            const serializer = new XMLSerializer()
            const svgStr = serializer.serializeToString(svgEl)
            const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" })
            const url = URL.createObjectURL(svgBlob)

            await new Promise<void>((resolve) => {
              const img = new window.Image()
              img.onload = () => {
                const cvs = document.createElement("canvas")
                const scale = 2
                cvs.width  = img.naturalWidth  * scale
                cvs.height = img.naturalHeight * scale
                const ctx = cvs.getContext("2d")!
                ctx.fillStyle = "#ffffff"
                ctx.fillRect(0, 0, cvs.width, cvs.height)
                ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
                const png = cvs.toDataURL("image/png")
                const imgW = cw
                const imgH = (cvs.height / cvs.width) * imgW
                const finalH = Math.min(imgH, ph - y - 25)
                if (finalH > 20) {
                  doc.addImage(png, "PNG", mg, y, imgW, finalH)
                  y += finalH + 4
                }
                URL.revokeObjectURL(url)
                resolve()
              }
              img.onerror = () => { URL.revokeObjectURL(url); resolve() }
              img.src = url
            })
          } catch (e) {
            console.warn("Schema non capture:", e)
          }
        }
      }

      // ── PIED DE PAGE ─────────────────────────────────────────────────────
      const total = doc.getNumberOfPages()
      for (let p = 1; p <= total; p++) {
        doc.setPage(p)
        doc.setDrawColor(200, 200, 200)
        doc.line(mg, ph - 12, pw - mg, ph - 12)
        doc.setTextColor(150, 150, 150)
        doc.setFontSize(7); doc.setFont("helvetica", "normal")
        doc.text("StructAI Pro  -  Note de calcul generee automatiquement  -  Usage professionnel", mg, ph - 7)
        doc.text("Page " + p + " / " + total, pw - mg, ph - 7, { align: "right" })
      }

      doc.save("note_" + activePage + "_" + (projet || "projet").replace(/\s/g, "_") + ".pdf")

    } catch (err) {
      console.error("Erreur PDF:", err)
      alert("Erreur lors de la generation du PDF. Verifiez la console.")
    }
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={generatePDF} disabled={loading || !results}>
      {loading
        ? <><Loader2 className="size-4 animate-spin" /> Generation...</>
        : <><Download className="size-4" /> Note de calcul PDF</>
      }
    </Button>
  )
}
