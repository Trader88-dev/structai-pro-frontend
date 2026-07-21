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
            <h3 className="px-2 pb-2 text-[11px]
