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

// ── Descente de charges v2 : libellés affichés → clés backend ────────────────
export const DDC_INTERVENTION_MAP: Record<string, string> = {
  "Ouverture en mur porteur (linteau)":        "ouverture_mur",
  "Grande baie / garage (portique)":           "grande_baie",
  "Trémie de plancher (chevêtre)":             "chevetre",
  "Renforcement de poutre (moisage)":          "moisage",
  "Suppression de porteur (poutre de reprise)":"suppression_porteur",
  "Reprise en sous-œuvre":                     "reprise_sous_oeuvre",
  "Surélévation (vérification existant)":      "surelevation",
  "Vérification mur / fondations":             "verification_mur",
}
export const DDC_INTERVENTIONS = Object.keys(DDC_INTERVENTION_MAP)

export const DDC_LARGEUR_MAP: Record<string, string> = {
  "Par portées des dalles (auto)": "portees",
  "Directe (m)":                   "directe",
}
const DDC_MODES_LARGEUR = Object.keys(DDC_LARGEUR_MAP)

export const DDC_PLANCHER_MAP: Record<string, string> = {
  "Hourdis 12+4":           "hourdis_12_4",
  "Hourdis 16+4":           "hourdis_16_4",
  "Hourdis 20+4":           "hourdis_20_4",
  "Hourdis 25+5":           "hourdis_25_5",
  "Dalle pleine BA":        "dalle_pleine",
  "Plancher bois":          "bois",
  "Personnalisé (g direct)":"personnalise",
}
const DDC_PLANCHERS = Object.keys(DDC_PLANCHER_MAP)

export const DDC_USAGE_MAP: Record<string, string> = {
  "Habitation":              "habitation",
  "Bureaux":                 "bureaux",
  "Commerce":                "commerce",
  "Escalier":                "escalier",
  "Balcon":                  "balcon",
  "Parking VL":              "parking_vl",
  "Terrasse accessible":     "terrasse_accessible",
  "Toiture inaccessible":    "toiture_inaccessible",
  "Comble":                  "comble",
  "Personnalisé (q direct)": "personnalise",
}
const DDC_USAGES = Object.keys(DDC_USAGE_MAP)

