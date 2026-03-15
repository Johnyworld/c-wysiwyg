'use client'

import { Editor } from '@tiptap/react'
import { useRef } from 'react'

interface Props {
  editor: Editor
}

export function ColorControl({ editor }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(e.target.value).run()
  }

  const currentColor =
    (editor.getAttributes('textStyle').color as string | undefined) ?? '#000000'

  return (
    <button
      className="toolbar-btn flex items-center gap-1"
      onClick={() => inputRef.current?.click()}
      title="Text color"
    >
      <span className="text-sm font-bold" style={{ color: currentColor, textShadow: '0 0 1px #0002' }}>
        A
      </span>
      <span
        className="block w-4 h-1 rounded"
        style={{ backgroundColor: currentColor }}
      />
      <input
        ref={inputRef}
        type="color"
        value={currentColor}
        onChange={handleChange}
        className="sr-only"
        aria-label="Text color"
      />
    </button>
  )
}
