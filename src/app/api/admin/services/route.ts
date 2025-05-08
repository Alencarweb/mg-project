import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        steps: {
          include: {
            step: true
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, type, fixedPrice } = body

    const service = await prisma.service.create({
      data: {
        name,
        description,
        type,
        fixedPrice: fixedPrice ? parseFloat(fixedPrice) : null,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    return NextResponse.json(
      { error: 'Erro ao criar serviço' },
      { status: 500 }
    )
  }
}