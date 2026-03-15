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
    // eslint-disable-next-line @typescript-eslint/no-deprecated
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
      className="wysiwyg-editor prose prose-slate prose-sm sm:prose max-w-none min-h-130 p-6 focus:outline-none"
      data-placeholder="여기에 내용을 입력하세요..."
    />
  )
}
