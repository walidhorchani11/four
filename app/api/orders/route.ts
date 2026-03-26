import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { productsCatalog } from '@/components/landing/products-catalog'

const bodySchema = z.object({
  nom: z.string().trim().min(1).max(200),
  telephone: z.string().trim().min(1).max(40),
  adresse: z.string().trim().min(1).max(500),
  commentaire: z.string().trim().max(2000).optional().nullable(),
  productId: z.string().trim().min(1),
  clientSessionId: z.string().uuid().optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const { nom, telephone, adresse, commentaire, productId, clientSessionId } = parsed.data

    const product = productsCatalog.find((p) => p.id === productId)
    if (!product) {
      return NextResponse.json({ error: 'Produit inconnu' }, { status: 400 })
    }

    const priceDt = Number.parseInt(product.price, 10)
    if (Number.isNaN(priceDt)) {
      return NextResponse.json({ error: 'Prix invalide' }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        nom,
        telephone,
        adresse,
        commentaire: commentaire?.length ? commentaire : null,
        productId,
        productName: product.name,
        priceDt,
      },
    })

    if (clientSessionId) {
      await prisma.lead.updateMany({
        where: { clientSessionId, status: { not: 'converted' } },
        data: { status: 'converted', orderId: order.id },
      })
    }

    return NextResponse.json({ id: order.id }, { status: 201 })
  } catch (e) {
    console.error('[POST /api/orders]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
