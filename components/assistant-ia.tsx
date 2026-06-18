"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Send, Trash2, Zap, BarChart3, AlertTriangle, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const API = "http://127.0.0.1:8000"

type Msg = { role: "user" | "assistant"; content: string }

const QUICK_PROMPTS = [
  { icon: Zap,           label: "Optimiser une section",    text: "Quelle section optimale pour une poutre de 7m avec 25 kN/m en C25/30 B500B ?" },
  { icon: BarChart3,     label: "Comparer des variantes",   text: "Compare 3 variantes structurales pour un plancher de 6×8m avec charge 5 kN/m²" },
  { icon: AlertTriangle, label: "Détecter des anomalies",   text: "Vérifie la cohérence : poutre b=200mm h=600mm portée 9m charge 40kN/m en C25/30" },
  { icon: FileText,      label: "Rédiger une note",         text: "Rédige une note de calcul professionnelle pour une poutre b=250mm h=500mm L=6m MEd=112kN.m As=1340mm²" },
]

export default function AssistantIA({ norme, beton, acier }: { norme?: string; beton?: string; acier?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState("💬 Conversationnel")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs])

  const send = async (text?: string) => {
    const question = text || input.trim()
    if (!question || loading) return
    const newMsgs: Msg[] = [...msgs, { role: "user", content: question }]
    setMsgs(newMsgs); setInput(""); setLoading(true)
    try {
      const res = await fetch(`${API}/ia/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs, norme: norme||"EC2", beton: beton||"C25/30", acier: acier||"B500B" }),
      })
      const data = await res.json()
      setMsgs([...newMsgs, { role: "assistant", content: data.response }])
    } catch { setMsgs([...newMsgs, { role: "assistant", content: "❌ Erreur — vérifiez que le backend tourne et que la clé API est configurée." }]) }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Header IA */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-purple-100">
            <Sparkles className="size-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Assistant IA Structural</p>
            <p className="text-xs text-muted-foreground">Claude · {norme||"EC2"} · {beton||"C25/30"} · {acier||"B500B"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={mode} onChange={e => setMode(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none">
            <option>💬 Conversationnel</option>
            <option>⚙️ Optimisation</option>
            <option>📊 Variantes</option>
            <option>🚨 Anomalies</option>
            <option>📝 Rapport</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => setMsgs([])}>
            <Trash2 className="size-3.5" /> Effacer
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div>
              <Sparkles className="size-12 mx-auto mb-3 text-purple-300" />
              <h2 className="text-lg font-semibold text-foreground mb-1">Assistant IA Structural</h2>
              <p className="text-sm text-muted-foreground">Posez une question technique ou choisissez un raccourci ci-dessous</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {QUICK_PROMPTS.map(q => (
                <button key={q.label} onClick={() => send(q.text)}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3 text-left text-sm hover:bg-muted transition-colors">
                  <q.icon className="size-4 text-purple-500 shrink-0" />
                  <span className="font-medium text-foreground">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-100 mt-0.5">
                <Sparkles className="size-3.5 text-purple-600" />
              </div>
            )}
            <div className={cn(
              "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
              m.role === "user"
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-card border border-border text-foreground rounded-bl-sm"
            )} style={{ whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-100">
              <Sparkles className="size-3.5 text-purple-600" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <div className="size-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="size-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="size-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 rounded-xl border border-border bg-background focus-within:border-ring transition-colors">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Posez votre question... (Entrée pour envoyer, Maj+Entrée pour saut de ligne)"
              rows={1}
              className="w-full bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
              style={{ minHeight: 44, maxHeight: 120 }}
            />
          </div>
          <Button onClick={() => send()} disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-4">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
