import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        services: {
          include: {
            service: {
              select: {
                name: true
              }
            },
            steps: {
              include: {
                step: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(client)
  } catch (error) {
    console.error('Erro ao carregar cliente:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar cliente' },
      { status: 500 }
    )
  }
}