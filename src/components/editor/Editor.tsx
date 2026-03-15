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
    // Make Enter key produce <p> instead of <div> in Chrome
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    document.execCommand('defaultParagraphSeparator', false, 'p')
  }, [])

  return (
    <div className="border-t border-gray-200">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaste={onPaste}
        className="wysiwyg-editor prose prose-sm sm:prose max-w-none min-h-96 p-4 focus:outline-none"
        data-placeholder="Start writing..."
      />
    </div>
  )
}
