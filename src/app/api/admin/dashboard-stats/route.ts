import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Buscar estatísticas básicas
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

    // Buscar métricas de serviços por tipo
    const serviceTypes = await prisma.service.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    })

    // Buscar receita mensal dos últimos 6 meses
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyRevenue = await prisma.payment.groupBy({
      by: ['paidAt'],
      _sum: {
        amount: true
      },
      where: {
        paidAt: {
          gte: sixMonthsAgo
        }
      }
    })

    // Processar dados para os gráficos
    const serviceMetrics = {
      labels: serviceTypes.map(type => type.type),
      data: serviceTypes.map(type => type._count.id)
    }

    const monthlyRevenueData = {
      labels: monthlyRevenue.map(m => m.paidAt.toLocaleDateString('pt-BR', { month: 'short' })),
      data: monthlyRevenue.map(m => m._sum.amount || 0)
    }

    return NextResponse.json({
      totalClients,
      activeServices,
      pendingPayments: payments.length,
      serviceMetrics,
      monthlyRevenue: monthlyRevenueData
    })
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar estatísticas' },
      { status: 500 }
    )
  }
}