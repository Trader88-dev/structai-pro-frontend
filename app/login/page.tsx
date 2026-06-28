"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Boxes, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

function StructuralIllustration() {
  return (
    <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)" />
      <line x1="80" y1="250" x2="80" y2="100" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="320" y1="250" x2="320" y2="100" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="100" x2="320" y2="100" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="250" x2="100" y2="250" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <line x1="300" y1="250" x2="340" y2="250" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="100" r="6" fill="#2563eb" />
      <circle cx="320" cy="100" r="6" fill="#2563eb" />
      <circle cx="80" cy="250" r="5" fill="#64748b" />
      <circle cx="320" cy="250" r="5" fill="#64748b" />
      <line x1="80" y1="270" x2="320" y2="270" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
      <line x1="80" y1="265" x2="80" y2="275" stroke="#94a3b8" strokeWidth="1" />
      <line x1="320" y1="265" x2="320" y2="275" stroke="#94a3b8" strokeWidth="1" />
      <text x="200" y="285" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter, sans-serif">L = 6.00 m</text>
      <line x1="55" y1="100" x2="55" y2="250" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
      <line x1="50" y1="100" x2="60" y2="100" stroke="#94a3b8" strokeWidth="1" />
      <line x1="50" y1="250" x2="60" y2="250" stroke="#94a3b8" strokeWidth="1" />
      <text x="40" y="180" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter, sans-serif" transform="rotate(-90, 40, 180)">h = 4.50 m</text>
      {[120, 160, 200, 240, 280].map((x) => (
        <g key={x}>
          <line x1={x} y1="60" x2={x} y2="95" stroke="#ef4444" strokeWidth="1.5" />
          <polygon points={`${x},95 ${x-4},85 ${x+4},85`} fill="#ef4444" />
        </g>
      ))}
      <text x="200" y="50" textAnchor="middle" fill="#dc2626" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="500">q = 15 kN/m</text>
      <circle cx="200" cy="100" r="3" fill="#22c55e" />
      <line x1="193" y1="97" x2="185" y2="90" stroke="#22c55e" strokeWidth="1" />
      <text x="175" y="88" fill="#16a34a" fontSize="9" fontFamily="Inter, sans-serif">S1</text>
      <rect x="175" y="130" width="50" height="18" rx="3" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="0.5" />
      <text x="200" y="143" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="Inter, sans-serif">BAEL</text>
    </svg>
  )
}

function TestimonialCard() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-gray-100/50 max-w-sm mx-auto">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        &quot;StructAI Pro m&apos;a fait gagner 3h par projet. Les calculs BAEL sont automatisés et je peux exporter les notes de calcul directement.&quot;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600">MK</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">M. Kaabar</p>
          <p className="text-xs text-gray-500">BET MM.Ingénierie</p>
        </div>
      </div>
    </div>
  )
}

const inputClass = "w-full h-11 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none px-3 transition-colors focus:border-blue-500 focus:bg-white placeholder:text-gray-400"

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [name, setName]           = useState("")
  const [email, setEmail]         = useState("")
  const [password, setPassword]   = useState("")
  const [showPass, setShowPass]   = useState(false)
  const [error, setError]         = useState("")
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) setEmail(decodeURIComponent(emailParam))
    if (searchParams.get("registered") === "1") setActiveTab("login")
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

      {/* ── LEFT PANEL — formulaire ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-semibold text-[15px]">StructAI Pro</span>
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            {activeTab === "login" ? "Bon retour 👋" : "Créer un compte"}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {activeTab === "login"
              ? "Accédez à vos 12 modules de calcul EC2 & BAEL"
              : "Commencez gratuitement, sans carte bancaire"}
          </p>

          {/* Tab switcher natif */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            <button
              onClick={() => { setActiveTab("login"); setError("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              Se connecter
            </button>
            <button
              onClick={() => { setActiveTab("register"); setError("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              Créer un compte
            </button>
          </div>

          {/* ── Formulaire LOGIN ── */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email-login" className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="email-login" type="email" placeholder="vous@exemple.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                    className={`${inputClass} pl-10`} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password-login" className="text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="password-login" type={showPass ? "text" : "password"} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                    className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" disabled={loading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Connexion...</>
                  : <>Accéder à StructAI Pro <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          )}

          {/* ── Formulaire REGISTER ── */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Nom complet</label>
                <input id="name" type="text" placeholder="Jean Dupont"
                  value={name} onChange={e => setName(e.target.value)} required
                  className={inputClass} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email-register" className="text-sm font-medium text-gray-700">Email professionnel</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="email-register" type="email" placeholder="vous@entreprise.com"
                    value={email} onChange={e => setEmail(e.target.value)} required
                    className={`${inputClass} pl-10`} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password-register" className="text-sm font-medium text-gray-700">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input id="password-register" type={showPass ? "text" : "password"} placeholder="Minimum 6 caractères"
                    value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                    className={`${inputClass} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">{error}</div>
              )}

              <Button type="submit" disabled={loading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2">
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</>
                  : <>Créer mon compte <ArrowRight className="w-4 h-4" /></>}
              </Button>
            </form>
          )}

          {/* CGU */}
          <p className="text-xs text-gray-500 text-center mt-6">
            En continuant, vous acceptez nos{" "}
            <a href="https://structaipro.com/cgu" className="text-blue-600 hover:text-blue-700 font-medium">
              conditions d&apos;utilisation
            </a>
            .
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — décoratif ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50 items-center justify-center p-12">
        <div className="max-w-lg w-full">
          <div className="mb-12">
            <StructuralIllustration />
          </div>
          <TestimonialCard />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            {["EC2 & BAEL", "12 Modules", "Export PDF"].map((label) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-gray-200/50 text-xs font-medium text-gray-600">
                <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
