'use client'

import { RefObject, useEffect } from 'react'

interface EditorProps {
  editorRef: RefObject<HTMLDivElement | null>
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onPaste: (e: React.ClipboardEvent) => void
}

export function Editor({ editorRef, onDrop, onDragOver, onPaste }: EditorProps) {
  useEffect(() => {
    document.execCommand('defaultParagraphSeparator', false, 'p')
  }, [])

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onDrop={onDrop}
      onDragOver={onDragOver}
      onPaste={onPaste}
      className="wysiwyg-editor prose prose-slate dark:prose-invert prose-sm sm:prose max-w-none min-h-130 p-6 focus:outline-none bg-[var(--bg-surface)] text-[var(--text-primary)] transition-colors duration-200"
      data-placeholder="여기에 내용을 입력하세요..."
    />
  )
}
