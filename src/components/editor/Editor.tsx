'use client'

import { EditorContent, Editor as TiptapEditor } from '@tiptap/react'

interface EditorProps {
  editor: TiptapEditor | null
}

export function Editor({ editor }: EditorProps) {
  return (
    <div className="border-t border-gray-200">
      <EditorContent editor={editor} />
    </div>
  )
}
