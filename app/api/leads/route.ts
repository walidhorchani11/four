import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { jsonServerError } from '@/lib/prisma-api-error'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  clientSessionId: z.string().uuid(),
  /** nullish évite les rejets silencieux JSON null + z.string() */
  nom: z.string().trim().max(200).nullish(),
  telephone: z.string().trim().max(40).nullish(),
  adresse: z.string().trim().max(500).nullish(),
  commentaire: z.string().trim().max(2000).nullish(),
  productId: z.string().trim().max(100).nullish(),
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
      return NextResponse.json(
        { error: 'Données invalides', issues: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { clientSessionId } = parsed.data

    const existing = await prisma.lead.findUnique({
      where: { clientSessionId },
    })

    const nom = emptyToNull(parsed.data.nom ?? undefined)
    const telephone = emptyToNull(parsed.data.telephone ?? undefined)
    const adresse = emptyToNull(parsed.data.adresse ?? undefined)
    const commentaire = emptyToNull(parsed.data.commentaire ?? undefined)
    const productId = emptyToNull(parsed.data.productId ?? undefined)
    const status = parsed.data.status ?? 'draft'

    const data = {
      nom,
      telephone,
      adresse,
      commentaire,
      productId,
      status,
    }

    if (existing) {
      await prisma.lead.update({
        where: { clientSessionId },
        data,
      })
    } else {
      await prisma.lead.create({
        data: {
          clientSessionId,
          ...data,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return jsonServerError(e, '[POST /api/leads]')
  }
}
