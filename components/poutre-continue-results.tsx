"use client"

import { useEffect, useRef } from "react"

type Travee = {
  numero: number
  L: number
  q_ELU: number
  M_trav: number
  M_app_g: number
  M_app_d: number
  V_g: number
  V_d: number
  choix_trav?: string
  choix_chap_g?: string
  choix_chap_d?: string
}

type PoutreContinueSchemaProps = {
  travees: Travee[]
  b: number   // mm
  h: number   // mm
  d?: number  // mm
}

export function PoutreContinueSchema({ travees, b, h, d }: PoutreContinueSchemaProps) {
  const mountRef  = useRef<HTMLDivElement>(null)
  const frameRef  = useRef<number>(0)
  const rendRef   = useRef<any>(null)

  const totalL = travees.reduce((s, t) => s + t.L, 0)
  const maxM   = Math.max(...travees.flatMap(t => [Math.abs(t.M_trav), Math.abs(t.M_app_g), Math.abs(t.M_app_d)]))
  const maxV   = Math.max(...travees.flatMap(t => [Math.abs(t.V_g), Math.abs(t.V_d)]))

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current

    // Charger Three.js si pas déjà là
    if ((window as any).THREE) { init(container); return }
    const s = document.createElement("script")
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
    s.onload = () => init(container)
    document.head.appendChild(s)
    return () => {
      cancelAnimationFrame(frameRef.current)
      rendRef.current?.dispose()
    }
  }, [travees, b, h])

  function parseBars(choix?: string) {
    if (!choix) return { nb: 2, diam: 12 }
    const m = choix.match(/(\d+)HA(\d+)/)
    return m ? { nb: parseInt(m[1]), diam: parseInt(m[2]) } : { nb: 2, diam: 12 }
  }

  function init(container: HTMLDivElement) {
    const THREE = (window as any).THREE
    const canvas = container.querySelector("canvas") as HTMLCanvasElement
    if (!canvas) return

    const W = container.clientWidth || 680
    const H = 460

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0xf8fafc, 1)
    renderer.shadowMap.enabled = true
    rendRef.current = renderer

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 200)

    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const sun = new THREE.DirectionalLight(0xffffff, 1.0)
    sun.position.set(6, 10, 8); sun.castShadow = true; scene.add(sun)
    scene.add(Object.assign(new THREE.DirectionalLight(0xcce4ff, 0.35), { position: new THREE.Vector3(-5, 4, -4) }))

    const bM  = b / 1000
    const hM  = h / 1000
    const cov = 0.038

    // Centrer la poutre sur x=0
    const offsetX = -totalL / 2

    // ── BÉTON par travée ──
    let cx = offsetX
    travees.forEach(t => {
      const geo = new THREE.BoxGeometry(t.L, hM, bM)
      const mat = new THREE.MeshPhongMaterial({ color: 0xd3d1c7, transparent: true, opacity: 0.40, side: THREE.DoubleSide, depthWrite: false })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(cx + t.L / 2, 0, 0)
      scene.add(mesh)
      scene.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x444441 })))
      cx += t.L
    })

    // ── APPUIS ──
    function mkSupport(x: number, isEnd: boolean) {
      // Colonne
      const colH = isEnd ? 0.3 : 0.6
      const colGeo = new THREE.CylinderGeometry(isEnd ? 0.07 : 0.09, isEnd ? 0.07 : 0.09, colH, 12)
      const col = new THREE.Mesh(colGeo, new THREE.MeshPhongMaterial({ color: isEnd ? 0x888780 : 0x5f5e5a }))
      col.position.set(x, -hM / 2 - colH / 2, 0)
      scene.add(col)
      // Semelle
      const sem = new THREE.Mesh(
        new THREE.BoxGeometry(isEnd ? 0.25 : 0.35, 0.06, bM + 0.1),
        new THREE.MeshPhongMaterial({ color: 0x5f5e5a })
      )
      sem.position.set(x, -hM / 2 - colH - 0.03, 0)
      scene.add(sem)
      // Triangle appui (extrémités)
      if (isEnd) {
        const tri = new THREE.Mesh(new THREE.ConeGeometry(0, 0.12, 4), new THREE.MeshPhongMaterial({ color: 0x888780 }))
        tri.position.set(x, -hM / 2 - 0.06, 0)
        tri.rotation.y = Math.PI / 4
        scene.add(tri)
      }
    }

    let sx = offsetX
    mkSupport(sx, true)
    travees.forEach((t, i) => {
      sx += t.L
      mkSupport(sx, i === travees.length - 1)
    })

    // ── HELPER BARRE ──
    function mkBar(x: number, y: number, z: number, len: number, r: number, col: number, axis = "x") {
      const g = new THREE.CylinderGeometry(r, r, len, 16)
      const m = new THREE.MeshPhongMaterial({ color: col, shininess: 100 })
      const mesh = new THREE.Mesh(g, m)
      if (axis === "x") mesh.rotation.z = Math.PI / 2
      if (axis === "z") mesh.rotation.x = Math.PI / 2
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      scene.add(mesh)
    }

    // ── FERRAILLAGE PAR TRAVÉE ──
    cx = offsetX
    travees.forEach((t, i) => {
      const midX = cx + t.L / 2
      const barsT = parseBars(t.choix_trav)
      const barsG = parseBars(t.choix_chap_g)
      const barsD = parseBars(t.choix_chap_d)

      const rT = barsT.diam / 2 / 1000
      const rG = barsG.diam / 2 / 1000
      const rD = barsD.diam / 2 / 1000

      const yBot = -hM / 2 + cov + rT
      const yTop =  hM / 2 - cov - Math.max(rG, rD)

      const nbT = Math.min(barsT.nb, 6)
      const spT = (bM - 2 * cov) / Math.max(nbT - 1, 1)

      // Barres travée (inférieures)
      for (let j = 0; j < nbT; j++) {
        const z = -bM / 2 + cov + j * spT
        mkBar(midX, yBot, z, t.L - 0.04, rT, 0xe24b4a)
      }

      // Zone tendue travée
      const zt = new THREE.Mesh(
        new THREE.BoxGeometry(t.L - 0.06, cov * 2 + 0.04, bM - 0.02),
        new THREE.MeshPhongMaterial({ color: 0xe24b4a, transparent: true, opacity: 0.15 })
      )
      zt.position.set(midX, yBot + 0.01, 0)
      scene.add(zt)

      // Chapeaux gauche (sur appui gauche = cx)
      const nbG = Math.min(barsG.nb, 4)
      const spG = (bM - 2 * cov) / Math.max(nbG - 1, 1)
      const chapLenG = Math.min(t.L * 0.35, 1.5)
      for (let j = 0; j < nbG; j++) {
        const z = -bM / 2 + cov + j * spG
        mkBar(cx + chapLenG / 2, yTop, z, chapLenG, rG, 0x185fa5)
      }

      // Chapeaux droit (sur appui droit = cx+t.L)
      const nbD = Math.min(barsD.nb, 4)
      const spD = (bM - 2 * cov) / Math.max(nbD - 1, 1)
      const chapLenD = Math.min(t.L * 0.35, 1.5)
      for (let j = 0; j < nbD; j++) {
        const z = -bM / 2 + cov + j * spD
        mkBar(cx + t.L - chapLenD / 2, yTop, z, chapLenD, rD, 0x185fa5)
      }

      // Zone comprimée travée (haut)
      const zc = new THREE.Mesh(
        new THREE.BoxGeometry(t.L - 0.06, 0.05, bM - 0.02),
        new THREE.MeshPhongMaterial({ color: 0x185fa5, transparent: true, opacity: 0.12 })
      )
      zc.position.set(midX, hM / 2 - 0.035, 0)
      scene.add(zc)

      // Cadres HA8
      const sw = bM - 2 * cov, sh = hM - 2 * cov
      for (let x2 = cx + 0.1; x2 <= cx + t.L - 0.08; x2 += 0.15) {
        mkBar(x2, 0, -sw / 2, sh + 0.006, 0.004, 0x185fa5, "y")
        mkBar(x2, 0,  sw / 2, sh + 0.006, 0.004, 0x185fa5, "y")
        mkBar(x2,  sh / 2, 0, sw + 0.006, 0.004, 0x185fa5, "z")
        mkBar(x2, -sh / 2, 0, sw + 0.006, 0.004, 0x185fa5, "z")
      }

      cx += t.L
    })

    // ── CHARGES ──
    cx = offsetX
    travees.forEach(t => {
      const midX = cx + t.L / 2
      const aM2 = new THREE.MeshPhongMaterial({ color: 0xdc2626 })
      const linePts = [new THREE.Vector3(cx, hM / 2 + 0.4, 0), new THREE.Vector3(cx + t.L, hM / 2 + 0.4, 0)]
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts), new THREE.LineBasicMaterial({ color: 0xdc2626 })))
      for (let x2 = cx + 0.3; x2 <= cx + t.L - 0.2; x2 += 0.45) {
        const s = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.25, 8), aM2)
        s.position.set(x2, hM / 2 + 0.26, 0); scene.add(s)
        const hd = new THREE.Mesh(new THREE.ConeGeometry(0.028, 0.075, 8), aM2)
        hd.rotation.z = Math.PI; hd.position.set(x2, hM / 2 + 0.06, 0); scene.add(hd)
      }
      cx += t.L
    })

    // ── DIAGRAMME M (multi-travées) ──
    const mScale = 0.65 / maxM
    const mPts: any[] = []
    cx = offsetX
    travees.forEach(t => {
      const x1 = cx, x2 = cx + t.L
      const Mg = t.M_app_g, Md = t.M_app_d, Mt = t.M_trav
      for (let i = 0; i <= 40; i++) {
        const s = i / 40
        const x = x1 + s * t.L
        // Interpolation parabolique avec moments appuis
        const Mlin = Mg + (Md - Mg) * s
        const Mpar = 4 * Mt * s * (1 - s)
        const M = Mlin + Mpar
        mPts.push(new THREE.Vector3(x, -hM / 2 - 0.06 - M * mScale, bM / 2 + 0.08))
      }
      cx += t.L
    })
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mPts), new THREE.LineBasicMaterial({ color: 0x185fa5, linewidth: 2 })))

    // Remplissage M
    const mSh = new THREE.Shape()
    mSh.moveTo(mPts[0].x, -hM / 2 - 0.06)
    mPts.forEach((p: any) => mSh.lineTo(p.x, p.y))
    mSh.lineTo(mPts[mPts.length - 1].x, -hM / 2 - 0.06)
    mSh.closePath()
    const mFill = new THREE.Mesh(
      new THREE.ShapeGeometry(mSh),
      new THREE.MeshBasicMaterial({ color: 0x185fa5, transparent: true, opacity: 0.14, side: THREE.DoubleSide })
    )
    mFill.position.z = bM / 2 + 0.08
    scene.add(mFill)

    // ── DIAGRAMME V (multi-travées) ──
    const vScale = 0.35 / maxV
    cx = offsetX
    travees.forEach(t => {
      const pts = [
        new THREE.Vector3(cx, -hM / 2 - 0.06 - t.V_g * vScale, -(bM / 2 + 0.08)),
        new THREE.Vector3(cx + t.L, -hM / 2 - 0.06 - (-t.V_d) * vScale, -(bM / 2 + 0.08)),
      ]
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x22c55e, linewidth: 2 })))

      // Remplissage V
      const vSh = new THREE.Shape()
      vSh.moveTo(cx, -hM / 2 - 0.06)
      vSh.lineTo(cx, pts[0].y)
      vSh.lineTo(cx + t.L, pts[1].y)
      vSh.lineTo(cx + t.L, -hM / 2 - 0.06)
      vSh.closePath()
      const vFill = new THREE.Mesh(
        new THREE.ShapeGeometry(vSh),
        new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.13, side: THREE.DoubleSide })
      )
      vFill.position.z = -(bM / 2 + 0.08)
      scene.add(vFill)
      cx += t.L
    })

    // ── SOL ──
    const fl = new THREE.Mesh(
      new THREE.PlaneGeometry(totalL + 4, 6),
      new THREE.MeshPhongMaterial({ color: 0xe8e6e0 })
    )
    fl.rotation.x = -Math.PI / 2
    fl.position.y = -hM / 2 - 0.72
    fl.receiveShadow = true
    scene.add(fl)
    const grid = new THREE.GridHelper(totalL + 4, Math.round((totalL + 4) * 4), 0xd1cec7, 0xe2dfd8)
    grid.position.y = -hM / 2 - 0.71
    scene.add(grid)

    // ── ORBIT ──
    let drag = false, ox = 0, oy = 0
    let rotX = 0.28, rotY = 0.5, zoom = 1.0

    canvas.addEventListener("mousedown", e => { drag = true; ox = e.clientX; oy = e.clientY })
    canvas.addEventListener("mousemove", e => {
      if (!drag) return
      rotY += (e.clientX - ox) * 0.007; ox = e.clientX
      rotX += (e.clientY - oy) * 0.007; oy = e.clientY
      rotX = Math.max(-1.1, Math.min(1.1, rotX))
    })
    canvas.addEventListener("mouseup",    () => { drag = false })
    canvas.addEventListener("mouseleave", () => { drag = false })
    canvas.addEventListener("touchstart", e => { drag = true; ox = e.touches[0].clientX; oy = e.touches[0].clientY }, { passive: true })
    canvas.addEventListener("touchmove",  e => {
      if (!drag) return
      rotY += (e.touches[0].clientX - ox) * 0.007; ox = e.touches[0].clientX
      rotX += (e.touches[0].clientY - oy) * 0.007; oy = e.touches[0].clientY
    }, { passive: true })
    canvas.addEventListener("touchend", () => { drag = false })
    canvas.addEventListener("wheel", e => {
      e.preventDefault()
      zoom *= e.deltaY > 0 ? 1.09 : 0.92
      zoom = Math.max(0.25, Math.min(5, zoom))
    }, { passive: false })

    function animate() {
      frameRef.current = requestAnimationFrame(animate)
      const dist = (totalL * 0.9) * zoom
      camera.position.x = dist * Math.sin(rotY) * Math.cos(rotX)
      camera.position.y = dist * Math.sin(rotX) + 0.3
      camera.position.z = dist * Math.cos(rotY) * Math.cos(rotX)
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    animate()
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">

      {/* Métriques globales */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-border">
        {travees.map((t, i) => (
          <div key={i} className="bg-card px-3 py-2">
            <p className="text-[10px] text-muted-foreground">Travée {t.numero}</p>
            <p className="text-sm font-semibold">{t.L} m</p>
            <p className="text-[10px] text-blue-600">{t.M_trav} kN·m</p>
          </div>
        ))}
      </div>

      {/* Vue 3D */}
      <div ref={mountRef} className="relative bg-slate-50" style={{ height: 460 }}>
        <canvas style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }} />

        {/* Légende overlay */}
        <div className="absolute top-3 right-3 bg-white/95 border border-border rounded-lg px-3 py-2 text-xs space-y-1.5 max-w-[190px]">
          <div className="font-medium text-foreground mb-1">Ferraillage</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0"/><span>Barres travée (inf.)</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0"/><span>Chapeaux appuis (sup.)</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-blue-600 flex-shrink-0 rounded-sm"/><span>Cadres HA8/150</span></div>
          <div className="border-t border-border pt-1.5 space-y-0.5">
            <div className="flex items-center gap-2"><span className="w-6 h-1 bg-blue-500 flex-shrink-0 rounded"/><span>Diag. M (front)</span></div>
            <div className="flex items-center gap-2"><span className="w-6 h-1 bg-green-500 flex-shrink-0 rounded"/><span>Diag. V (arrière)</span></div>
          </div>
          <div className="border-t border-border pt-1 text-muted-foreground">
            {b}×{h} mm · {totalL.toFixed(1)} m · EC2
          </div>
        </div>

        {/* Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground whitespace-nowrap">
          Glisser pour pivoter · Molette pour zoomer
        </div>
      </div>
    </div>
  )
}
