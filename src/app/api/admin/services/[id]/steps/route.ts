import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const steps = await prisma.serviceStep.findMany({
      where: { serviceId: parseInt(params.id) },
      include: { step: true },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(steps)
  } catch (error) {
    console.error('Erro ao carregar etapas:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar etapas' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { stepId, order } = await request.json()

    const serviceStep = await prisma.serviceStep.create({
      data: {
        serviceId: parseInt(params.id),
        stepId,
        order
      },
      include: { step: true }
    })

    return NextResponse.json(serviceStep)
  } catch (error) {
    console.error('Erro ao adicionar etapa:', error)
    return NextResponse.json(
      { error: 'Erro ao adicionar etapa' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { steps } = await request.json()

    await prisma.$transaction(
      steps.map((step: any) =>
        prisma.serviceStep.update({
          where: { id: step.id },
          data: { order: step.order }
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao reordenar etapas:', error)
    return NextResponse.json(
      { error: 'Erro ao reordenar etapas' },
      { status: 500 }
    )
  }
}