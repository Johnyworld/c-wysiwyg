'use client'

import { useRef } from 'react'

interface Props {
  color: string
  onApply: (color: string) => void
}

export function ColorControl({ color, onApply }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <button
      type="button"
      className="toolbar-btn flex-col gap-0.5 w-auto px-2"
      onMouseDown={(e) => {
        e.preventDefault()
        inputRef.current?.click()
      }}
      title="글자 색상"
    >
      <span className="text-sm font-bold leading-none" style={{ color }}>A</span>
      <span className="block w-4 h-0.5 rounded-full" style={{ backgroundColor: color }} />
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(e) => onApply(e.target.value)}
        className="sr-only"
        aria-label="글자 색상"
      />
    </button>
  )
}
