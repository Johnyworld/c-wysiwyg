'use client'

import { Editor } from '@tiptap/react'

interface Props {
  editor: Editor
}

const ALIGNMENTS = [
  { value: 'left', label: '≡', title: 'Align left' },
  { value: 'center', label: '≡', title: 'Align center' },
  { value: 'right', label: '≡', title: 'Align right' },
  { value: 'justify', label: '≡', title: 'Justify' },
] as const

// Use unicode characters for alignment icons
const ICONS: Record<string, string> = {
  left: '⇤',
  center: '↔',
  right: '⇥',
  justify: '⇔',
}

export function AlignmentControl({ editor }: Props) {
  return (
    <>
      {ALIGNMENTS.map(({ value, title }) => (
        <button
          key={value}
          className={`toolbar-btn${editor.isActive({ textAlign: value }) ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().setTextAlign(value).run()}
          title={title}
        >
          {ICONS[value]}
        </button>
      ))}
    </>
  )
}
