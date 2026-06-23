"use client"

import { useState, useRef } from "react"
import { Sidebar, pageTitles } from "@/components/sidebar"
import { MetricCards } from "@/components/metric-cards"
import { InputForm, getDefaultInputs } from "@/components/input-form"
import { ResultsPanel } from "@/components/results-panel"
import { Button } from "@/components/ui/button"
import { Calculator, Sparkles, Download, RotateCcw } from "lucide-react"
import AssistantIA from "@/components/assistant-ia"
import LecturePlans from "@/components/lecture-plans"
import { BeamSchema } from "@/components/beam-schema"
import { PoteauSchema, SemelleIsoleeSchema, AcrotereSchema, EscalierSchema, MomentDiagram } from "@/components/structural-schemas"
import { PdfExportButton } from "@/components/pdf-export"
import { PoutreContinueResults } from "@/components/poutre-continue-results"
import HistoryPage from "@/components/history-page"
import { useSession } from "next-auth/react"

const API = "https://structai-pro-backend-production.up.railway.app"

const API_ENDPOINTS: Record<string, string> = {
  "poutre-simple":   "/calcul/poutre",
  "poteau":          "/calcul/poteau",
  "semelle-filante": "/calcul/semelle",
  "radier":          "/calcul/radier",
  "dalle-pleine":    "/calcul/dalle",
  "poutre-continue": "/calcul/poutre-continue",
  "voile":           "/calcul/voile",
  "escalier":        "/calcul/escalier",
  "acrotere":        "/calcul/acrotere",
  "semelle-isolee":  "/calcul/semelle-isolee",
  "linteau":         "/calcul/linteau",
  "mur-soutenement": "/calcul/mur-soutenement",
}

function buildBody(inputs: any, pageId: string): any {
  
let processedInputs = { ...inputs }
if (activePage === "poutre-simple") processedInputs = { ...processedInputs, portee: inputs.L }
if (["poteau","semelle-filante","semelle-isolee","radier","voile"].includes(activePage)) {
  processedInputs = { ...processedInputs, pct_G: (inputs.pct_G || 70) / 100 }
}
const body = {
  ...processedInputs,
  projet: projet || "Projet",
  ingenieur: ingenieur || "Ingénieur",
}
    if (inputs.P_k && inputs.P_k > 0) {
      body.charges_concentrees = [{ P_k: inputs.P_k, a: inputs.P_a || inputs.L/2, type_charge: "variable" }]
    }
    if ((inputs.q1_k && inputs.q1_k > 0) || (inputs.q2_k && inputs.q2_k > 0)) {
      body.charges_trapezoidales = [{ q1_k: inputs.q1_k || 0, q2_k: inputs.q2_k || 0, type_charge: "variable" }]
    }
    return body
  }
  if (pageId === "poteau") return { ...inputs, pct_G: (inputs.pct_G||70)/100 }
  if (pageId === "semelle-filante") return { ...inputs, pct_G: (inputs.pct_G||70)/100 }
  if (pageId === "semelle-isolee") return { ...inputs, pct_G: (inputs.pct_G||70)/100 }
  if (pageId === "radier") return { ...inputs, pct_G: (inputs.pct_G||70)/100 }
  if (pageId === "voile") return { ...inputs, pct_G: (inputs.pct_G||70)/100 }
  if (pageId === "poutre-continue") {
    const nb = inputs.nb_travees || 3
    const travees = []
    for (let i = 1; i <= nb; i++) {
      travees.push({ L: inputs["L"+i] || 5.0, g_k: inputs["g"+i] || 15.0, q_k: inputs["q"+i] || 10.0 })
    }
    return {
      b: inputs.b, h: inputs.h,
      appui_gauche: inputs.appui_gauche || "appuye",
      appui_droit:  inputs.appui_droit  || "appuye",
      beton: inputs.beton, acier: inputs.acier,
      enrobage_classe: inputs.enrobage_classe,
      norme: inputs.norme,
      travees,
    }
  }
  return inputs
}

