"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileSearch, Upload, X, FileText, Image, Loader2, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const API = "http://127.0.0.1:8000"

const MODES = [
  { id: "extraction",  label: "📏 Extraction des dimensions",        desc: "Extrait b, h, portées, cotations" },
  { id: "ferraillage", label: "🔩 Lecture du ferraillage",           desc: "Armatures, diamètres, espacements" },
  { id: "complet",     label: "📋 Analyse complète",                  desc: "Coffrage + ferraillage + cartouche" },
  { id: "verification",label: "⚠️ Vérification et anomalies",        desc: "Conformité EC2/BAEL, erreurs" },
]

const MODE_LABELS: Record<string, string> = {
  extraction:   "Extraction automatique des dimensions",
  ferraillage:  "Lecture du ferraillage",
  complet:      "Analyse complète (coffrage + ferraillage)",
  verification: "Vérification et détection d'erreurs",
}

export default function LecturePlans({ norme, beton, acier }: { norme?: string; beton?: string; acier?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState("extraction")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    const ok = ["application/pdf","image/png","image/jpeg","image/jpg","image/webp"]
    if (!ok.includes(f.type)) { setError("Format non supporté — PDF, PNG, JPG, WEBP uniquement"); return }
    if (f.size > 20*1024*1024) { setError("Fichier trop volumineux — max 20 Mo"); return }
    setFile(f); setError(""); setResult("")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const analyse = async () => {
    if (!file) return
    setLoading(true); setError(""); setResult("")
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("mode", MODE_LABELS[mode])
      fd.append("norme", norme||"EC2")
      fd.append("beton", beton||"C25/30")
      fd.append("acier", acier||"B500B")
      const res = await fetch(`${API}/ia/lecture-plan`, { method: "POST", body: fd })
      if (!res.ok) throw new Error((await res.json()).detail || "Erreur serveur")
      const data = await res.json()
      setResult(data.analyse)
    } catch (e: any) { setError(`Erreur : ${e.message}`) }
    setLoading(false)
  }

  const downloadTxt = () => {
    const blob = new Blob([result], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url
    a.download = `analyse_plan_${mode}.txt`; a.click()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-blue-100">
          <FileSearch className="size-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Lecture et Analyse de Plans</h2>
          <p className="text-xs text-muted-foreground">Vision IA · {norme||"EC2"} · {beton||"C25/30"} · {acier||"B500B"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT — Upload + Mode */}
        <div className="flex flex-col gap-4">

          {/* Mode selection */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Mode d&apos;analyse</h3>
            <div className="flex flex-col gap-2">
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={cn(
                    "flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
                    mode === m.id ? "bg-blue-50 border border-blue-200" : "hover:bg-muted border border-transparent"
                  )}>
                  <span className="text-sm font-medium text-foreground">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload zone */}
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={cn(
              "rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
              dragOver ? "border-blue-400 bg-blue-50" : "border-border hover:border-blue-300 hover:bg-muted/50",
              file ? "border-emerald-300 bg-emerald-50" : ""
            )}>
            <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                {file.type === "application/pdf"
                  ? <FileText className="size-10 text-emerald-500" />
                  : <Image className="size-10 text-emerald-500" />
                }
                <p className="text-sm font-medium text-emerald-700">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size/1024).toFixed(0)} Ko</p>
                <button onClick={e => { e.stopPropagation(); setFile(null); setResult("") }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                  <X className="size-3" /> Supprimer
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="size-10 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Glissez votre plan ici</p>
                <p className="text-xs text-muted-foreground">PDF, PNG, JPG, WEBP · max 20 Mo</p>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <Button onClick={analyse} disabled={!file || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full" size="lg">
            {loading ? <><Loader2 className="size-4 animate-spin" /> Analyse en cours...</> : <><FileSearch className="size-4" /> Analyser le plan</>}
          </Button>
        </div>

        {/* RIGHT — Results */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Résultats de l&apos;analyse</h3>
              <p className="text-xs text-muted-foreground">{MODES.find(m => m.id === mode)?.label}</p>
            </div>
            {result && (
              <Button variant="outline" size="sm" onClick={downloadTxt}>
                <Download className="size-3.5" /> Télécharger
              </Button>
            )}
          </div>

          <div className="p-5">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <Loader2 className="size-8 animate-spin text-blue-500" />
                <p className="text-sm">Analyse du plan en cours...</p>
                <p className="text-xs">Cela peut prendre 10-20 secondes</p>
              </div>
            )}

            {!loading && !result && (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                <FileSearch className="size-10 opacity-30" />
                <p className="text-sm">Importez un plan et cliquez sur Analyser</p>
              </div>
            )}

            {!loading && result && (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed font-sans">{result}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
