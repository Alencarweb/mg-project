import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [totalClients, activeServices, payments] = await Promise.all([
      prisma.client.count(),
      prisma.clientService.count({
        where: { status: 'in_progress' }
      }),
      prisma.payment.findMany({
        where: {
          clientService: {
            status: 'in_progress'
          }
        }
      })
    ])

    return NextResponse.json({
      totalClients,
      activeServices,
      pendingPayments: payments.length
    })
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar estatísticas' },
      { status: 500 }
    )
  }
}