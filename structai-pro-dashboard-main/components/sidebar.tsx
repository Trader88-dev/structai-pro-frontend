"use client"

import {
  Layers,
  Box,
  Building2,
  Grip,
  PanelTop,
  Squircle,
  Frame,
  GalleryVerticalEnd,
  Columns3,
  StretchHorizontal,
  Footprints,
  Component,
  Sparkles,
  FileSearch,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  icon: React.ElementType
  active?: boolean
}

type NavGroup = {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: "Fondations",
    items: [
      { label: "Semelle filante", icon: StretchHorizontal },
      { label: "Semelle isolée", icon: Box },
      { label: "Radier général", icon: Layers },
      { label: "Mur soutènement", icon: Building2 },
    ],
  },
  {
    title: "Structure verticale",
    items: [
      { label: "Poteau BA", icon: Columns3 },
      { label: "Voile BA", icon: PanelTop },
      { label: "Acrotère", icon: Squircle },
    ],
  },
  {
    title: "Poutres",
    items: [
      { label: "Poutre simple", icon: GalleryVerticalEnd, active: true },
      { label: "Poutre continue", icon: Grip },
    ],
  },
  {
    title: "Dalles",
    items: [
      { label: "Dalle pleine", icon: Frame },
      { label: "Escalier", icon: Footprints },
      { label: "Linteau", icon: Component },
    ],
  },
  {
    title: "IA & Outils",
    items: [
      { label: "Assistant IA", icon: Sparkles },
      { label: "Lecture plans", icon: FileSearch },
    ],
  },
]

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Box className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight text-sidebar-foreground">StructAI Pro</span>
          <span className="font-mono text-[11px] leading-tight text-muted-foreground">EC2 · BAEL · EC8</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigation principale">
        {groups.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            <h3 className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </h3>
            <ul className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                      item.active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-muted hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            ME
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-medium text-sidebar-foreground">M. Eng.</span>
            <span className="text-[11px] text-muted-foreground">Pro · v2.4</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
