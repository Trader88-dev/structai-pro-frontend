"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Box, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [mode, setMode] = useState<"login"|"register">("login")
  const [name, setName]         = useState("")
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

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
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#185FA5]">
            <Box className="size-6 text-white" />
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-900">StructAI Pro</div>
            <div className="text-xs text-gray-500 font-mono">EC2 · BAEL · EC8</div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-1">
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === "login" ? "Accédez à votre espace de calcul" : "Commencez gratuitement"}
          </p>

          <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="flex flex-col gap-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#185FA5] focus:bg-white transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ingenieur@bet.fr" required
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#185FA5] focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required minLength={6}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#185FA5] focus:bg-white transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="h-10 rounded-lg bg-[#185FA5] text-white text-sm font-medium hover:bg-[#1451A0] disabled:opacity-50 flex items-center justify-center gap-2 mt-1">
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-500">
            {mode === "login" ? (
              <>Pas encore de compte ?{" "}
                <button onClick={() => { setMode("register"); setError("") }}
                  className="text-[#185FA5] font-medium hover:underline">S&apos;inscrire</button>
              </>
            ) : (
              <>Déjà un compte ?{" "}
                <button onClick={() => { setMode("login"); setError("") }}
                  className="text-[#185FA5] font-medium hover:underline">Se connecter</button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          StructAI Pro — Logiciel de calcul de structures béton armé
        </p>
      </div>
    </div>
  )
}
