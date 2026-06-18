"use client"

import { useState, useEffect } from "react"
import { Clock, Trash2, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

const PAGE_LABELS: Record<string, string> = {
  "poutre-simple":   "Poutre simple",
  "poteau":          "Poteau BA",
  "semelle-filante": "Semelle filante",
  "semelle-isolee":  "Semelle isolee",
  "radier":          "Radier general",
  "dalle-pleine":    "Dalle pleine",
  "poutre-continue": "Poutre continue",
  "voile":           "Voile BA",
  "escalier":        "Escalier",
  "acrotere":        "Acrotere",
  "linteau":         "Linteau",
  "mur-soutenement": "Mur soutenement",
}

const TYPE_COLORS: Record<string, string> = {
  "poutre-simple":   "bg-blue-100 text-blue-700",
  "poteau":          "bg-green-100 text-green-700",
  "semelle-filante": "bg-orange-100 text-orange-700",
  "semelle-isolee":  "bg-orange-100 text-orange-700",
  "radier":          "bg-purple-100 text-purple-700",
  "dalle-pleine":    "bg-pink-100 text-pink-700",
  "poutre-continue": "bg-blue-100 text-blue-700",
  "voile":           "bg-teal-100 text-teal-700",
  "escalier":        "bg-yellow-100 text-yellow-700",
  "acrotere":        "bg-red-100 text-red-700",
  "linteau":         "bg-gray-100 text-gray-700",
  "mur-soutenement": "bg-stone-100 text-stone-700",
}

export default function HistoryPage({ onRestore }: { onRestore?: (type: string, inputs: any, results: any) => void }) {
  const [calculs, setCalculs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    fetch("/api/calculs")
      .then(r => r.json())
      .then(data => { setCalculs(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const deleteCalcul = async (id: string) => {
    await fetch(`/api/calculs?id=${id}`, { method: "DELETE" })
    setCalculs(prev => prev.filter(c => c.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    })
  }

  return (
    <div className="flex flex-col gap-0 h-[calc(100vh-73px)]">
      <div className="border-b border-border bg-card px-6 py-4">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Clock className="size-4 text-muted-foreground" /> Historique des calculs
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{calculs.length} calcul(s) sauvegardé(s)</p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Liste */}
        <div className="w-80 border-r border-border overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
              Chargement...
            </div>
          )}
          {!loading && calculs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm gap-2">
              <FileText className="size-8 opacity-30" />
              <p>Aucun calcul sauvegardé</p>
              <p className="text-xs">Effectuez un calcul et sauvegardez-le</p>
            </div>
          )}
          {calculs.map(c => (
            <div key={c.id}
              onClick={() => setSelected(c)}
              className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer hover:bg-muted transition-colors ${selected?.id === c.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[c.type] || "bg-gray-100 text-gray-700"}`}>
                    {PAGE_LABELS[c.type] || c.type}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(c.createdAt)}</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>

        {/* Détail */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
              <Clock className="size-10 opacity-20" />
              <p className="text-sm">Sélectionnez un calcul pour voir les détails</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold">{selected.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(selected.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  {onRestore && (
                    <Button size="sm" onClick={() => {
                      const inputs = JSON.parse(selected.inputs)
                      const results = JSON.parse(selected.results)
                      onRestore(selected.type, inputs, results)
                    }}>
                      Restaurer
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => deleteCalcul(selected.id)}>
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              {/* Données entrée */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Données d'entrée</h4>
                <dl className="divide-y divide-border">
                  {Object.entries(JSON.parse(selected.inputs))
                    .filter(([k]) => !["norme","beton","acier","enrobage_classe"].includes(k))
                    .map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5">
                      <dt className="text-xs text-muted-foreground">{k.replace(/_/g," ")}</dt>
                      <dd className="text-xs font-semibold">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Résultats */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Résultats</h4>
                <dl className="divide-y divide-border">
                  {Object.entries(JSON.parse(selected.results))
                    .filter(([k, v]) => !["messages","norme"].includes(k) && typeof v !== "object" && typeof v !== "boolean")
                    .slice(0, 15)
                    .map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1.5">
                      <dt className="text-xs text-muted-foreground">{k.replace(/_/g," ")}</dt>
                      <dd className="text-xs font-semibold">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
