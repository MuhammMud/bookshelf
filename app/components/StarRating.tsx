'use client'

import { useState } from 'react'

export default function StarRating({
  rating,
  onRate,
  readonly = false,
}: {
  rating: number | null
  onRate?: (rating: number) => void
  readonly?: boolean
}) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const displayRating = hoverRating ?? rating ?? 0

  function handleClick(starIndex: number, isHalf: boolean) {
    if (readonly || !onRate) return
    const newRating = isHalf ? starIndex - 0.5 : starIndex
    onRate(newRating)
  }

  function handleMouseMove(e: React.MouseEvent, starIndex: number) {
    if (readonly) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const isHalf = x < rect.width / 2
    setHoverRating(isHalf ? starIndex - 0.5 : starIndex)
  }

  return (
    <div
      style={{ display: 'inline-flex', gap: '2px', cursor: readonly ? 'default' : 'pointer' }}
      onMouseLeave={() => setHoverRating(null)}
    >
      {[1, 2, 3, 4, 5].map((starIndex) => {
        const fillLevel = displayRating >= starIndex
          ? 'full'
          : displayRating >= starIndex - 0.5
          ? 'half'
          : 'empty'

        return (
          <span
            key={starIndex}
            onMouseMove={(e) => handleMouseMove(e, starIndex)}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = e.clientX - rect.left
              const isHalf = x < rect.width / 2
              handleClick(starIndex, isHalf)
            }}
            style={{
              fontSize: readonly ? '14px' : '22px',
              lineHeight: 1,
              position: 'relative',
              display: 'inline-block',
              color: '#e8dfd2',
              userSelect: 'none',
            }}
          >
            {/* Empty star background */}
            <span>★</span>

            {/* Filled overlay */}
            {fillLevel !== 'empty' && (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  overflow: 'hidden',
                  width: fillLevel === 'full' ? '100%' : '50%',
                  color: '#c47d2a',
                }}
              >
                ★
              </span>
            )}
          </span>
        )
      })}
      {displayRating > 0 && (
        <span style={{ fontSize: readonly ? '12px' : '14px', color: '#a08c6e', marginLeft: '6px', alignSelf: 'center' }}>
          {displayRating}
        </span>
      )}
    </div>
  )
}