type FieldDef = {
  key: string
  label: string
  unit: string
  type: "number" | "select" | "text"
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
      { key:"Ly",       label:"Grand côté Ly", unit:"m",  type:"number", default:5.5, step:0.25 },
      { key:"epaisseur",label:"Épaisseur",     unit:"mm", type:"number", default:180, step:10 },
    ]},
    { title: "Appuis", fields: [
      { key:"appui_x1", label:"Rive x=0",  unit:"", type:"select", options:APPUIS, default:"appuye" },
      { key:"appui_x2", label:"Rive x=Lx", unit:"", type:"select", options:APPUIS, default:"appuye" },
      { key:"appui_y1", label:"Rive y=0",  unit:"", type:"select", options:APPUIS, default:"appuye" },
      { key:"appui_y2", label:"Rive y=Ly", unit:"", type:"select", options:APPUIS, default:"appuye" },
    ]},
    { title: "Chargement", fields: [
      { key:"g_k", label:"Charge permanente Gk", unit:"kN/m²", type:"number", default:5.0, step:0.5 },
      { key:"q_k", label:"Charge variable Qk",   unit:"kN/m²", type:"number", default:2.5, step:0.5 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe",      label:"Enrobage",     unit:"", type:"select", options:ENROBAGES, default:"XC1" },
      { key:"classe_fissuration",   label:"Fissuration",  unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "voile": [
    { title: "Géométrie", fields: [
      { key:"L",     label:"Longueur voile", unit:"m",  type:"number", default:3.0,  step:0.25 },
      { key:"h",     label:"Hauteur voile",  unit:"m",  type:"number", default:3.0,  step:0.1 },
      { key:"e",     label:"Épaisseur",      unit:"mm", type:"number", default:200,  step:25 },
      { key:"appui", label:"Appuis",         unit:"",   type:"select", options:APPUIS_POTEAU, default:"encastre-rotule" },
    ]},
    { title: "Chargement", fields: [
      { key:"N_k",  label:"Effort normal Nk",   unit:"kN",   type:"number", default:500, step:50 },
      { key:"M_k",  label:"Moment Mk",           unit:"kN.m", type:"number", default:50,  step:5 },
      { key:"V_k",  label:"Effort tranchant Vk", unit:"kN",   type:"number", default:20,  step:5 },
      { key:"pct_G",label:"% charges perm.",     unit:"%",    type:"number", default:70,  step:5 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "escalier": [
    { title: "Géométrie", fields: [
      { key:"L_h",       label:"Longueur horiz.", unit:"m",  type:"number", default:3.0,  step:0.1 },
      { key:"hauteur",   label:"Hauteur totale",  unit:"m",  type:"number", default:2.7,  step:0.1 },
      { key:"g_giron",   label:"Giron",           unit:"m",  type:"number", default:0.28, step:0.01 },
      { key:"h_contre",  label:"Contre-marche",   unit:"m",  type:"number", default:0.17, step:0.01 },
      { key:"ep",        label:"Épaisseur",        unit:"mm", type:"number", default:150,  step:10 },
    ]},
    { title: "Chargement", fields: [
      { key:"g_k", label:"Charge permanente Gk", unit:"kN/m²", type:"number", default:6.0, step:0.5 },
      { key:"q_k", label:"Charge variable Qk",   unit:"kN/m²", type:"number", default:2.5, step:0.5 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "acrotere": [
    { title: "Géométrie", fields: [
      { key:"h", label:"Hauteur acrotère", unit:"m",  type:"number", default:0.80, step:0.05 },
      { key:"e", label:"Épaisseur",        unit:"mm", type:"number", default:150,  step:10 },
    ]},
    { title: "Chargement", fields: [
      { key:"g_k",           label:"Charge permanente Gk", unit:"kN/ml",  type:"number", default:3.5, step:0.5 },
      { key:"q_vent",        label:"Pression vent",         unit:"kN/m²",  type:"number", default:1.0, step:0.1 },
      { key:"zone_sismique", label:"Zone sismique",         unit:"",        type:"select", options:ZONES_SISMIQUES, default:"2" },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "poutre-continue": [
    { title: "Section transversale", fields: [
      { key:"b", label:"Largeur b", unit:"mm", type:"number", default:250, step:25, min:100 },
      { key:"h", label:"Hauteur h", unit:"mm", type:"number", default:600, step:25, min:200 },
    ]},
    { title: "Conditions aux appuis extremes", fields: [
      { key:"appui_gauche", label:"Appui gauche", unit:"", type:"select", options:["appuye","encastre"], default:"appuye" },
      { key:"appui_droit",  label:"Appui droit",  unit:"", type:"select", options:["appuye","encastre"], default:"appuye" },
      { key:"nb_travees",   label:"Nombre de travees", unit:"", type:"number", default:3, step:1, min:2 },
    ]},
    { title: "Travee 1", fields: [
      { key:"L1", label:"Portee L1", unit:"m",    type:"number", default:5.0, step:0.25 },
      { key:"g1", label:"Gk1",       unit:"kN/m", type:"number", default:15.0, step:1 },
      { key:"q1", label:"Qk1",       unit:"kN/m", type:"number", default:10.0, step:1 },
    ]},
    { title: "Travee 2", fields: [
      { key:"L2", label:"Portee L2", unit:"m",    type:"number", default:5.0, step:0.25 },
      { key:"g2", label:"Gk2",       unit:"kN/m", type:"number", default:15.0, step:1 },
      { key:"q2", label:"Qk2",       unit:"kN/m", type:"number", default:10.0, step:1 },
    ]},
    { title: "Travee 3", fields: [
      { key:"L3", label:"Portee L3", unit:"m",    type:"number", default:5.0, step:0.25 },
      { key:"g3", label:"Gk3",       unit:"kN/m", type:"number", default:15.0, step:1 },
      { key:"q3", label:"Qk3",       unit:"kN/m", type:"number", default:10.0, step:1 },
    ]},
    { title: "Materiaux & Norme", fields: [
      { key:"norme",           label:"Norme",    unit:"", type:"select", options:["EC2","BAEL"], default:"EC2" },
      { key:"beton",           label:"Beton",    unit:"", type:"select", options:["C20/25","C25/30","C30/37","C35/45","C40/50"], default:"C25/30" },
      { key:"acier",           label:"Acier",    unit:"", type:"select", options:["B500B","B500A","FeE400"], default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:["XC1","XC2","XC3","XC4"], default:"XC1" },
    ]},
  ],
  "linteau": [
    { title: "Géométrie", fields: [
      { key:"b", label:"Largeur b", unit:"mm", type:"number", default:200, step:25 },
      { key:"h", label:"Hauteur h", unit:"mm", type:"number", default:300, step:25 },
      { key:"L", label:"Portée L",  unit:"m",  type:"number", default:1.5, step:0.1 },
    ]},
    { title: "Chargement", fields: [
      { key:"g_k", label:"Charge permanente Gk", unit:"kN/m", type:"number", default:10.0, step:1 },
      { key:"q_k", label:"Charge variable Qk",   unit:"kN/m", type:"number", default:5.0,  step:1 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:ENROBAGES, default:"XC1" },
    ]},
  ],
  "descente-charges": [
    { title: "Nature de l'intervention", fields: [
      { key:"intervention", label:"Intervention",       unit:"", type:"select", options:DDC_INTERVENTIONS, default:DDC_INTERVENTIONS[0] },
      { key:"nb_niveaux",   label:"Niveaux repris (au-dessus)", unit:"", type:"number", default:3, step:1, min:1 },
      { key:"fraction",     label:"Fraction reprise",   unit:"%", type:"number", default:100, step:5, min:5 },
    ]},
  ],
  "mur-soutenement": [
    { title: "Géométrie", fields: [
      { key:"H",             label:"Hauteur totale",    unit:"m",  type:"number", default:3.0,  step:0.1 },
      { key:"e_voile",       label:"Épaisseur voile",   unit:"mm", type:"number", default:250,  step:25 },
      { key:"B_semelle",     label:"Largeur semelle",   unit:"m",  type:"number", default:2.0,  step:0.1 },
      { key:"e_semelle",     label:"Épaisseur semelle", unit:"mm", type:"number", default:400,  step:25 },
      { key:"d_encastrement",label:"Prof. encastrement",unit:"m",  type:"number", default:0.5,  step:0.1 },
    ]},
    { title: "Sol & Chargement", fields: [
      { key:"gamma_terre",    label:"Poids vol. terre",  unit:"kN/m³", type:"number", default:18,  step:1 },
      { key:"phi_deg",        label:"Angle frottement φ",unit:"°",     type:"number", default:30,  step:1 },
      { key:"q_surcharge",    label:"Surcharge derrière",unit:"kN/m²", type:"number", default:10,  step:1 },
      { key:"sigma_sol",      label:"Contrainte sol adm.",unit:"kPa",  type:"number", default:200, step:25 },
      { key:"mu_glissement",  label:"Coeff. glissement", unit:"—",     type:"number", default:0.5, step:0.05 },
    ]},
    { title: "Matériaux & Norme", fields: [
      { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
      { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
      { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
      { key:"enrobage_classe", label:"Enrobage", unit:"", type:"select", options:["XC2","XC3","XC4"], default:"XC2" },
    ]},
  ],
}

// Défaut générique pour pages non configurées
const DEFAULT_FORM: SectionDef[] = [
  { title: "Paramètres", fields: [
    { key:"norme", label:"Norme", unit:"", type:"select", options:NORMES, default:"EC2" },
    { key:"beton", label:"Béton", unit:"", type:"select", options:BETONS, default:"C25/30" },
    { key:"acier", label:"Acier", unit:"", type:"select", options:ACIERS, default:"B500B" },
  ]},
]

// ── Descente de charges v2 : l'ingénieur décrit sa structure ─────────────────
export const DDC_MAX_NIVEAUX = 15
export const DDC_MAX_PONCTUELLES = 3

// Configuration de l'élément récepteur selon l'intervention (miroir backend)
export function ddcConfig(interventionLabel: string) {
  const k = DDC_INTERVENTION_MAP[interventionLabel] || "ouverture_mur"
  return {
    key: k,
    poutre:     !["surelevation","verification_mur"].includes(k),
    fondations: ["grande_baie","suppression_porteur","reprise_sous_oeuvre","surelevation","verification_mur"].includes(k),
    mur:        ["surelevation","verification_mur"].includes(k),
    moisage:    k === "moisage",
  }
}

function ddcNiveauSection(i: number, inputs: Record<string, any>): SectionDef {
  const fields: FieldDef[] = [
    { key:`nom${i}`,      label:"Désignation",   unit:"",     type:"text",   default:`Niveau ${i}` },
    { key:`h${i}`,        label:"Hauteur mur",   unit:"m",    type:"number", default:2.5, step:0.1 },
    { key:`ep${i}`,       label:"Épaisseur mur", unit:"m",    type:"number", default:0.2, step:0.05 },
    { key:`dens${i}`,     label:"Densité mur",   unit:"T/m³", type:"number", default:2.2, step:0.1 },
    { key:`modeLarg${i}`, label:"Largeur reprise", unit:"",   type:"select", options:DDC_MODES_LARGEUR, default:DDC_MODES_LARGEUR[0] },
  ]
  // Largeur : demi-portées (auto) ou directe
  const modeLarg = inputs[`modeLarg${i}`] ?? DDC_MODES_LARGEUR[0]
  if (DDC_LARGEUR_MAP[modeLarg] === "portees") {
    fields.push(
      { key:`pg${i}`, label:"Portée dalle gauche", unit:"m", type:"number", default:0, step:0.1, min:0 },
      { key:`pd${i}`, label:"Portée dalle droite", unit:"m", type:"number", default:0, step:0.1, min:0 },
    )
  } else {
    fields.push({ key:`larg${i}`, label:"Largeur plancher", unit:"m", type:"number", default:3.0, step:0.25 })
  }
  // g : composition ou direct
  fields.push({ key:`typePl${i}`, label:"Type de plancher", unit:"", type:"select", options:DDC_PLANCHERS, default:"Personnalisé (g direct)" })
  const typePl = DDC_PLANCHER_MAP[inputs[`typePl${i}`] ?? "Personnalisé (g direct)"]
  if (typePl === "personnalise") {
    fields.push({ key:`g${i}`, label:"g plancher", unit:"T/m²", type:"number", default:0.25, step:0.05 })
  } else {
    if (typePl === "dalle_pleine")
      fields.push({ key:`epd${i}`, label:"Épaisseur dalle", unit:"m", type:"number", default:0.16, step:0.02, min:0.04 })
    fields.push(
      { key:`rev${i}`, label:"Revêtement + plafond", unit:"T/m²", type:"number", default:0.10, step:0.05, min:0 },
      { key:`clo${i}`, label:"Cloisons",             unit:"T/m²", type:"number", default:0,    step:0.05, min:0 },
    )
  }
  // q : usage ou direct
  fields.push({ key:`usage${i}`, label:"Usage du niveau", unit:"", type:"select", options:DDC_USAGES, default:"Habitation" })
  if (DDC_USAGE_MAP[inputs[`usage${i}`] ?? "Habitation"] === "personnalise")
    fields.push({ key:`q${i}`, label:"q plancher", unit:"T/m²", type:"number", default:0.15, step:0.05 })
  // Étages courants identiques
  fields.push({ key:`nbsim${i}`, label:"Étages identiques ×", unit:"", type:"number", default:1, step:1, min:1 })
  return { title: `Niveau ${i}`, fields }
}

function ddcPonctuelleSection(i: number): SectionDef {
  return { title: `Charge ponctuelle ${i}`, fields: [
    { key:`pnom${i}`, label:"Désignation",  unit:"",  type:"text",   default:`Charge ${i}` },
    { key:`pG${i}`,   label:"Gp permanent", unit:"T", type:"number", default:0, step:0.1, min:0 },
    { key:`pQ${i}`,   label:"Qp exploitation", unit:"T", type:"number", default:0, step:0.1, min:0 },
    { key:`pa${i}`,   label:"Position (depuis appui gauche)", unit:"m", type:"number", default:0.5, step:0.05, min:0 },
  ]}
}

function getSections(activePage: string, inputs: Record<string, any>): SectionDef[] {
  const base = PAGE_FORMS[activePage] || DEFAULT_FORM
  if (activePage !== "descente-charges") return base

  const cfg = ddcConfig(inputs.intervention ?? DDC_INTERVENTIONS[0])
  const sections: SectionDef[] = [...base]

  // Élément récepteur : poutre de reprise / linteau
  if (cfg.poutre) {
    const poutre: FieldDef[] = [
      { key:"profil",      label:"Profilé",          unit:"",  type:"select", options:PROFILES_METAL, default:"HEA120" },
      { key:"acier_metal", label:"Acier",            unit:"",  type:"select", options:ACIERS_METAL,   default:"S275" },
      { key:"L",           label:"Portée",           unit:"m", type:"number", default:1.0, step:0.05, min:0.3 },
      { key:"nb_profiles", label:"Profilés jumelés", unit:"",  type:"number", default:1, step:1, min:1 },
      { key:"nb_ponctuelles", label:"Charges ponctuelles", unit:"", type:"number", default:0, step:1, min:0 },
    ]
    if (cfg.moisage)
      poutre.push({ key:"espacement_boulons", label:"Espacement boulons", unit:"m", type:"number", default:0.5, step:0.05, min:0.1 })
    sections.push({ title: "Poutre de reprise", fields: poutre })
  }

  // Élément récepteur : mur existant
  if (cfg.mur) sections.push({ title: "Mur existant vérifié", fields: [
    { key:"ep_mur_recepteur", label:"Épaisseur du mur",   unit:"m",   type:"number", default:0.4, step:0.05, min:0.05 },
    { key:"sigma_adm_mur",    label:"σ admissible maçonnerie", unit:"MPa", type:"number", default:0.6, step:0.1, min:0 },
  ]})

  // Élément récepteur : fondations
  if (cfg.fondations) sections.push({ title: "Fondations", fields: [
    { key:"sigma_sol", label:"Contrainte sol admissible", unit:"kPa", type:"number", default:200, step:25, min:0 },
  ]})

  // Charges ponctuelles sur la poutre
  if (cfg.poutre) {
    const np = Math.max(0, Math.min(DDC_MAX_PONCTUELLES, Math.round(inputs.nb_ponctuelles || 0)))
    for (let i = 1; i <= np; i++) sections.push(ddcPonctuelleSection(i))
  }

  // Niveaux de la structure (du plus bas au plus haut)
  const nb = Math.max(1, Math.min(DDC_MAX_NIVEAUX, Math.round(inputs.nb_niveaux || 3)))
  for (let i = 1; i <= nb; i++) sections.push(ddcNiveauSection(i, inputs))
  return sections
}

// Valeurs par défaut pour chaque page
export function getDefaultInputs(pageId: string): Record<string, any> {
  const form = PAGE_FORMS[pageId] || DEFAULT_FORM
  const defaults: Record<string, any> = {}
  form.forEach(section => section.fields.forEach(f => { defaults[f.key] = f.default }))
  if (pageId === "descente-charges") {
    // Énumérer toutes les clés possibles (champs conditionnels compris)
    defaults["profil"] = "HEA120"; defaults["acier_metal"] = "S275"
    defaults["L"] = 1.0; defaults["nb_profiles"] = 1; defaults["nb_ponctuelles"] = 0
    defaults["espacement_boulons"] = 0.5
    defaults["ep_mur_recepteur"] = 0.4; defaults["sigma_adm_mur"] = 0.6
    defaults["sigma_sol"] = 200
    for (let i = 1; i <= DDC_MAX_PONCTUELLES; i++) {
      defaults[`pnom${i}`] = `Charge ${i}`; defaults[`pG${i}`] = 0
      defaults[`pQ${i}`] = 0; defaults[`pa${i}`] = 0.5
    }
    for (let i = 1; i <= DDC_MAX_NIVEAUX; i++) {
      defaults[`nom${i}`] = `Niveau ${i}`
      defaults[`h${i}`] = 2.5; defaults[`ep${i}`] = 0.2; defaults[`dens${i}`] = 2.2
      defaults[`modeLarg${i}`] = DDC_MODES_LARGEUR[0]
      defaults[`pg${i}`] = 0; defaults[`pd${i}`] = 0; defaults[`larg${i}`] = 3.0
      defaults[`typePl${i}`] = "Personnalisé (g direct)"
      defaults[`epd${i}`] = 0.16; defaults[`rev${i}`] = 0.10; defaults[`clo${i}`] = 0
      defaults[`g${i}`] = 0.25
      defaults[`usage${i}`] = "Habitation"; defaults[`q${i}`] = 0.15
      defaults[`nbsim${i}`] = 1
    }
  }
  return defaults
}

export function InputForm({ inputs, onChange, activePage }: {
  inputs: Record<string, any>
  onChange: (v: Record<string, any>) => void
  activePage: string
}) {
  const sections = getSections(activePage, inputs)

  const set = (key: string, val: string, type: "number" | "select" | "text") => {
    const next = { ...inputs, [key]: type === "number" ? (parseFloat(val) || 0) : val }
    // Moisage : suggérer 50 % de reprise automatiquement
    if (key === "intervention" && DDC_INTERVENTION_MAP[val] === "moisage" && (inputs.fraction ?? 100) === 100)
      next.fraction = 50
    onChange(next)
  }

  // MEd estimé pour poutre simple
  const showMEd = activePage === "poutre-simple" && inputs.g_k && inputs.q_k && inputs.L
  const MEd_est = showMEd ? ((1.35*inputs.g_k + 1.5*inputs.q_k) * inputs.L**2 / 8).toFixed(1) : null

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-semibold text-foreground">Données d&apos;entrée</h2>
        <p className="text-xs text-muted-foreground">Renseignez les paramètres de calcul</p>
      </div>
      <div className="flex flex-col gap-5 p-5">
        {sections.map(section => (
          <div key={section.title}>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {section.fields.map(f => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                  {f.type === "text" ? (
                    <input
                      type="text"
                      value={inputs[f.key] ?? f.default}
                      onChange={e => set(f.key, e.target.value, "text")}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={inputs[f.key] ?? f.default}
                      onChange={e => set(f.key, e.target.value, "select")}
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring"
                    >
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <div className="flex items-center rounded-md border border-input bg-background focus-within:border-ring">
                      <input
                        type="number"
                        value={inputs[f.key] ?? f.default}
                        step={f.step}
                        min={f.min}
                        onChange={e => set(f.key, e.target.value, "number")}
                        className="w-full bg-transparent px-3 py-2 font-mono text-sm text-foreground outline-none"
                      />
                      {f.unit && <span className="border-l border-border px-2.5 py-2 text-xs text-muted-foreground">{f.unit}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {MEd_est && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">MEd estimé (1.35G + 1.5Q)</label>
            <div className="flex items-center rounded-md border border-input bg-muted">
              <input readOnly value={MEd_est}
                className="w-full bg-transparent px-3 py-2 font-mono text-sm text-blue-600 font-semibold outline-none" />
              <span className="border-l border-border px-2.5 py-2 text-xs text-muted-foreground">kN.m</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
