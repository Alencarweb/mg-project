import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const step = await prisma.step.findUnique({
      where: { id: parseInt(params.id) }
    })

    if (!step) {
      return NextResponse.json(
        { error: 'Etapa não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(step)
  } catch (error) {
    console.error('Erro ao buscar etapa:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar etapa' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json()

    const step = await prisma.step.update({
      where: { id: parseInt(params.id) },
      data: { name }
    })

    return NextResponse.json(step)
  } catch (error) {
    console.error('Erro ao atualizar etapa:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar etapa' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.step.delete({
      where: { id: parseInt(params.id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir etapa:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir etapa' },
      { status: 500 }
    )
  }
}