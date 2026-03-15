'use client'

import { useState } from 'react'
import { Editor } from '@tiptap/react'
import { HeadingControl } from './toolbar/HeadingControl'
import { FontSizeControl } from './toolbar/FontSizeControl'
import { ColorControl } from './toolbar/ColorControl'
import { AlignmentControl } from './toolbar/AlignmentControl'

interface ToolbarProps {
  editor: Editor | null
  onSave: () => void
  onYoutubeEmbed: (url: string) => void
}

function Divider() {
  return <div className="w-px h-6 bg-gray-200 mx-1" />
}

export function Toolbar({ editor, onSave, onYoutubeEmbed }: ToolbarProps) {
  const [youtubeInput, setYoutubeInput] = useState('')
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)

  if (!editor) return null

  const handleYoutubeSubmit = () => {
    if (youtubeInput.trim()) {
      onYoutubeEmbed(youtubeInput.trim())
      setYoutubeInput('')
      setShowYoutubeInput(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
      {/* Heading */}
      <HeadingControl editor={editor} />
      <Divider />

      {/* Font size */}
      <FontSizeControl editor={editor} />
      <Divider />

      {/* Text color */}
      <ColorControl editor={editor} />
      <Divider />

      {/* Bold / Italic / Underline / Strike */}
      <button
        className={`toolbar-btn font-bold${editor.isActive('bold') ? ' is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        B
      </button>
      <button
        className={`toolbar-btn italic${editor.isActive('italic') ? ' is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        I
      </button>
      <button
        className={`toolbar-btn underline${editor.isActive('underline') ? ' is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        U
      </button>
      <button
        className={`toolbar-btn line-through${editor.isActive('strike') ? ' is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        S
      </button>
      <Divider />

      {/* Text alignment */}
      <AlignmentControl editor={editor} />
      <Divider />

      {/* Lists */}
      <button
        className={`toolbar-btn${editor.isActive('bulletList') ? ' is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        • List
      </button>
      <button
        className={`toolbar-btn${editor.isActive('orderedList') ? ' is-active' : ''}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered list"
      >
        1. List
      </button>
      <Divider />

      {/* Undo / Redo */}
      <button
        className="toolbar-btn"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Undo"
      >
        ↩
      </button>
      <button
        className="toolbar-btn"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Redo"
      >
        ↪
      </button>
      <Divider />

      {/* YouTube embed */}
      {showYoutubeInput ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleYoutubeSubmit()
              if (e.key === 'Escape') setShowYoutubeInput(false)
            }}
            placeholder="YouTube URL..."
            className="text-sm border border-gray-300 rounded px-2 py-1 w-48 focus:outline-none focus:border-blue-400"
            autoFocus
          />
          <button
            className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            onClick={handleYoutubeSubmit}
          >
            Embed
          </button>
          <button
            className="text-sm text-gray-500 px-1 hover:text-gray-700"
            onClick={() => setShowYoutubeInput(false)}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          className="toolbar-btn"
          onClick={() => setShowYoutubeInput(true)}
          title="Embed YouTube video"
        >
          ▶ YouTube
        </button>
      )}

      {/* Save button — right aligned */}
      <div className="ml-auto">
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}
