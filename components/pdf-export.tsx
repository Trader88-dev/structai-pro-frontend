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
      const body = {
        ...inputs,
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

