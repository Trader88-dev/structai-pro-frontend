"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Box, Loader2, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const [mode, setMode]         = useState<"login"|"register">("login")
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) setEmail(decodeURIComponent(emailParam))
    if (searchParams.get("registered") === "1") setMode("login")
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) { setError("Email ou mot de passe incorrect"); setLoading(false); return }
    router.push("/")
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || "Erreur"); setLoading(false); return }
    const login = await signIn("credentials", { email, password, redirect: false })
    if (login?.error) { setError("Erreur de connexion"); setLoading(false); return }
    router.push("/")
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0C1929] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#185FA5]">
            <Box className="size-5 text-white" />
          </div>
          <span className="text-white font-semibold text-lg">StructAI Pro</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Calculez plus vite.<br/>
            <span className="text-[#4A9FE0]">Sans jamais douter.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Assistant IA pour le dimensionnement béton armé. EC2, BAEL, notes de calcul PDF professionnelles.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { icon: "⚡", text: "12 modules de calcul EC2 et BAEL" },
              { icon: "📄", text: "Notes PDF prêtes à soumettre" },
              { icon: "🤖", text: "Assistant IA intégré" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-slate-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">© 2026 StructAI Pro — EC2 · BAEL · EC8</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-[#F8F9FA]">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#185FA5]">
              <Box className="size-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">StructAI Pro</div>
              <div className="text-xs text-gray-500 font-mono">EC2 · BAEL · EC8</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button onClick={() => { setMode("login"); setError("") }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Se connecter
              </button>
              <button onClick={() => { setMode("register"); setError("") }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${mode === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                Créer un compte
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              {mode === "login" ? "Accédez à votre espace de calcul" : "Commencez gratuitement, sans carte bancaire"}
            </p>

            <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="flex flex-col gap-4">
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont"
                    className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#185FA5] focus:bg-white transition-colors" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ingenieur@bet.fr" required
                  className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#185FA5] focus:bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required minLength={6}
                    className="w-full h-11 px-3 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#185FA5] focus:bg-white transition-colors" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              {error && <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">{error}</div>}
              <button type="submit" disabled={loading}
                className="h-11 rounded-lg bg-[#185FA5] text-white text-sm font-medium hover:bg-[#1451A0] disabled:opacity-50 flex items-center justify-center gap-2 mt-1 transition-colors">
                {loading && <Loader2 className="size-4 animate-spin" />}
                {mode === "login" ? "Accéder à StructAI Pro" : "Créer mon compte"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            En continuant, vous acceptez nos{" "}
            <a href="https://structaipro.com/cgu" className="text-[#185FA5] hover:underline">conditions d&apos;utilisation</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
