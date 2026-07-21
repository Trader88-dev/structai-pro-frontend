"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import {
  Layers, Box, Building2, Grip, PanelTop, Squircle, Frame,
  GalleryVerticalEnd, Columns3, StretchHorizontal, Footprints,
  Component, Sparkles, FileSearch, Clock, LogOut, Menu, X,
  ArrowDownToLine,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  icon: React.ElementType
  id: string
  badge?: "NEW" | "IA" | "bientôt"
}

type NavGroup = {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: "Fondations",
    items: [
      { label: "Semelle filante",  icon: StretchHorizontal, id: "semelle-filante" },
      { label: "Semelle isolée",   icon: Box,               id: "semelle-isolee",   badge: "NEW" },
      { label: "Radier général",   icon: Layers,            id: "radier",           badge: "NEW" },
      { label: "Mur soutènement",  icon: Building2,         id: "mur-soutenement",  badge: "NEW" },
    ],
  },
  {
    title: "Structure verticale",
    items: [
      { label: "Poteau BA",  icon: Columns3,  id: "poteau" },
      { label: "Voile BA",   icon: PanelTop,  id: "voile",    badge: "NEW" },
      { label: "Acrotère",   icon: Squircle,  id: "acrotere", badge: "NEW" },
    ],
  },
  {
    title: "Poutres",
    items: [
      { label: "Poutre simple",   icon: GalleryVerticalEnd, id: "poutre-simple" },
      { label: "Poutre continue", icon: Grip,               id: "poutre-continue", badge: "NEW" },
    ],
  },
  {
    title: "Dalles & Planchers",
    items: [
      { label: "Dalle pleine", icon: Frame,      id: "dalle-pleine",  badge: "NEW" },
      { label: "Escalier",     icon: Footprints, id: "escalier",      badge: "NEW" },
      { label: "Linteau",      icon: Component,  id: "linteau",       badge: "NEW" },
    ],
  },
  {
    title: "Renforcements & Ouvertures",
    items: [
      { label: "Descente de charges", icon: ArrowDownToLine, id: "descente-charges", badge: "NEW" },
    ],
  },
  {
    title: "IA & Outils",
    items: [
      { label: "Assistant IA",  icon: Sparkles,   id: "assistant-ia",  badge: "IA" },
      { label: "Lecture plans", icon: FileSearch, id: "lecture-plans", badge: "IA" },
      { label: "Historique",    icon: Clock,      id: "historique" },
    ],
  },
]

const pageTitles: Record<string, { title: string; sub: string }> = {
  "poutre-simple":   { title: "Poutre rectangulaire — Flexion simple",       sub: "Flexion simple · ELU + ELS" },
  "poutre-continue": { title: "Poutre continue — Méthode de Caquot",         sub: "2 à 5 travées · ELU + ELS" },
  "poteau":          { title: "Poteau rectangulaire — Compression composée",  sub: "Flambement · EC2 / BAEL" },
  "voile":           { title: "Voile BA — Compression + Flexion composée",    sub: "Élancement · EC2 / BAEL" },
  "acrotere":        { title: "Acrotère — Flexion composée",                  sub: "Vent + Séisme EC8" },
  "semelle-filante": { title: "Semelle filante — Mur / Voile porteur",        sub: "ELS sol · Flexion · EC2" },
  "semelle-isolee":  { title: "Semelle isolée — Poteau BA",                   sub: "Sol · Flexion · Poinçonnement" },
  "radier":          { title: "Radier général — Dalle pleine",                sub: "Winkler · EC2 / BAEL" },
  "mur-soutenement": { title: "Mur de soutènement BA",                        sub: "Poussée Coulomb · Stabilité · Ferraillage" },
  "dalle-pleine":    { title: "Dalle pleine bidirectionnelle",                sub: "Marcus · ELU + ELS · EC2" },
  "escalier":        { title: "Escalier BA — Paillasse inclinée",             sub: "Flexion simple · EC2 / BAEL" },
  "linteau":         { title: "Linteau BA — Flexion simple",                  sub: "ELU + Cisaillement · EC2" },
  "descente-charges":{ title: "Descente de charges — Ouverture en mur porteur", sub: "Multi-niveaux · Profilé métallique · EC0/EC1/EC3" },
  "assistant-ia":    { title: "Assistant IA — Ingénieur Structural",          sub: "Claude · EC2 · BAEL · EC8" },
  "lecture-plans":   { title: "Lecture et Analyse de Plans",                  sub: "Vision IA · Extraction automatique" },
  "historique":      { title: "Historique des calculs",                       sub: "Vos calculs sauvegardés" },
}

export let activePageId = "poutre-simple"

function SidebarContent({
  active,
  navigate,
  projet,
  onProjetChange,
  ingenieur,
  onIngenieurChange,
}: {
  active: string
  navigate: (id: string) => void
  projet?: string
  onProjetChange?: (v: string) => void
  ingenieur?: string
  onIngenieurChange?: (v: string) => void
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Building2 className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-sidebar-foreground">StructAI Pro</span>
          <span className="font-mono text-[11px] leading-tight text-muted-foreground">EC2 · BAEL · EC8</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation principale">
        {groups.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            <h3 className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors text-left",
                      active === item.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-muted hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge === "NEW" && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">NEW</span>
                    )}
                    {item.badge === "IA" && (
                      <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">IA</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Projet + user + déconnexion */}
      <div className="border-t border-border px-4 py-3 flex flex-col gap-2">
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Projet actif</p>
          <input
            value={projet ?? ""}
            onChange={e => onProjetChange?.(e.target.value)}
            className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
            placeholder="Nom du projet"
          />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Ingénieur</p>
          <input
            value={ingenieur ?? ""}
            onChange={e => onIngenieurChange?.(e.target.value)}
            className="w-full rounded border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
            placeholder="Nom ingénieur"
          />
        </div>
        <div className="flex items-center gap-3 mt-1">
          <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            ME
          </div>
          <div className="flex flex-col leading-tight flex-1">
            <span className="text-xs font-medium text-sidebar-foreground">M. Eng.</span>
            <span className="text-[11px] text-muted-foreground">Pro · v1.0</span>
          </div>
        </div>

        {/* Bouton de déconnexion — texte visible, plus juste une icône */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="size-3.5" />
          Déconnexion
        </button>
      </div>
    </>
  )
}

export function Sidebar({ onNavigate, projet, onProjetChange, ingenieur, onIngenieurChange }: {
  onNavigate?: (id: string) => void
  projet?: string
  onProjetChange?: (v: string) => void
  ingenieur?: string
  onIngenieurChange?: (v: string) => void
}) {
  const [active, setActive] = useState("poutre-simple")
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = (id: string) => {
    setActive(id)
    activePageId = id
    onNavigate?.(id)
    setMobileOpen(false) // ferme le menu mobile après navigation
  }

  const sharedProps = { active, navigate, projet, onProjetChange, ingenieur, onIngenieurChange }

  return (
    <>
      {/* ── DESKTOP sidebar (≥ lg) ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
        <SidebarContent {...sharedProps} />
      </aside>

      {/* ── MOBILE top bar (< lg) ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border bg-sidebar px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Building2 className="size-4" aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground">StructAI Pro</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <Menu className="size-5" />
        </button>
      </div>

      {/* ── MOBILE drawer overlay ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <aside className="relative flex w-72 max-w-[85vw] flex-col border-r border-border bg-sidebar shadow-xl">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors z-10"
            >
              <X className="size-4" />
            </button>
            <SidebarContent {...sharedProps} />
          </aside>
        </div>
      )}
    </>
  )
}

export { pageTitles }
