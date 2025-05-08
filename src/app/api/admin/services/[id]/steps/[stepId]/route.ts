import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, stepId: string } }
) {
  try {
    await prisma.serviceStep.delete({
      where: { id: parseInt(params.stepId) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao remover etapa:', error)
    return NextResponse.json(
      { error: 'Erro ao remover etapa' },
      { status: 500 }
    )
  }
}