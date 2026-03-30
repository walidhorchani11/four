import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

export function prismaErrorDebug(e: unknown): Record<string, unknown> {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return { kind: 'PrismaClientKnownRequestError', code: e.code, message: e.message, meta: e.meta }
  }
  if (e instanceof Prisma.PrismaClientValidationError) {
    return { kind: 'PrismaClientValidationError', message: e.message }
  }
  if (e instanceof Prisma.PrismaClientInitializationError) {
    return { kind: 'PrismaClientInitializationError', message: e.message }
  }
  if (e instanceof Error) {
    return { kind: e.name, message: e.message, stack: process.env.NODE_ENV === 'development' ? e.stack : undefined }
  }
  return { kind: 'unknown', message: String(e) }
}

export function jsonServerError(e: unknown, logPrefix: string) {
  console.error(logPrefix, e)
  const debug = process.env.NODE_ENV === 'development' ? prismaErrorDebug(e) : undefined
  return NextResponse.json(
    { error: 'Erreur serveur', ...(debug ? { debug } : {}) },
    { status: 500 }
  )
}
