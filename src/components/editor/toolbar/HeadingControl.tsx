'use client'

import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

type Level = 1 | 2 | 3

export function HeadingControl({ editor }: Props) {
  const currentValue = (() => {
    for (const level of [1, 2, 3] as Level[]) {
      if (editor.isActive('heading', { level })) return String(level)
    }
    return '0'
  })()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value)
    if (val === 0) {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().toggleHeading({ level: val as Level }).run()
    }
  }

  return (
    <select
      value={currentValue}
      onChange={handleChange}
      className="text-sm border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer"
      title="Heading"
    >
      <option value="0">Paragraph</option>
      <option value="1">H1</option>
      <option value="2">H2</option>
      <option value="3">H3</option>
    </select>
  )
}
