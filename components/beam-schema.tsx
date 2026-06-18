"use client"

type BeamSchemaProps = {
  b: number
  h: number
  L: number
  As?: number
  choix?: string
  d?: number
  MEd?: number
  VEd?: number
}

export function BeamSchema({ b, h, L, As, choix, d, MEd, VEd }: BeamSchemaProps) {
  const W = 160
  const H = 220
  const x0 = 70
  const y0 = 55

  const match = choix?.match(/(\d+)HA(\d+)/)
  const nbBars = Math.min(match ? parseInt(match[1]) : 2, 8)
  const diam   = match ? parseInt(match[2]) : 12
  const barR   = Math.max(4, Math.min(diam * 0.35, 9))
  const cover  = 18
  const barY   = y0 + H - cover - barR

  const bars = Array.from({ length: nbBars }, (_, i) => {
    const usable = W - 2 * cover
    return x0 + cover + (nbBars > 1 ? i * (usable / (nbBars - 1)) : usable / 2)
  })

  const dPx = d ? H * (d / h) : H - cover * 2

  // Hachures manuelles (lignes diagonales)
  const hatchLines = (x: number, y: number, w: number, ht: number, gap = 10) => {
    const lines = []
    for (let k = -ht; k < w + ht; k += gap) {
      const x1 = Math.max(x, x + k)
      const y1 = k < 0 ? y - k : y
      const x2 = Math.min(x + w, x + k + ht)
      const y2 = k < 0 ? y + ht : y + ht - k
      if (x1 <= x + w && x2 >= x && y1 <= y + ht && y2 >= y) {
        lines.push(<line key={k} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#888780" strokeWidth="0.8" opacity="0.5"/>)
      }
    }
    return lines
  }

  const arrowMarker = (
    <defs>
      <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </marker>
      <clipPath id="sec-clip">
        <rect x={x0} y={y0} width={W} height={H}/>
      </clipPath>
      <clipPath id="elev-clip">
        <rect x="370" y={y0} width="280" height={H}/>
      </clipPath>
    </defs>
  )

  return (
    <svg width="100%" viewBox="0 0 680 380" role="img">
      <title>Schéma poutre rectangulaire</title>
      <desc>Section transversale et vue en élévation</desc>
      {arrowMarker}

      {/* ══ SECTION TRANSVERSALE ══ */}
      <text fontSize="12" fontWeight="500" fill="#2C2C2A"
        x={x0 + W / 2} y="28" textAnchor="middle">Section transversale</text>

      {/* Fond béton */}
      <rect x={x0} y={y0} width={W} height={H} rx="3"
        fill="#D3D1C7" stroke="#444441" strokeWidth="2"/>

      {/* Hachures béton */}
      <g clipPath="url(#sec-clip)">
        {hatchLines(x0, y0, W, H, 12)}
      </g>
      {/* Rebord pour cacher hachures dépassantes */}
      <rect x={x0} y={y0} width={W} height={H} rx="3"
        fill="none" stroke="#444441" strokeWidth="2"/>

      {/* Ligne hauteur utile d */}
      <line x1={x0} y1={y0 + H - dPx} x2={x0 + W} y2={y0 + H - dPx}
        stroke="#185FA5" strokeWidth="1.2" strokeDasharray="5 3"/>

      {/* Cote d */}
      <line x1={x0 - 30} y1={y0 + H - dPx} x2={x0 - 30} y2={y0 + H}
        stroke="#5F5E5A" strokeWidth="0.8"
        markerStart="url(#arr2)" markerEnd="url(#arr2)"/>
      <text fontSize="10" fill="#5F5E5A"
        x={x0 - 34} y={(y0 + H - dPx + y0 + H) / 2 + 4} textAnchor="end">d={d}</text>

      {/* Cote b */}
      <line x1={x0} y1={y0 + H + 24} x2={x0 + W} y2={y0 + H + 24}
        stroke="#5F5E5A" strokeWidth="0.8"
        markerStart="url(#arr2)" markerEnd="url(#arr2)"/>
      <text fontSize="10" fill="#5F5E5A"
        x={x0 + W / 2} y={y0 + H + 38} textAnchor="middle">b = {b} mm</text>

      {/* Cote h */}
      <line x1={x0 + W + 22} y1={y0} x2={x0 + W + 22} y2={y0 + H}
        stroke="#5F5E5A" strokeWidth="0.8"
        markerStart="url(#arr2)" markerEnd="url(#arr2)"/>
      <text fontSize="10" fill="#5F5E5A"
        x={x0 + W + 36} y={y0 + H / 2 + 4} textAnchor="start">h = {h} mm</text>

      {/* Armatures */}
      {bars.map((bx, i) => (
        <g key={i}>
          <circle cx={bx} cy={barY} r={barR + 2}
            fill="#D3D1C7" stroke="#444441" strokeWidth="1"/>
          <circle cx={bx} cy={barY} r={barR} fill="#E24B4A" opacity="0.9"/>
        </g>
      ))}

      {/* Légende armatures */}
      {choix && (
        <text fontSize="10" fill="#5F5E5A"
          x={x0 + W / 2} y={y0 + H + 58} textAnchor="middle">
          {choix} — As = {As} mm²
        </text>
      )}

      {/* ══ VUE EN ÉLÉVATION ══ */}
      <text fontSize="12" fontWeight="500" fill="#2C2C2A"
        x="510" y="28" textAnchor="middle">Vue en élévation</text>

      {/* Fond béton élévation */}
      <rect x="370" y={y0} width="280" height={H} rx="3"
        fill="#D3D1C7" stroke="#444441" strokeWidth="2"/>
      <g clipPath="url(#elev-clip)">
        {hatchLines(370, y0, 280, H, 12)}
      </g>
      <rect x="370" y={y0} width="280" height={H} rx="3"
        fill="none" stroke="#444441" strokeWidth="2"/>

      {/* Charge répartie */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i}
          x1={382 + i * 33} y1={y0 - 24} x2={382 + i * 33} y2={y0 - 6}
          stroke="#185FA5" strokeWidth="1.4" markerEnd="url(#arr2)"/>
      ))}
      <line x1="370" y1={y0 - 24} x2="650" y2={y0 - 24}
        stroke="#185FA5" strokeWidth="1.4"/>
      <text fontSize="10" fill="#185FA5" x="510" y={y0 - 30} textAnchor="middle">q ELU</text>

      {/* Armature en élévation */}
      <line x1="382" y1={barY} x2="638" y2={barY}
        stroke="#E24B4A" strokeWidth={Math.max(3, barR * 0.8)} strokeLinecap="round" opacity="0.85"/>

      {/* Ligne d en élévation */}
      <line x1="370" y1={y0 + H - dPx} x2="650" y2={y0 + H - dPx}
        stroke="#185FA5" strokeWidth="0.8" strokeDasharray="5 3" opacity="0.6"/>

      {/* Appui gauche */}
      <polygon points={`370,${y0 + H} 356,${y0 + H + 20} 384,${y0 + H + 20}`}
        fill="#5F5E5A" opacity="0.6"/>
      <line x1="350" y1={y0 + H + 20} x2="390" y2={y0 + H + 20}
        stroke="#5F5E5A" strokeWidth="1.5"/>

      {/* Appui droit */}
      <polygon points={`650,${y0 + H} 636,${y0 + H + 20} 664,${y0 + H + 20}`}
        fill="#5F5E5A" opacity="0.6"/>
      <line x1="630" y1={y0 + H + 20} x2="670" y2={y0 + H + 20}
        stroke="#5F5E5A" strokeWidth="1.5"/>

      {/* Cote L */}
      <line x1="370" y1={y0 + H + 48} x2="650" y2={y0 + H + 48}
        stroke="#5F5E5A" strokeWidth="0.8"
        markerStart="url(#arr2)" markerEnd="url(#arr2)"/>
      <text fontSize="10" fill="#5F5E5A"
        x="510" y={y0 + H + 62} textAnchor="middle">L = {L} m</text>

      {MEd && (
        <text fontSize="10" fill="#5F5E5A"
          x="510" y={y0 + H + 78} textAnchor="middle">
          MEd = {MEd} kN.m · VEd = {VEd} kN
        </text>
      )}
    </svg>
  )
}
