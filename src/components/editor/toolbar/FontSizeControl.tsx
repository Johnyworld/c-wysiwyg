'use client'

import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px', '48px']

export function FontSizeControl({ editor }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (!val) {
      editor.chain().focus().unsetFontSize().run()
    } else {
      editor.chain().focus().setFontSize(val).run()
    }
  }

  return (
    <select
      onChange={handleChange}
      defaultValue=""
      className="text-sm border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer w-20"
      title="Font size"
    >
      <option value="">Size</option>
      {FONT_SIZES.map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  )
}
