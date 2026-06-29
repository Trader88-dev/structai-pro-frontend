"use client"

import { useEffect, useRef } from "react"

type BeamSchemaProps = {
  b: number        // largeur section mm
  h: number        // hauteur section mm
  L: number        // portée m
  As?: number      // aire acier mm²
  choix?: string   // ex: "6HA14"
  d?: number       // hauteur utile mm
  MEd?: number     // moment kN.m
  VEd?: number     // effort tranchant kN
  mu?: number      // moment réduit
  pivot?: string   // "A" ou "B"
  norme?: string   // "EC2" ou "BAEL"
}

export function BeamSchema({ b, h, L, As, choix, d, MEd, VEd, mu, pivot, norme = "EC2" }: BeamSchemaProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<any>(null)
  const frameRef = useRef<number>(0)

  const match = choix?.match(/(\d+)HA(\d+)/)
  const nbBars = match ? parseInt(match[1]) : 6
  const diam   = match ? parseInt(match[2]) : 14
  const cover  = 38 // mm
  const dReal  = d ?? (h - cover - diam/2 - 8)

  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current

    // Charger Three.js dynamiquement
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
    script.onload = () => initScene(container)
    document.head.appendChild(script)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [b, h, L, As, choix, d, MEd, VEd])

  function initScene(container: HTMLDivElement) {
    const THREE = (window as any).THREE
    if (!THREE) return

    const canvas = container.querySelector("canvas") as HTMLCanvasElement
    if (!canvas) return

    const W = container.clientWidth
    const H = 420

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setClearColor(0xf8fafc, 1)
    renderer.shadowMap.enabled = true
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.01, 100)

    // Lumières
    scene.add(new THREE.AmbientLight(0xffffff, 0.65))
    const sun = new THREE.DirectionalLight(0xffffff, 1.0)
    sun.position.set(5, 8, 6)
    sun.castShadow = true
    scene.add(sun)
    const fill = new THREE.DirectionalLight(0xcce4ff, 0.4)
    fill.position.set(-4, 3, -3)
    scene.add(fill)

    // Dimensions en mètres
    const bM  = b / 1000
    const hM  = h / 1000
    const cov = cover / 1000

    // ── BÉTON ──
    const concGeo = new THREE.BoxGeometry(L, hM, bM)
    const concMat = new THREE.MeshPhongMaterial({
      color: 0xd3d1c7, transparent: true, opacity: 0.42,
      side: THREE.DoubleSide, depthWrite: false
    })
    scene.add(new THREE.Mesh(concGeo, concMat))
    scene.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(concGeo),
      new THREE.LineBasicMaterial({ color: 0x5f5e5a })
    ))

    // ── HELPER BARRE ──
    function mkBar(x: number, y: number, z: number, len: number, r: number, col: number, axis = "x") {
      const g = new THREE.CylinderGeometry(r, r, len, 18)
      const m = new THREE.MeshPhongMaterial({ color: col, shininess: 100 })
      const mesh = new THREE.Mesh(g, m)
      if (axis === "x") mesh.rotation.z = Math.PI / 2
      if (axis === "z") mesh.rotation.x = Math.PI / 2
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      scene.add(mesh)
    }

    // ── ARMATURES INFÉRIEURES ──
    const r = diam / 2 / 1000
    const yBot = -hM / 2 + cov + r
    const nb = Math.min(nbBars, 8)
    const sp = (bM - 2 * cov - 2 * r) / Math.max(nb - 1, 1)
    for (let i = 0; i < nb; i++) {
      mkBar(0, yBot, -bM / 2 + cov + r + i * sp, L - 0.05, r, 0xe24b4a)
    }

    // ── ARMATURES SUPÉRIEURES 2HA10 ──
    const r10 = 0.005
    const yTop = hM / 2 - cov - r10
    mkBar(0, yTop, -bM / 2 + cov + r10 + 0.02, L - 0.05, r10, 0x378add)
    mkBar(0, yTop,  bM / 2 - cov - r10 - 0.02, L - 0.05, r10, 0x378add)

    // ── ZONE TENDUE ──
    const tz = new THREE.Mesh(
      new THREE.BoxGeometry(L - 0.1, cov * 2 + 0.05, bM - 0.02),
      new THREE.MeshPhongMaterial({ color: 0xe24b4a, transparent: true, opacity: 0.18 })
    )
    tz.position.set(0, yBot + 0.015, 0)
    scene.add(tz)

    // ── ZONE COMPRIMÉE ──
    const cz = new THREE.Mesh(
      new THREE.BoxGeometry(L - 0.1, 0.06, bM - 0.02),
      new THREE.MeshPhongMaterial({ color: 0x185fa5, transparent: true, opacity: 0.15 })
    )
    cz.position.set(0, hM / 2 - 0.045, 0)
    scene.add(cz)

    // ── CADRES HA8 / 150mm ──
    const r8 = 0.004
    const sw = bM - 2 * cov
    const sh = hM - 2 * cov
    for (let x = -L / 2 + 0.1; x <= L / 2 - 0.08; x += 0.15) {
      mkBar(x, 0, -sw / 2, sh + 0.008, r8, 0x185fa5, "y")
      mkBar(x, 0,  sw / 2, sh + 0.008, r8, 0x185fa5, "y")
      mkBar(x,  sh / 2, 0, sw + 0.008, r8, 0x185fa5, "z")
      mkBar(x, -sh / 2, 0, sw + 0.008, r8, 0x185fa5, "z")
    }

    // ── APPUIS ──
    function support(xp: number) {
      const cone = new THREE.Mesh(
        new THREE.CylinderGeometry(0, 0.13, 0.24, 4),
        new THREE.MeshPhongMaterial({ color: 0x888780 })
      )
      cone.position.set(xp, -hM / 2 - 0.12, 0)
      cone.rotation.y = Math.PI / 4
      scene.add(cone)
      const plate = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.02, 0.28),
        new THREE.MeshPhongMaterial({ color: 0x5f5e5a })
      )
      plate.position.set(xp, -hM / 2 - 0.25, 0)
      scene.add(plate)
    }
    support(-L / 2)
    support(L / 2)

    // ── SOL ──
    const fl = new THREE.Mesh(
      new THREE.PlaneGeometry(L + 4, 6),
      new THREE.MeshPhongMaterial({ color: 0xe8e6e0 })
    )
    fl.rotation.x = -Math.PI / 2
    fl.position.y = -hM / 2 - 0.29
    fl.receiveShadow = true
    scene.add(fl)
    const grid = new THREE.GridHelper(L + 4, 24, 0xd1cec7, 0xe2dfd8)
    grid.position.y = -hM / 2 - 0.28
    scene.add(grid)

    // ── CHARGES ──
    const aM2 = new THREE.MeshPhongMaterial({ color: 0xdc2626 })
    const linePts = [new THREE.Vector3(-L / 2, hM / 2 + 0.42, 0), new THREE.Vector3(L / 2, hM / 2 + 0.42, 0)]
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePts), new THREE.LineBasicMaterial({ color: 0xdc2626 })))
    for (let x = -L / 2 + 0.4; x <= L / 2 - 0.3; x += 0.5) {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.28, 8), aM2)
      s.position.set(x, hM / 2 + 0.27, 0)
      scene.add(s)
      const hd = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 8), aM2)
      hd.rotation.z = Math.PI
      hd.position.set(x, hM / 2 + 0.065, 0)
      scene.add(hd)
    }

    // ── DIAGRAMME M ──
    if (MEd) {
      const pts: any[] = []
      for (let i = 0; i <= 80; i++) {
        const t = i / 80
        pts.push(new THREE.Vector3(-L / 2 + t * L, -hM / 2 - 0.06 - 4 * t * (1 - t) * 0.7, 0))
      }
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0x185fa5, linewidth: 2 })))
      const sh = new THREE.Shape()
      sh.moveTo(-L / 2, -hM / 2 - 0.06)
      pts.forEach((p: any) => sh.lineTo(p.x, p.y))
      sh.lineTo(L / 2, -hM / 2 - 0.06)
      sh.closePath()
      scene.add(new THREE.Mesh(
        new THREE.ShapeGeometry(sh),
        new THREE.MeshBasicMaterial({ color: 0x185fa5, transparent: true, opacity: 0.15, side: THREE.DoubleSide })
      ))
    }

    // ── DIAGRAMME V ──
    if (VEd) {
      const vPts = [
        new THREE.Vector3(-L / 2, -hM / 2 - 0.06, bM / 2 + 0.05),
        new THREE.Vector3(-L / 2, -hM / 2 - 0.06 - 0.35, bM / 2 + 0.05),
        new THREE.Vector3(L / 2, -hM / 2 - 0.06 + 0.35, bM / 2 + 0.05),
        new THREE.Vector3(L / 2, -hM / 2 - 0.06, bM / 2 + 0.05),
      ]
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vPts), new THREE.LineBasicMaterial({ color: 0x22c55e, linewidth: 2 })))
    }

    // ── ROTATION ──
    let drag = false, ox = 0, oy = 0
    let rotX = 0.32, rotY = 0.48, zoom = 1.0

    canvas.addEventListener("mousedown", e => { drag = true; ox = e.clientX; oy = e.clientY })
    canvas.addEventListener("mousemove", e => {
      if (!drag) return
      rotY += (e.clientX - ox) * 0.007; ox = e.clientX
      rotX += (e.clientY - oy) * 0.007; oy = e.clientY
      rotX = Math.max(-1.2, Math.min(1.2, rotX))
    })
    canvas.addEventListener("mouseup", () => { drag = false })
    canvas.addEventListener("mouseleave", () => { drag = false })
    canvas.addEventListener("touchstart", e => { drag = true; ox = e.touches[0].clientX; oy = e.touches[0].clientY }, { passive: true })
    canvas.addEventListener("touchmove", e => {
      if (!drag) return
      rotY += (e.touches[0].clientX - ox) * 0.007; ox = e.touches[0].clientX
      rotX += (e.touches[0].clientY - oy) * 0.007; oy = e.touches[0].clientY
    }, { passive: true })
    canvas.addEventListener("touchend", () => { drag = false })
    canvas.addEventListener("wheel", e => {
      e.preventDefault()
      zoom *= e.deltaY > 0 ? 1.09 : 0.92
      zoom = Math.max(0.3, Math.min(4, zoom))
    }, { passive: false })

    function animate() {
      frameRef.current = requestAnimationFrame(animate)
      const rr = (L * 1.2) * zoom
      camera.position.x = rr * Math.sin(rotY) * Math.cos(rotX)
      camera.position.y = rr * Math.sin(rotX) + 0.5
      camera.position.z = rr * Math.cos(rotY) * Math.cos(rotX)
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
    }
    animate()
  }

  const pivotColor = pivot === "A" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">

      {/* Header métriques */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
        {MEd && (
          <div className="bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">MEd</p>
            <p className="text-lg font-semibold">{MEd} <span className="text-xs font-normal text-muted-foreground">kN·m</span></p>
          </div>
        )}
        {VEd && (
          <div className="bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">VEd</p>
            <p className="text-lg font-semibold">{VEd} <span className="text-xs font-normal text-muted-foreground">kN</span></p>
          </div>
        )}
        {mu && (
          <div className="bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">μ</p>
            <p className="text-lg font-semibold">{mu?.toFixed(4)} {pivot && <span className={`text-xs px-1.5 py-0.5 rounded ${pivotColor}`}>Pivot {pivot}</span>}</p>
          </div>
        )}
        {As && (
          <div className="bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">As retenu</p>
            <p className="text-lg font-semibold">{choix} <span className="text-xs font-normal text-muted-foreground">({As} mm²)</span></p>
          </div>
        )}
      </div>

      {/* Vue 3D */}
      <div ref={mountRef} className="relative bg-slate-50" style={{ height: 420 }}>
        <canvas style={{ width: "100%", height: "100%", display: "block", cursor: "grab" }} />

        {/* Légende overlay */}
        <div className="absolute top-3 right-3 bg-white/95 border border-border rounded-lg px-3 py-2 text-xs space-y-1.5">
          <div className="font-medium text-foreground mb-1">Ferraillage</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/>{choix ?? `${nbBars}HA${diam}`} — {As} mm²</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/>2HA10 compression</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-blue-600 inline-block rounded-sm"/>Cadres HA8/150</div>
          <div className="border-t border-border pt-1 text-muted-foreground">
            {b}×{h} · d={dReal}mm · {norme}
          </div>
        </div>

        {/* Hint navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground">
          Glisser pour pivoter · Molette pour zoomer
        </div>
      </div>
    </div>
  )
}
