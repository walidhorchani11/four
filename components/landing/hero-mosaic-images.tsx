"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

/** Ordre du carrousel : 0 → 1 → 2 → 0 … */
const HERO_IMAGE_SRCS = [
  "/images/Fh.webp",
  "/images/fh2.jpeg",
  "/images/fh3.jpeg",
] as const

const COLS = 8
const ROWS = 8
const DELAY_BEFORE_MOSAIC_MS = 4500
const STAGGER_MS = 16
const TILE_ANIM_MS = 380

const N = HERO_IMAGE_SRCS.length

type Phase = "showing" | "mosaic"

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const fn = () => setReduced(mq.matches)
    mq.addEventListener("change", fn)
    return () => mq.removeEventListener("change", fn)
  }, [])
  return reduced
}

function buildShuffledTiles(): { c: number; r: number; delay: number }[] {
  const order = Array.from({ length: COLS * ROWS }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order.map((flatIdx, orderIdx) => ({
    c: flatIdx % COLS,
    r: Math.floor(flatIdx / COLS),
    delay: orderIdx * STAGGER_MS,
  }))
}

function nextIndex(i: number): number {
  return (i + 1) % N
}

export function HeroMosaicImages({
  alt1,
  alt2,
  alt3,
}: {
  alt1: string
  alt2: string
  alt3: string
}) {
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<Phase>("showing")
  const [visibleIndex, setVisibleIndex] = useState(0)

  const alts = [alt1, alt2, alt3]

  useEffect(() => {
    for (const src of HERO_IMAGE_SRCS) {
      const img = new window.Image()
      img.src = src
    }
  }, [])

  const mosaicTiles = useMemo(() => {
    if (phase !== "mosaic") return []
    return buildShuffledTiles()
  }, [phase, visibleIndex])

  const mosaicTotalMs =
    (COLS * ROWS - 1) * STAGGER_MS + TILE_ANIM_MS + 200

  useEffect(() => {
    if (phase !== "showing") return
    const id = window.setTimeout(() => {
      if (reducedMotion) {
        setVisibleIndex((v) => nextIndex(v))
      } else {
        setPhase("mosaic")
      }
    }, DELAY_BEFORE_MOSAIC_MS)
    return () => clearTimeout(id)
  }, [phase, visibleIndex, reducedMotion])

  useEffect(() => {
    if (phase !== "mosaic") return
    const id = window.setTimeout(() => {
      setVisibleIndex((v) => nextIndex(v))
      setPhase("showing")
    }, mosaicTotalMs)
    return () => clearTimeout(id)
  }, [phase, mosaicTotalMs])

  const posPct = (i: number, n: number) => (n <= 1 ? 50 : (i / (n - 1)) * 100)

  const outgoingSrc = HERO_IMAGE_SRCS[visibleIndex]
  const incomingSrc = HERO_IMAGE_SRCS[nextIndex(visibleIndex)]

  return (
    <div className="absolute inset-0">
      {phase === "showing" && (
        <Image
          src={HERO_IMAGE_SRCS[visibleIndex]}
          alt={alts[visibleIndex]}
          fill
          sizes="(max-width: 1024px) 100vw, 500px"
          className="object-cover"
          priority={visibleIndex === 0}
          loading="eager"
        />
      )}
      {phase === "mosaic" && (
        <>
          <Image
            src={incomingSrc}
            alt={alts[nextIndex(visibleIndex)]}
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            aria-hidden
          >
            {mosaicTiles.map(({ c, r, delay }) => (
              <div
                key={`${c}-${r}`}
                className="hero-mosaic-tile absolute box-border border-0"
                style={{
                  left: `${(c / COLS) * 100}%`,
                  top: `${(r / ROWS) * 100}%`,
                  width: `${100 / COLS}%`,
                  height: `${100 / ROWS}%`,
                  backgroundImage: `url(${outgoingSrc})`,
                  backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                  backgroundPosition: `${posPct(c, COLS)}% ${posPct(r, ROWS)}%`,
                  animationDelay: `${delay}ms`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
