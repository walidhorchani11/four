import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const bodySchema = z.object({
  clientSessionId: z.string().uuid(),
  markWhatsappOpened: z.boolean().optional(),
  nom: z.string().trim().max(200).optional().nullable(),
  telephone: z.string().trim().max(40).optional().nullable(),
  adresse: z.string().trim().max(500).optional().nullable(),
  commentaire: z.string().trim().max(2000).optional().nullable(),
  productId: z.string().trim().max(100).optional().nullable(),
  status: z.enum(['draft', 'dropped']).optional(),
})

function emptyToNull(s: string | null | undefined): string | null {
  if (s == null) return null
  const t = s.trim()
  return t.length > 0 ? t : null
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const parsed = bodySchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }

    const { clientSessionId, markWhatsappOpened } = parsed.data

    if (markWhatsappOpened) {
      await prisma.lead.updateMany({
        where: { clientSessionId },
        data: { whatsappOpenedAt: new Date() },
      })
      return NextResponse.json({ ok: true })
    }

    const existing = await prisma.lead.findUnique({
      where: { clientSessionId },
    })
    if (existing?.status === 'converted') {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const nom = emptyToNull(parsed.data.nom ?? undefined)
    const telephone = emptyToNull(parsed.data.telephone ?? undefined)
    const adresse = emptyToNull(parsed.data.adresse ?? undefined)
    const commentaire = emptyToNull(parsed.data.commentaire ?? undefined)
    const productId = emptyToNull(parsed.data.productId ?? undefined)
    const status = parsed.data.status ?? 'draft'

    await prisma.lead.upsert({
      where: { clientSessionId },
      create: {
        clientSessionId,
        nom,
        telephone,
        adresse,
        commentaire,
        productId,
        status,
      },
      update: {
        nom,
        telephone,
        adresse,
        commentaire,
        productId,
        status,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[POST /api/leads]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
