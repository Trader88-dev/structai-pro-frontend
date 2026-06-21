import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 })
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: "Email deja utilise" }, { status: 400 })
    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })
    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (e) {
    console.error("ERREUR:", e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}