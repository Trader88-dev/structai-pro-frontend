import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
  const calculs = await prisma.calcul.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
  return NextResponse.json(calculs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
  const { type, title, inputs, results } = await req.json()
  const calcul = await prisma.calcul.create({
    data: {
      type, title,
      inputs: JSON.stringify(inputs),
      results: JSON.stringify(results),
      userId: session.user.id,
    },
  })
  return NextResponse.json(calcul)
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
  const id = req.nextUrl.searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 })
  await prisma.calcul.deleteMany({ where: { id, userId: session.user.id } })
  return NextResponse.json({ success: true })
}
