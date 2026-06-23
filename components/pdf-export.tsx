"use client"

import { useState } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const API = "https://structai-pro-backend-production.up.railway.app"

const PAGE_TO_ENDPOINT: Record<string, string> = {
  "poutre-simple":   "poutre",
  "poteau":          "poteau",
  "semelle-filante": "semelle",
  "semelle-isolee":  "semelle-isolee",
  "radier":          "radier",
  "dalle-pleine":    "dalle",
  "poutre-continue": "poutre-continue",
  "voile":           "voile",
  "escalier":        "escalier",
  "acrotere":        "acrotere",
  "linteau":         "linteau",
  "mur-soutenement": "mur-soutenement",
}

type PdfExportProps = {
  projet: string
  ingenieur: string
  norme: string
  activePage: string
  inputs: any
  results: any
  schemaRef?: React.RefObject<HTMLDivElement | null>
}

export function PdfExportButton({
  projet, ingenieur, norme, activePage, inputs, results
}: PdfExportProps) {
  const [loading, setLoading] = useState(false)

  const generatePDF = async () => {
    const endpoint = PAGE_TO_ENDPOINT[activePage]
    if (!endpoint) {
      alert("Module non supporté pour l'export PDF")
      return
    }

    setLoading(true)
    try {
      // Adapter les inputs selon le module
      let processedInputs = { ...inputs }

      if (activePage === "poutre-simple") {
        processedInputs = { ...processedInputs, portee: inputs.L }
      }
      if (["poteau", "semelle-filante", "semelle-isolee", "radier", "voile"].includes(activePage)) {
        processedInputs = { ...processedInputs, pct_G: (inputs.pct_G || 70) / 100 }
      }
      if (activePage === "poutre-continue") {
        const nb = inputs.nb_travees || 3
        const travees = []
        for (let i = 1; i <= nb; i++) {
          travees.push({ L: inputs["L" + i] || 5.0, g_k: inputs["g" + i] || 15.0, q_k: inputs["q" + i] || 10.0 })
        }
        processedInputs = {
          b: inputs.b, h: inputs.h,
          appui_gauche: inputs.appui_gauche || "appuye",
          appui_droit: inputs.appui_droit || "appuye",
          beton: inputs.beton, acier: inputs.acier,
          enrobage_classe: inputs.enrobage_classe,
          norme: inputs.norme,
          travees,
        }
      }

      const body = {
        ...processedInputs,
        projet: projet || "Projet",
        ingenieur: ingenieur || "Ingénieur",
      }

      const res = await fetch(`${API}/pdf/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        throw new Error(`Erreur backend : ${res.status}`)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `note_${activePage}_${(projet || "projet").replace(/\s/g, "_")}.pdf`
      a.click()
      URL.revokeObjectURL(url)

    } catch (err) {
      console.error("Erreur PDF:", err)
      alert("Erreur lors de la génération du PDF. Vérifiez que le backend tourne.")
    }
    setLoading(false)
  }

  return (
    <Button variant="outline" size="sm" onClick={generatePDF} disabled={loading || !results}>
      {loading
        ? <><Loader2 className="size-4 animate-spin" /> Génération...</>
        : <><Download className="size-4" /> Note de calcul PDF</>
      }
    </Button>
  )
}



