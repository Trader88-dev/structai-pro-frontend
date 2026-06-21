"use client"

// ── Helpers partagés ──────────────────────────────────────────────────────────

const COLORS = {
  beton:   "#D3D1C7",
  contour: "#444441",
  acier:   "#E24B4A",
  cote:    "#5F5E5A",
  force:   "#185FA5",
  terre:   "#8B7355",
  sol:     "#C4A882",
  vert:    "#22C55E",
  orange:  "#F97316",
}

function Arrow({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke={COLORS.cote}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </marker>
  )
}

function ForceArrow({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5"
      markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0L10 5L0 10z" fill={COLORS.force}/>
    </marker>
  )
}

function Hatch({ x, y, w, h, gap = 12, clipId }: {
  x: number; y: number; w: number; h: number; gap?: number; clipId: string
}) {
  const lines = []
  for (let k = -h; k < w + h; k += gap) {
    const x1 = Math.max(x, x + k)
    const y1 = k < 0 ? y - k : y
    const x2 = Math.min(x + w, x + k + h)
    const y2 = k < 0 ? y + h : y + h - k
    if (x1 <= x + w && x2 >= x) {
      lines.push(<line key={k} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#888780" strokeWidth="0.7" opacity="0.45"/>)
    }
  }
  return (
    <>
      <clipPath id={clipId}><rect x={x} y={y} width={w} height={h}/></clipPath>
      <g clipPath={`url(#${clipId})`}>{lines}</g>
    </>
  )
}

// ── Schéma Poteau ─────────────────────────────────────────────────────────────

export function PoteauSchema({ b, h, longueur, As, choix, d, NEd, lambda_ }: {
  b: number; h: number; longueur: number
  As?: number; choix?: string; d?: number; NEd?: number; lambda_?: number
}) {
  const W = 700; const H = 380
  const secW = 130; const secH = 160
  const sx = 60; const sy = 60

  const elevW = 90; const elevH = 220
  const ex = 280; const ey = 60

  const match = choix?.match(/(\d+)HA(\d+)/)
  const nbBars = Math.min(match ? parseInt(match[1]) : 4, 12)
  const diam   = match ? parseInt(match[2]) : 12
  const barR   = Math.max(4, Math.min(diam * 0.3, 8))
  const cover  = 16

  // 4 coins + répartition sur les faces
  const barPositions: [number,number][] = []
  const perSide = Math.max(1, Math.round((nbBars - 4) / 4))
  const corners: [number,number][] = [
    [sx+cover, sy+cover], [sx+secW-cover, sy+cover],
    [sx+secW-cover, sy+secH-cover], [sx+cover, sy+secH-cover]
  ]
  corners.forEach(p => barPositions.push(p))
  for (let i = 1; i <= perSide && barPositions.length < nbBars; i++) {
    const t = i / (perSide + 1)
    barPositions.push([sx+cover + t*(secW-2*cover), sy+cover])
    if (barPositions.length < nbBars)
      barPositions.push([sx+cover + t*(secW-2*cover), sy+secH-cover])
    if (barPositions.length < nbBars)
      barPositions.push([sx+cover, sy+cover + t*(secH-2*cover)])
    if (barPositions.length < nbBars)
      barPositions.push([sx+secW-cover, sy+cover + t*(secH-2*cover)])
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <Arrow id="arr-p"/>
        <ForceArrow id="farr-p"/>
      </defs>

      {/* ── SECTION ── */}
      <text fontSize="11" fontWeight="600" fill="#2C2C2A" x={sx+secW/2} y="44" textAnchor="middle">Section</text>
      <rect x={sx} y={sy} width={secW} height={secH} fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="2" rx="2"/>
      <Hatch x={sx} y={sy} w={secW} h={secH} clipId="sec-p"/>
      <rect x={sx} y={sy} width={secW} height={secH} fill="none" stroke={COLORS.contour} strokeWidth="2" rx="2"/>

      {/* Armatures section */}
      {barPositions.slice(0, nbBars).map(([bx, by], i) => (
        <g key={i}>
          <circle cx={bx} cy={by} r={barR+2} fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="1"/>
          <circle cx={bx} cy={by} r={barR} fill={COLORS.acier} opacity="0.9"/>
        </g>
      ))}

      {/* Cadre (étrier) */}
      <rect x={sx+cover-2} y={sy+cover-2} width={secW-2*cover+4} height={secH-2*cover+4}
        fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 2" rx="2"/>

      {/* Cotes section */}
      <line x1={sx} y1={sy+secH+20} x2={sx+secW} y2={sy+secH+20}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-p)" markerEnd="url(#arr-p)"/>
      <text fontSize="9" fill={COLORS.cote} x={sx+secW/2} y={sy+secH+33} textAnchor="middle">b = {b} mm</text>

      <line x1={sx+secW+18} y1={sy} x2={sx+secW+18} y2={sy+secH}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-p)" markerEnd="url(#arr-p)"/>
      <text fontSize="9" fill={COLORS.cote} x={sx+secW+30} y={sy+secH/2+4} textAnchor="start">h = {h} mm</text>

      {/* Légende */}
      {choix && (
        <text fontSize="9" fill={COLORS.cote} x={sx+secW/2} y={sy+secH+50} textAnchor="middle">
          {choix}
        </text>
      )}

      {/* ── ÉLÉVATION ── */}
      <text fontSize="11" fontWeight="600" fill="#2C2C2A" x={ex+elevW/2} y="44" textAnchor="middle">Élévation</text>

      {/* Encastrement bas */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={ex-10+i*25} y1={ey+elevH+8} x2={ex-18+i*25} y2={ey+elevH+22}
          stroke={COLORS.cote} strokeWidth="1.2"/>
      ))}
      <line x1={ex-12} y1={ey+elevH+8} x2={ex+elevW+12} y2={ey+elevH+8} stroke={COLORS.cote} strokeWidth="2"/>

      {/* Corps poteau */}
      <rect x={ex} y={ey} width={elevW} height={elevH} fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="2"/>
      <Hatch x={ex} y={ey} w={elevW} h={elevH} gap={14} clipId="elev-p"/>
      <rect x={ex} y={ey} width={elevW} height={elevH} fill="none" stroke={COLORS.contour} strokeWidth="2"/>

      {/* Armatures verticales élévation */}
      <line x1={ex+cover} y1={ey+cover} x2={ex+cover} y2={ey+elevH-cover}
        stroke={COLORS.acier} strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
      <line x1={ex+elevW-cover} y1={ey+cover} x2={ex+elevW-cover} y2={ey+elevH-cover}
        stroke={COLORS.acier} strokeWidth="3" strokeLinecap="round" opacity="0.85"/>

      {/* Étriers */}
      {[0.2, 0.4, 0.6, 0.8].map((t, i) => (
        <rect key={i} x={ex+cover-4} y={ey + t*elevH - 4}
          width={elevW-2*cover+8} height="8"
          fill="none" stroke="#6366F1" strokeWidth="1.5" opacity="0.7"/>
      ))}

      {/* Articulation haut (rotule) */}
      <circle cx={ex+elevW/2} cy={ey} r="6" fill="white" stroke={COLORS.cote} strokeWidth="1.5"/>
      <line x1={ex+elevW/2-10} y1={ey-14} x2={ex+elevW/2+10} y2={ey-14} stroke={COLORS.cote} strokeWidth="1.5"/>

      {/* Force N */}
      <line x1={ex+elevW/2} y1={ey-42} x2={ex+elevW/2} y2={ey-14}
        stroke={COLORS.force} strokeWidth="2" markerEnd="url(#farr-p)"/>
      <text fontSize="10" fontWeight="600" fill={COLORS.force} x={ex+elevW/2+8} y={ey-28} textAnchor="start">N</text>

      {/* Cote longueur */}
      <line x1={ex+elevW+20} y1={ey} x2={ex+elevW+20} y2={ey+elevH}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-p)" markerEnd="url(#arr-p)"/>
      <text fontSize="9" fill={COLORS.cote} x={ex+elevW+32} y={ey+elevH/2+4} textAnchor="start">L={longueur}m</text>

      {/* ── INFOS ── */}
      {NEd && (
        <g>
          <rect x="440" y="55" width="210" height="90" rx="6"
            fill="white" stroke="#E5E4E0" strokeWidth="1"/>
          <text fontSize="10" fontWeight="600" fill="#2C2C2A" x="455" y="74">Résultats clés</text>
          {[
            { label: "NEd", val: `${NEd} kN`, color: COLORS.force },
            { label: "Élancement λ", val: `${lambda_}`, color: lambda_ && lambda_ > 50 ? COLORS.orange : COLORS.vert },
            { label: "As retenu", val: `${As} mm²`, color: "#2C2C2A" },
          ].map((r, i) => (
            <g key={i}>
              <text fontSize="9" fill={COLORS.cote} x="455" y={92+i*18}>{r.label}</text>
              <text fontSize="9" fontWeight="600" fill={r.color} x="620" y={92+i*18} textAnchor="end">{r.val}</text>
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

// ── Schéma Semelle Isolée ─────────────────────────────────────────────────────

export function SemelleIsoleeSchema({ b_p, h_p, h_sem, Ax, Ay, sigma_max, sigma_ok }: {
  b_p: number; h_p: number; h_sem: number
  Ax?: number; Ay?: number; sigma_max?: number; sigma_ok?: boolean
}) {
  const W = 620; const H = 340
  const cx = 180; const cy = 60  // centre semelle
  const semW = 200; const semH = 60
  const pW = Math.round(semW * (b_p / ((Ax||2)*1000))); const pH = 50
  const px = cx + semW/2 - pW/2

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs><Arrow id="arr-si"/><ForceArrow id="farr-si"/></defs>

      <text fontSize="11" fontWeight="600" fill="#2C2C2A" x={cx+semW/2} y="44" textAnchor="middle">Vue en coupe</text>

      {/* Sol */}
      <rect x={cx-20} y={cy+semH+pH} width={semW+40} height={30}
        fill={COLORS.sol} opacity="0.4"/>
      <Hatch x={cx-20} y={cy+semH+pH} w={semW+40} h={30} gap={8} clipId="sol-si"/>
      <line x1={cx-20} y1={cy+semH+pH} x2={cx+semW+20} y2={cy+semH+pH}
        stroke={COLORS.terre} strokeWidth="2" strokeDasharray="5 3"/>

      {/* Semelle */}
      <rect x={cx} y={cy+pH} width={semW} height={semH}
        fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="2" rx="2"/>
      <Hatch x={cx} y={cy+pH} w={semW} h={semH} gap={10} clipId="sem-si"/>
      <rect x={cx} y={cy+pH} width={semW} height={semH} fill="none" stroke={COLORS.contour} strokeWidth="2" rx="2"/>

      {/* Armatures semelle (treillis) */}
      {[0.2,0.4,0.6,0.8].map((t,i) => (
        <line key={i} x1={cx+12} y1={cy+pH+semH-16} x2={cx+semW-12} y2={cy+pH+semH-16}
          stroke={COLORS.acier} strokeWidth="2" opacity="0.8"/>
      ))}
      <line x1={cx+12} y1={cy+pH+semH-16} x2={cx+semW-12} y2={cy+pH+semH-16}
        stroke={COLORS.acier} strokeWidth="2.5" opacity="0.9"/>

      {/* Poteau */}
      <rect x={px} y={cy} width={pW} height={pH}
        fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="2"/>
      <Hatch x={px} y={cy} w={pW} h={pH} gap={8} clipId="pot-si"/>
      <rect x={px} y={cy} width={pW} height={pH} fill="none" stroke={COLORS.contour} strokeWidth="2"/>

      {/* Force N */}
      <line x1={cx+semW/2} y1={cy-36} x2={cx+semW/2} y2={cy}
        stroke={COLORS.force} strokeWidth="2" markerEnd="url(#farr-si)"/>
      <text fontSize="10" fontWeight="600" fill={COLORS.force} x={cx+semW/2+8} y={cy-16}>N</text>

      {/* Pression sol */}
      {[0.1,0.3,0.5,0.7,0.9].map((t,i) => (
        <line key={i} x1={cx+t*semW} y1={cy+semH+pH+10} x2={cx+t*semW} y2={cy+semH+pH-4}
          stroke={sigma_ok ? COLORS.vert : COLORS.acier} strokeWidth="1.4"
          markerEnd={`url(#farr-si)`} opacity="0.7"/>
      ))}
      <text fontSize="9" fill={sigma_ok ? COLORS.vert : COLORS.acier}
        x={cx+semW/2} y={cy+semH+pH+28} textAnchor="middle" fontWeight="600">
        σmax = {sigma_max} kPa {sigma_ok ? "✓" : "✗"}
      </text>

      {/* Cotes */}
      <line x1={cx} y1={cy+pH+semH+55} x2={cx+semW} y2={cy+pH+semH+55}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-si)" markerEnd="url(#arr-si)"/>
      <text fontSize="9" fill={COLORS.cote} x={cx+semW/2} y={cy+pH+semH+68} textAnchor="middle">
        Ax = {Ax} m
      </text>

      <line x1={cx+semW+18} y1={cy+pH} x2={cx+semW+18} y2={cy+pH+semH}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-si)" markerEnd="url(#arr-si)"/>
      <text fontSize="9" fill={COLORS.cote} x={cx+semW+30} y={cy+pH+semH/2+4} textAnchor="start">
        h={h_sem}mm
      </text>

      {/* Infos */}
      <rect x="420" y="55" width="170" height="80" rx="6" fill="white" stroke="#E5E4E0" strokeWidth="1"/>
      <text fontSize="10" fontWeight="600" fill="#2C2C2A" x="435" y="74">Semelle {Ax}×{Ay} m</text>
      <text fontSize="9" fill={COLORS.cote} x="435" y="92">Poteau : {b_p}×{h_p} mm</text>
      <text fontSize="9" fill={COLORS.cote} x="435" y="108">h semelle : {h_sem} mm</text>
      <text fontSize="9" fontWeight="600"
        fill={sigma_ok ? COLORS.vert : COLORS.acier} x="435" y="124">
        Sol : {sigma_ok ? "✓ Vérifié" : "✗ Insuffisant"}
      </text>
    </svg>
  )
}

// ── Schéma Acrotère ───────────────────────────────────────────────────────────

export function AcrotereSchema({ h, e, MEd, NEd, choix }: {
  h: number; e: number; MEd?: number; NEd?: number; choix?: string
}) {
  const W = 580; const H = 340
  const bx = 120; const by = 250  // base acrotère
  const aW = Math.round(e * 0.5); const aH = Math.round(h * 80)
  const dalleW = 200; const dalleH = 20

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs><Arrow id="arr-ac"/><ForceArrow id="farr-ac"/></defs>

      <text fontSize="11" fontWeight="600" fill="#2C2C2A" x="180" y="28" textAnchor="middle">Vue en coupe</text>

      {/* Dalle terrasse */}
      <rect x={bx-20} y={by} width={dalleW} height={dalleH}
        fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="1.5" rx="1"/>
      <Hatch x={bx-20} y={by} w={dalleW} h={dalleH} gap={8} clipId="dalle-ac"/>

      {/* Corps acrotère */}
      <rect x={bx} y={by-aH} width={aW} height={aH}
        fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="2" rx="2"/>
      <Hatch x={bx} y={by-aH} w={aW} h={aH} gap={10} clipId="ac-body"/>
      <rect x={bx} y={by-aH} width={aW} height={aH} fill="none" stroke={COLORS.contour} strokeWidth="2" rx="2"/>

      {/* Armatures verticales */}
      <line x1={bx+12} y1={by-aH+10} x2={bx+12} y2={by-10}
        stroke={COLORS.acier} strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      {/* Armatures horizontales de répartition */}
      {[0.25,0.5,0.75].map((t,i) => (
        <line key={i} x1={bx+8} y1={by-aH*t} x2={bx+aW-8} y2={by-aH*t}
          stroke={COLORS.acier} strokeWidth="1.5" opacity="0.6"/>
      ))}

      {/* Force vent */}
      <line x1={bx+aW+60} y1={by-aH*0.6} x2={bx+aW+4} y2={by-aH*0.6}
        stroke={COLORS.force} strokeWidth="2" markerEnd="url(#farr-ac)"/>
      <text fontSize="9" fontWeight="600" fill={COLORS.force} x={bx+aW+65} y={by-aH*0.6+4}>
        Vent
      </text>

      {/* Poids propre */}
      <line x1={bx+aW/2} y1={by-aH-28} x2={bx+aW/2} y2={by-aH-4}
        stroke={COLORS.cote} strokeWidth="1.5" markerEnd="url(#farr-ac)"/>
      <text fontSize="9" fill={COLORS.cote} x={bx+aW/2} y={by-aH-34} textAnchor="middle">G</text>

      {/* Moment encastrement */}
      <path d={`M ${bx-10} ${by-30} Q ${bx-30} ${by-aH*0.4} ${bx-10} ${by-aH*0.7}`}
        fill="none" stroke={COLORS.orange} strokeWidth="1.5" strokeDasharray="4 2"/>
      <text fontSize="9" fill={COLORS.orange} x={bx-42} y={by-aH*0.5} textAnchor="middle">M</text>

      {/* Cote h */}
      <line x1={bx-28} y1={by} x2={bx-28} y2={by-aH}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-ac)" markerEnd="url(#arr-ac)"/>
      <text fontSize="9" fill={COLORS.cote} x={bx-40} y={by-aH/2+4} textAnchor="end">h={h}m</text>

      {/* Cote e */}
      <line x1={bx} y1={by+38} x2={bx+aW} y2={by+38}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-ac)" markerEnd="url(#arr-ac)"/>
      <text fontSize="9" fill={COLORS.cote} x={bx+aW/2} y={by+50} textAnchor="middle">e={e}mm</text>

      {/* Encastrement */}
      {[-1,0,1,2,3].map(i => (
        <line key={i} x1={bx-10+i*20} y1={by+dalleH+4} x2={bx-18+i*20} y2={by+dalleH+18}
          stroke={COLORS.cote} strokeWidth="1"/>
      ))}
      <line x1={bx-20} y1={by+dalleH+4} x2={bx+dalleW} y2={by+dalleH+4}
        stroke={COLORS.cote} strokeWidth="1.5"/>

      {/* Infos */}
      <rect x="360" y="60" width="185" height="100" rx="6" fill="white" stroke="#E5E4E0" strokeWidth="1"/>
      <text fontSize="10" fontWeight="600" fill="#2C2C2A" x="375" y="79">Résultats</text>
      {[
        { label: "MEd", val: MEd ? `${MEd} kN.m` : "—" },
        { label: "NEd", val: NEd ? `${NEd} kN` : "—" },
        { label: "Armatures", val: choix || "—" },
      ].map((r,i) => (
        <g key={i}>
          <text fontSize="9" fill={COLORS.cote} x="375" y={97+i*20}>{r.label}</text>
          <text fontSize="9" fontWeight="600" fill="#2C2C2A" x="535" y={97+i*20} textAnchor="end">{r.val}</text>
        </g>
      ))}
    </svg>
  )
}

// ── Schéma Escalier ───────────────────────────────────────────────────────────

export function EscalierSchema({ L_h, hauteur, g_giron, h_contre, ep, MEd, As_princ_retenu, choix_princ, alpha_deg }: {
  L_h: number; hauteur: number; g_giron: number; h_contre: number; ep: number
  MEd?: number; As_princ_retenu?: number; choix_princ?: string; alpha_deg?: number
}) {
  const W = 620; const H = 360
  const ox = 60; const oy = 280  // origine bas gauche
  const scaleX = 200 / L_h; const scaleY = 200 / hauteur

  const nbMarches = Math.round(hauteur / h_contre)
  const giron = L_h / nbMarches

  const steps = Array.from({ length: nbMarches }, (_, i) => ({
    x: ox + i * giron * scaleX,
    y: oy - i * h_contre * scaleY,
    w: giron * scaleX,
    hh: h_contre * scaleY,
  }))

  // Épaisseur paillasse projetée
  const angle = (alpha_deg || 40) * Math.PI / 180
  const epX = ep * Math.sin(angle) * 0.6
  const epY = ep * Math.cos(angle) * 0.6

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs><Arrow id="arr-esc"/><ForceArrow id="farr-esc"/></defs>

      <text fontSize="11" fontWeight="600" fill="#2C2C2A" x={ox+100} y="28" textAnchor="middle">Vue en élévation</text>

      {/* Sol bas */}
      <line x1={ox-20} y1={oy} x2={ox+30} y2={oy} stroke={COLORS.cote} strokeWidth="2"/>
      {[-1,0,1,2].map(i=>(
        <line key={i} x1={ox-12+i*12} y1={oy} x2={ox-20+i*12} y2={oy+12} stroke={COLORS.cote} strokeWidth="1"/>
      ))}

      {/* Paillasse (fond) */}
      <polygon
        points={[
          `${ox},${oy}`,
          `${ox+L_h*scaleX+epX},${oy-hauteur*scaleY+epY}`,
          `${ox+L_h*scaleX},${oy-hauteur*scaleY}`,
          `${ox-epX},${oy-epY}`,
        ].join(' ')}
        fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="1.5" opacity="0.8"/>

      {/* Marches */}
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y-s.hh} width={s.w} height={s.hh}
            fill={COLORS.beton} stroke={COLORS.contour} strokeWidth="1"/>
        </g>
      ))}

      {/* Armature principale */}
      <line x1={ox+epX+6} y1={oy-epY-6} x2={ox+L_h*scaleX-6} y2={oy-hauteur*scaleY+epY+6}
        stroke={COLORS.acier} strokeWidth="3" strokeLinecap="round" opacity="0.85"/>

      {/* Appuis */}
      <rect x={ox-20} y={oy} width={20} height={20} fill={COLORS.cote} opacity="0.4"/>
      <rect x={ox+L_h*scaleX} y={oy-hauteur*scaleY} width={20} height={20} fill={COLORS.cote} opacity="0.4"/>

      {/* Flèche charge */}
      {[0.3, 0.5, 0.7].map((t, i) => {
        const lx = ox + t*L_h*scaleX
        const ly = oy - t*hauteur*scaleY
        return (
          <line key={i} x1={lx} y1={ly-24} x2={lx} y2={ly-4}
            stroke={COLORS.force} strokeWidth="1.4" markerEnd="url(#farr-esc)" opacity="0.7"/>
        )
      })}

      {/* Cotes */}
      <line x1={ox} y1={oy+30} x2={ox+L_h*scaleX} y2={oy+30}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-esc)" markerEnd="url(#arr-esc)"/>
      <text fontSize="9" fill={COLORS.cote} x={ox+L_h*scaleX/2} y={oy+43} textAnchor="middle">
        Lh = {L_h} m
      </text>

      <line x1={ox+L_h*scaleX+30} y1={oy} x2={ox+L_h*scaleX+30} y2={oy-hauteur*scaleY}
        stroke={COLORS.cote} strokeWidth="0.8" markerStart="url(#arr-esc)" markerEnd="url(#arr-esc)"/>
      <text fontSize="9" fill={COLORS.cote} x={ox+L_h*scaleX+42} y={oy-hauteur*scaleY/2+4} textAnchor="start">
        H = {hauteur} m
      </text>

      {/* Infos */}
      <rect x="380" y="40" width="200" height="110" rx="6" fill="white" stroke="#E5E4E0" strokeWidth="1"/>
      <text fontSize="10" fontWeight="600" fill="#2C2C2A" x="395" y="59">Résultats</text>
      {[
        { label: `α paillasse`, val: `${alpha_deg}°` },
        { label: "MEd",         val: MEd ? `${MEd} kN.m` : "—" },
        { label: "As princ.",   val: As_princ_retenu ? `${As_princ_retenu} mm²/ml` : "—" },
        { label: "Armatures",   val: choix_princ || "—" },
      ].map((r,i) => (
        <g key={i}>
          <text fontSize="9" fill={COLORS.cote} x="395" y={77+i*18}>{r.label}</text>
          <text fontSize="9" fontWeight="600" fill="#2C2C2A" x="570" y={77+i*18} textAnchor="end">{r.val}</text>
        </g>
      ))}
    </svg>
  )
}

