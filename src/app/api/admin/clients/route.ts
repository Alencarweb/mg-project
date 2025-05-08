import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
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
            }
          }
        }
      }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar clientes' },
      { status: 500 }
    )
  }
}