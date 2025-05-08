import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const steps = await prisma.step.findMany()
    return NextResponse.json(steps)
  } catch (error) {
    console.error('Erro ao carregar etapas:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar etapas' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    const step = await prisma.step.create({
      data: { name }
    })

    return NextResponse.json(step)
  } catch (error) {
    console.error('Erro ao criar etapa:', error)
    return NextResponse.json(
      { error: 'Erro ao criar etapa' },
      { status: 500 }
    )
  }
}