'use client'

import { useState } from 'react'
import { FormatState } from './types'
import { HeadingControl } from './toolbar/HeadingControl'
import { FontSizeControl } from './toolbar/FontSizeControl'
import { ColorControl } from './toolbar/ColorControl'
import { AlignmentControl } from './toolbar/AlignmentControl'

export interface ToolbarProps {
  formatState: FormatState
  execCommand: (command: string, value?: string) => void
  applyFontSize: (size: string) => void
  onSave: () => void
  onYoutubeEmbed: (url: string) => void
}

function Divider() {
  return <div className="w-px h-6 bg-gray-200 mx-1" />
}

export function Toolbar({
  formatState,
  execCommand,
  applyFontSize,
  onSave,
  onYoutubeEmbed,
}: ToolbarProps) {
  const [youtubeInput, setYoutubeInput] = useState('')
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)

  const handleYoutubeSubmit = () => {
    if (youtubeInput.trim()) {
      onYoutubeEmbed(youtubeInput.trim())
      setYoutubeInput('')
      setShowYoutubeInput(false)
    }
  }

  // Prevent editor losing focus when clicking toolbar buttons
  const md = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    fn()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
      {/* Heading */}
      <HeadingControl
        value={formatState.heading}
        onChange={(val) => execCommand('formatBlock', val)}
      />
      <Divider />

      {/* Font size */}
      <FontSizeControl onApply={applyFontSize} />
      <Divider />

      {/* Text color */}
      <ColorControl color={formatState.color} onApply={(c) => execCommand('foreColor', c)} />
      <Divider />

      {/* Bold / Italic / Underline / Strike */}
      <button
        className={`toolbar-btn font-bold${formatState.bold ? ' is-active' : ''}`}
        onMouseDown={md(() => execCommand('bold'))}
        title="Bold"
      >
        B
      </button>
      <button
        className={`toolbar-btn italic${formatState.italic ? ' is-active' : ''}`}
        onMouseDown={md(() => execCommand('italic'))}
        title="Italic"
      >
        I
      </button>
      <button
        className={`toolbar-btn underline${formatState.underline ? ' is-active' : ''}`}
        onMouseDown={md(() => execCommand('underline'))}
        title="Underline"
      >
        U
      </button>
      <button
        className={`toolbar-btn line-through${formatState.strikeThrough ? ' is-active' : ''}`}
        onMouseDown={md(() => execCommand('strikeThrough'))}
        title="Strikethrough"
      >
        S
      </button>
      <Divider />

      {/* Text alignment */}
      <AlignmentControl formatState={formatState} execCommand={execCommand} />
      <Divider />

      {/* Lists */}
      <button
        className="toolbar-btn"
        onMouseDown={md(() => execCommand('insertUnorderedList'))}
        title="Bullet list"
      >
        • List
      </button>
      <button
        className="toolbar-btn"
        onMouseDown={md(() => execCommand('insertOrderedList'))}
        title="Ordered list"
      >
        1. List
      </button>
      <Divider />

      {/* Undo / Redo */}
      <button
        className="toolbar-btn"
        onMouseDown={md(() => execCommand('undo'))}
        title="Undo"
      >
        ↩
      </button>
      <button
        className="toolbar-btn"
        onMouseDown={md(() => execCommand('redo'))}
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
            onMouseDown={md(handleYoutubeSubmit)}
          >
            Embed
          </button>
          <button
            className="text-sm text-gray-500 px-1 hover:text-gray-700"
            onMouseDown={md(() => setShowYoutubeInput(false))}
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          className="toolbar-btn"
          onMouseDown={md(() => setShowYoutubeInput(true))}
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
