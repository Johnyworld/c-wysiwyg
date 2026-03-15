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
      className="toolbar-btn flex items-center gap-1"
      onMouseDown={(e) => {
        e.preventDefault()
        inputRef.current?.click()
      }}
      title="Text color"
    >
      <span className="text-sm font-bold" style={{ color, textShadow: '0 0 1px #0002' }}>
        A
      </span>
      <span className="block w-4 h-1 rounded" style={{ backgroundColor: color }} />
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={(e) => onApply(e.target.value)}
        className="sr-only"
        aria-label="Text color"
      />
    </button>
  )
}
