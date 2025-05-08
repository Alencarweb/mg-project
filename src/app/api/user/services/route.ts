import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { client: true }
    })

    if (!user?.client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    const services = await prisma.clientService.findMany({
      where: { clientId: user.client.id },
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
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Erro ao carregar serviços:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar serviços' },
      { status: 500 }
    )
  }
}