// ── Diagramme Moments Poutre Continue ─────────────────────────────────────────

export function MomentDiagram({ travees }: { travees: any[] }) {
  if (!travees?.length) return null

  const W = 700; const H = 260
  const padL = 40; const padR = 30; const padT = 30; const padB = 50
  const drawW = W - padL - padR
  const drawH = H - padT - padB

  // Construire les points du diagramme
  const allM: number[] = travees.flatMap(t => [t.M_trav, t.M_app_g, t.M_app_d])
  const maxM = Math.max(...allM.map(Math.abs), 1)

  // Longueur totale
  const totalL = travees.reduce((s, t) => s + t.L, 0)

  const toX = (xm: number) => padL + (xm / totalL) * drawW
  const toY = (m: number) => padT + drawH/2 - (m / maxM) * (drawH/2 - 10)

  // Points du diagramme de moments
  let pts: [number, number][] = []
  let xCur = 0

  travees.forEach((t, i) => {
    const xL = xCur
    const xR = xCur + t.L
    const xMid = xCur + t.L/2

    pts.push([toX(xL), toY(t.M_app_g)])
    pts.push([toX(xMid), toY(t.M_trav)])
    pts.push([toX(xR), toY(t.M_app_d)])

    xCur += t.L
  })

  const pathD = pts.map((p, i) => `${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  // Zone positive (travée) et négative (appuis)
  const zeroY = toY(0)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="grad-pos" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#185FA5" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#185FA5" stopOpacity="0.05"/>
        </linearGradient>
        <linearGradient id="grad-neg" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#E24B4A" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#E24B4A" stopOpacity="0.05"/>
        </linearGradient>
      </defs>

      <text fontSize="11" fontWeight="600" fill="#2C2C2A" x={W/2} y="18" textAnchor="middle">
        Diagramme des moments fléchissants (kN.m)
      </text>

      {/* Axes */}
      <line x1={padL} y1={zeroY} x2={W-padR} y2={zeroY} stroke="#C4C3BE" strokeWidth="1"/>
      <line x1={padL} y1={padT} x2={padL} y2={H-padB} stroke="#C4C3BE" strokeWidth="1"/>

      {/* Grille horizontale */}
      {[-1, -0.5, 0.5, 1].map((t,i) => {
        const y = toY(t * maxM)
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={W-padR} y2={y} stroke="#E5E4E0" strokeWidth="0.8" strokeDasharray="4 3"/>
            <text fontSize="8" fill={COLORS.cote} x={padL-4} y={y+3} textAnchor="end">
              {(t*maxM).toFixed(0)}
            </text>
          </g>
        )
      })}

      {/* Courbe remplie */}
      <path d={`${pathD} L${toX(totalL).toFixed(1)},${zeroY} L${toX(0).toFixed(1)},${zeroY} Z`}
        fill="url(#grad-pos)" opacity="0.8"/>
      <path d={pathD} fill="none" stroke={COLORS.force} strokeWidth="2.5" strokeLinejoin="round"/>

      {/* Points clés */}
      {pts.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="white" stroke={COLORS.force} strokeWidth="1.5"/>
      ))}

      {/* Labels travées */}
      {(() => {
        let xc = 0
        return travees.map((t, i) => {
          const xMid = toX(xc + t.L/2)
          xc += t.L
          return (
            <text key={i} fontSize="9" fill={COLORS.cote}
              x={xMid} y={H-padB+16} textAnchor="middle">
              T{i+1} · {t.L}m
            </text>
          )
        })
      })()}

      {/* Séparateurs appuis */}
      {(() => {
        let xc = 0
        return travees.slice(0,-1).map((t, i) => {
          xc += t.L
          return (
            <line key={i} x1={toX(xc)} y1={padT} x2={toX(xc)} y2={H-padB}
              stroke={COLORS.cote} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
          )
        })
      })()}
    </svg>
  )
}
