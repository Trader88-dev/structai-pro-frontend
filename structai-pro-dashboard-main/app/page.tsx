import { Sidebar } from "@/components/sidebar"
import { MetricCards } from "@/components/metric-cards"
import { InputForm } from "@/components/input-form"
import { ResultsPanel } from "@/components/results-panel"
import { Button } from "@/components/ui/button"
import { Calculator, Sparkles, Download, RotateCcw } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-4">
          <div className="flex flex-col gap-1">
            <nav aria-label="Fil d'ariane" className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Poutres</span>
              <span aria-hidden="true">/</span>
              <span className="text-foreground">Poutre simple</span>
            </nav>
            <h1 className="text-balance text-xl font-semibold tracking-tight text-foreground">
              Poutre rectangulaire — Flexion simple
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="size-4" aria-hidden="true" />
              Réinitialiser
            </Button>
            <Button variant="outline" size="sm">
              <Download className="size-4" aria-hidden="true" />
              Note de calcul
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <MetricCards />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <InputForm />
            <ResultsPanel />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              <Calculator className="size-4" aria-hidden="true" />
              Calculer
            </Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
              <Sparkles className="size-4" aria-hidden="true" />
              Analyser IA
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
