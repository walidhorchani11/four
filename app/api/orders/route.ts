import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { productsCatalog } from '@/components/landing/products-catalog'
import { jsonServerError } from '@/lib/prisma-api-error'
import { isValidTunisianPhone, tunisianPhoneToE164 } from '@/lib/tunisian-phone'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  nom: z.string().trim().min(1).max(200),
  telephone: z
    .string()
    .trim()
    .max(40)
    .refine((s) => isValidTunisianPhone(s), { message: 'PHONE_INVALID' }),
  adresse: z.string().trim().min(1).max(500),
  commentaire: z.string().trim().max(2000).optional().nullable(),
  productId: z.string().trim().min(1),
  clientSessionId: z.string().uuid().optional(),
})

async function sendTelegramOrderNotification(params: {
  orderId: string
  createdAt: Date
  nom: string
  telephone: string
  adresse: string
  commentaire: string | null
  productName: string
  priceDt: number
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const lines = [
    'Nouvelle commande confirmee',
    `ID: ${params.orderId}`,
    `Date: ${params.createdAt.toISOString()}`,
    `Nom: ${params.nom}`,
    `Telephone: ${params.telephone}`,
    `Adresse: ${params.adresse}`,
    `Produit: ${params.productName}`,
    `Prix: ${params.priceDt} DT`,
    `Commentaire: ${params.commentaire ?? 'Aucun'}`,
  ]

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n'),
    }),
  })

  if (!res.ok) {
    const payload = await res.text().catch(() => '')
    throw new Error(`Telegram sendMessage failed: ${res.status} ${payload}`)
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      const phoneIssue = parsed.error.issues.some(
        (i) => i.path[0] === 'telephone' && i.message === 'PHONE_INVALID'
      )
      if (phoneIssue) {
        return NextResponse.json({ error: 'PHONE_INVALID' }, { status: 400 })
      }
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const { nom, adresse, commentaire, productId, clientSessionId } = parsed.data
    const telephone = tunisianPhoneToE164(parsed.data.telephone)!

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
        productName: product.nameFr,
        priceDt,
      },
    })

    if (clientSessionId) {
      await prisma.lead.updateMany({
        where: { clientSessionId, status: { not: 'converted' } },
        data: { status: 'converted', orderId: order.id },
      })
    }

    void sendTelegramOrderNotification({
      orderId: order.id,
      createdAt: order.createdAt,
      nom: order.nom,
      telephone: order.telephone,
      adresse: order.adresse,
      commentaire: order.commentaire,
      productName: order.productName,
      priceDt: order.priceDt,
    }).catch((err) => {
      console.error('[Telegram notification]', err)
    })

    return NextResponse.json({ id: order.id }, { status: 201 })
  } catch (e) {
    return jsonServerError(e, '[POST /api/orders]')
  }
}
