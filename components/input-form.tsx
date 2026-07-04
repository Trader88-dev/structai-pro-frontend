"use client"

// ── Config des champs par page ────────────────────────────────────────────────
const BETONS = ["C20/25","C25/30","C30/37","C35/45","C40/50"]
const ACIERS = ["B500B","B500A","FeE400"]
const ENROBAGES = ["XC1","XC2","XC3","XC4"]
const NORMES = ["EC2","BAEL"]
const PROFILES_METAL = ["HEA100","HEA120","HEA140","HEA160","IPE100","IPE120","IPE140","IPE160","IPN140","IPN160"]
const ACIERS_METAL = ["S235","S275","S355"]
const APPUIS = ["appuye","encastre","libre"]
const APPUIS_POTEAU = ["encastre-rotule","rotule-rotule","encastre-encastre"]
const ZONES_SISMIQUES = ["1","2","3","4"]

type FieldDef = {
  key: string
  label: string
  unit: string
  type: "number" | "select"
  options?: string[]
  default: any
  step?: number
  min?: number
}

type SectionDef = { title: string; fields: FieldDef[] }

const PAGE_FORMS: Record<string, SectionDef[]> = {
  "poutre-simple": [
    { title: "Géométrie", fields: [
      { key:"b",    label:"Largeur b",  unit:"mm", type:"number", default:250, step:25, min:100 },
      { key:"h",    label:"Hauteur h",  unit:"mm", type:"number", default:500, step:25, min:150 },
      { key:"L",    label:"Portée L",   unit:"m",  type:"number", default:6.0, step:0.25, min:1 },
    ]},
    { title: "Chargement", fields: [
      { key:"g_k",  label:"Charge permanente Gk", unit:"kN/m", type:"number", default:15.0, step:0.5 },
      { key:"q_k",  label:"Charge variable Qk",   unit:"kN/m", type:"number", default:10.0, step:0.5 },
    ]},
    { title: "Charge concentree (optionnel)", fields: [
      { key:"P_k",  label:"Force P",     unit:"kN", type:"number", default:0, step:5, min:0 },
      { key:"P_a",  label:"Position a",  unit:"m",  type:"number", default:0, step:0.1, min:0 },
    ]},
    { title: "Charge trapezoidale (optionnel)", fields: [
      { key:"q1_k", label:"q1 gauche",  unit:"kN/m", type:"number", default:0, step:1, min:0 },
      { key:"q2_k", label:"q2 droite",  unit:"kN/m", type:"number", default:0, step:1, min:0 },
    ]},
    { title: "Materiaux & Norme", fields: [
      { key:"norme",           label:"Norme",    unit:"", type:"select", options:NORMES,    default:"EC2" },
      { key:"beton",           label:"Beton",    unit:"", type:"select", options:BETONS,    default:"C25/30" },
      { key:"acier",           label:"Acier",    unit:"", type:"select", options:ACIERS,    default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "poteau": [
    { title: "Géométrie", fields: [
      { key:"b",        label:"Largeur b",   unit:"mm", type:"number", default:300, step:25 },
      { key:"h",        label:"Hauteur h",   unit:"mm", type:"number", default:300, step:25 },
      { key:"longueur", label:"Longueur",    unit:"m",  type:"number", default:3.5, step:0.1 },
      { key:"conditions_appui", label:"Appuis", unit:"", type:"select", options:APPUIS_POTEAU, default:"encastre-rotule" },
    ]},
    { title: "Chargement", fields: [
      { key:"N_k",  label:"Effort normal Nk",  unit:"kN",   type:"number", default:800, step:10 },
      { key:"M_k",  label:"Moment Mk",         unit:"kN.m", type:"number", default:20,  step:1 },
      { key:"pct_G",label:"% charges perm.",   unit:"%",    type:"number", default:70,  step:5, min:0 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme",           label:"Norme",    unit:"", type:"select", options:NORMES,    default:"EC2" },
      { key:"beton",           label:"Béton",    unit:"", type:"select", options:BETONS,    default:"C25/30" },
      { key:"acier",           label:"Acier",    unit:"", type:"select", options:ACIERS,    default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "semelle-filante": [
    { title: "Géométrie", fields: [
      { key:"b_mur",     label:"Largeur mur/voile", unit:"mm", type:"number", default:200, step:25 },
      { key:"h_semelle", label:"Hauteur semelle",   unit:"mm", type:"number", default:400, step:25 },
    ]},
    { title: "Chargement & Sol", fields: [
      { key:"N_k",       label:"Charge Nk",          unit:"kN/ml",  type:"number", default:200, step:10 },
      { key:"M_k",       label:"Moment Mk",           unit:"kN.m/ml",type:"number", default:0,   step:1 },
      { key:"sigma_sol", label:"Contrainte sol adm.", unit:"kPa",    type:"number", default:200, step:25 },
      { key:"pct_G",     label:"% charges perm.",    unit:"%",      type:"number", default:70,  step:5 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
    ]},
  ],
  "semelle-isolee": [
    { title: "Poteau", fields: [
      { key:"b_p",    label:"Largeur poteau",  unit:"mm", type:"number", default:300, step:25 },
      { key:"h_p",    label:"Hauteur poteau",  unit:"mm", type:"number", default:300, step:25 },
      { key:"h_sem",  label:"Hauteur semelle", unit:"mm", type:"number", default:500, step:25 },
    ]},
    { title: "Chargement & Sol", fields: [
      { key:"N_k",       label:"Charge Nk",          unit:"kN",  type:"number", default:800, step:50 },
      { key:"M_kx",      label:"Moment Mkx",          unit:"kN.m",type:"number", default:0,   step:5 },
      { key:"M_ky",      label:"Moment Mky",          unit:"kN.m",type:"number", default:0,   step:5 },
      { key:"sigma_sol", label:"Contrainte sol adm.", unit:"kPa", type:"number", default:200, step:25 },
      { key:"pct_G",     label:"% charges perm.",    unit:"%",   type:"number", default:70,  step:5 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "radier": [
    { title: "Géométrie", fields: [
      { key:"Lx",       label:"Longueur Lx",  unit:"m",  type:"number", default:10, step:0.5 },
      { key:"Ly",       label:"Largeur Ly",   unit:"m",  type:"number", default:8,  step:0.5 },
      { key:"epaisseur",label:"Épaisseur",    unit:"mm", type:"number", default:400, step:50 },
      { key:"debord",   label:"Débord",       unit:"mm", type:"number", default:300, step:50 },
    ]},
    { title: "Chargement & Sol", fields: [
      { key:"N_k",       label:"Charge totale Nk",    unit:"kN",   type:"number", default:5000, step:100 },
      { key:"M_kx",      label:"Moment Mkx",           unit:"kN.m", type:"number", default:0,    step:10 },
      { key:"M_ky",      label:"Moment Mky",           unit:"kN.m", type:"number", default:0,    step:10 },
      { key:"sigma_sol", label:"Contrainte sol adm.", unit:"kPa",  type:"number", default:150, step:25 },
      { key:"ks",        label:"Module réaction ks",  unit:"kN/m³",type:"number", default:30000, step:5000 },
      { key:"pct_G",     label:"% charges perm.",     unit:"%",    type:"number", default:70, step:5 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "dalle-pleine": [
    { title: "Géométrie", fields: [
      { key:"Lx",       label:"Petit côté Lx", unit:"m",  type:"number", default:4.0, step:0.25 },
      { key:"Ly",