export default function Page() {
  const [activePage, setActivePage] = useState("poutre-simple")
  const [inputs, setInputs] = useState<any>(getDefaultInputs("poutre-simple"))
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [aiComment, setAiComment] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [error, setError] = useState("")
  const schemaRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const [saveMsg, setSaveMsg] = useState("")
  const [projet, setProjet] = useState("Projet test")
  const [ingenieur, setIngenieur] = useState("Ing. Dupont")
  const pageInfo = pageTitles[activePage] || { title: activePage, sub: "" }
  const hasEndpoint = !!API_ENDPOINTS[activePage]

  const handleNavigate = (id: string) => {
    setActivePage(id)
    setInputs(getDefaultInputs(id))
    setResults(null); setAiComment(""); setError("")
  }

  const handleCalc = async () => {
    if (!hasEndpoint) return
    setLoading(true); setError("")
    try {
      const body = buildBody(inputs, activePage)
      const res = await fetch(`${API}${API_ENDPOINTS[activePage]}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Erreur serveur")
      }
      setResults(await res.json())
    } catch (e: any) { setError(`Erreur : ${e.message}`) }
    setLoading(false)
  }

  const handleAI = async () => {
    if (!results) return
    setAiLoading(true)
    try {
      const res = await fetch(`${API}/ia/analyser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ element: pageInfo.title, donnees: inputs, resultats: results }),
      })
      setAiComment((await res.json()).commentaire)
    } catch { setAiComment("Erreur IA — vérifiez votre clé API.") }
    setAiLoading(false)
  }

  const handleSave = async () => {
    if (!results) return
    try {
      const res = await fetch("/api/calculs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activePage,
          title: pageInfo.title + " - " + new Date().toLocaleDateString("fr-FR"),
          inputs, results,
        }),
      })
      if (res.ok) { setSaveMsg("Sauvegardé ✓"); setTimeout(() => setSaveMsg(""), 2000) }
    } catch { setSaveMsg("Erreur") }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar onNavigate={handleNavigate} projet={projet} onProjetChange={setProjet} ingenieur={ingenieur} onIngenieurChange={setIngenieur} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{pageInfo.title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {pageInfo.sub} · {inputs.norme||"EC2"} · {inputs.beton||"C25/30"} · {inputs.acier||"B500B"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { setResults(null); setAiComment(""); setError("") }}>
              <RotateCcw className="size-4" /> Réinitialiser
            </Button>
            {results && saveMsg && <span className="text-sm text-emerald-600 font-medium">{saveMsg}</span>}
            {results && <Button variant="outline" size="sm" onClick={handleSave}>💾 Sauvegarder</Button>}
            {results && (
              <PdfExportButton
                projet={projet} ingenieur={ingenieur} norme={inputs.norme || "EC2"}
                activePage={activePage} inputs={inputs} results={results} schemaRef={schemaRef}
              />
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {activePage === "historique" ? (
            <HistoryPage onRestore={(type, inp, res) => {
              handleNavigate(type)
              setTimeout(() => { setInputs(inp); setResults(res) }, 100)
            }} />
          ) : activePage === "assistant-ia" ? (
            <AssistantIA norme={inputs.norme} beton={inputs.beton} acier={inputs.acier} />
          ) : activePage === "lecture-plans" ? (
            <LecturePlans norme={inputs.norme} beton={inputs.beton} acier={inputs.acier} />
          ) : (
            <>
              {results && <MetricCards results={results} norme={inputs.norme||"EC2"} activePage={activePage} />}

              {results && activePage === "poutre-simple" && (
                <div ref={schemaRef} className="mt-4 rounded-lg border border-border bg-card p-4">
                  <BeamSchema b={inputs.b} h={inputs.h} L={inputs.L}
                    As={results.As_retenu} choix={results.choix_armatures}
                    d={results.d} MEd={results.MEd} VEd={results.VEd} />
                </div>
              )}
              {results && activePage === "poteau" && (
                <div ref={schemaRef} className="mt-4 rounded-lg border border-border bg-card p-4">
                  <PoteauSchema b={inputs.b} h={inputs.h} longueur={inputs.longueur}
                    As={results.As_retenu} choix={results.choix_armatures}
                    d={results.d} NEd={results.NEd} lambda_={results.lambda_} />
                </div>
              )}
              {results && activePage === "semelle-isolee" && (
                <div ref={schemaRef} className="mt-4 rounded-lg border border-border bg-card p-4">
                  <SemelleIsoleeSchema b_p={inputs.b_p} h_p={inputs.h_p} h_sem={inputs.h_sem}
                    Ax={results.Ax} Ay={results.Ay}
                    sigma_max={results.sigma_max} sigma_ok={results.sigma_ok} />
                </div>
              )}
              {results && activePage === "acrotere" && (
                <div ref={schemaRef} className="mt-4 rounded-lg border border-border bg-card p-4">
                  <AcrotereSchema h={inputs.h} e={inputs.e}
                    MEd={results.MEd} NEd={results.NEd} choix={results.choix} />
                </div>
              )}
              {results && activePage === "escalier" && (
                <div ref={schemaRef} className="mt-4 rounded-lg border border-border bg-card p-4">
                  <EscalierSchema L_h={inputs.L_h} hauteur={inputs.hauteur}
                    g_giron={inputs.g_giron} h_contre={inputs.h_contre} ep={inputs.ep}
                    MEd={results.MEd} As_princ_retenu={results.As_princ_retenu}
                    choix_princ={results.choix_princ} alpha_deg={results.alpha_deg} />
                </div>
              )}
              {results && activePage === "poutre-continue" && results.travees_res && (
                <div className="mt-4 rounded-lg border border-border bg-card p-4">
                  <MomentDiagram travees={results.travees_res} />
                </div>
              )}

              {error && (
                <div className="mb-4 mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <div className={activePage === "poutre-continue" ? "mt-6 flex flex-col gap-6" : "mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2"}>
                <InputForm inputs={inputs} onChange={setInputs} activePage={activePage} />
                {activePage === "poutre-continue"
                  ? <PoutreContinueResults results={results} />
                  : <ResultsPanel results={results} activePage={activePage} />
                }
              </div>

              {hasEndpoint ? (
                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <Button onClick={handleCalc} disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                    <Calculator className="size-4" />
                    {loading ? "Calcul en cours..." : "Calculer"}
                  </Button>
                  <Button onClick={handleAI} disabled={aiLoading || !results}
                    className="border border-purple-500 text-purple-600 bg-transparent hover:bg-purple-50" size="lg">
                    <Sparkles className="size-4" />
                    {aiLoading ? "Analyse..." : "Analyser avec l'IA"}
                  </Button>
                </div>
              ) : (
                <div className="mt-10 flex justify-center">
                  <div className="text-center text-muted-foreground">
                    <span className="text-4xl">🚧</span>
                    <p className="mt-3 text-sm">Module en cours d&apos;intégration</p>
                  </div>
                </div>
              )}

              {aiComment && (
                <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-5">
                  <h3 className="mb-2 text-sm font-semibold text-purple-700">🤖 Analyse IA</h3>
                  <p className="text-sm text-purple-900 whitespace-pre-wrap leading-relaxed">{aiComment}</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
