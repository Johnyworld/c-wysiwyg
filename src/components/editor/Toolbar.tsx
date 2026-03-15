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

function Sep() {
  return <div className="w-px h-5 bg-slate-200 mx-1 shrink-0" />
}

function Btn({
  active,
  title,
  onMouseDown,
  children,
}: {
  active?: boolean
  title: string
  onMouseDown: (e: React.MouseEvent) => void
  children: React.ReactNode
}) {
  return (
    <button
      className={`toolbar-btn${active ? ' is-active' : ''}`}
      onMouseDown={onMouseDown}
      title={title}
      type="button"
    >
      {children}
    </button>
  )
}

// ── SVG icons ────────────────────────────────────────────────
const Icons = {
  Bold: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" /><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    </svg>
  ),
  Italic: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  ),
  Underline: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3v7a6 6 0 0 0 12 0V3" /><line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  ),
  Strike: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  ),
  Undo: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
    </svg>
  ),
  Redo: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
    </svg>
  ),
  BulletList: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  OrderedList: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
      <path d="M4 6h1v4" strokeWidth="2" /><path d="M4 10h2" strokeWidth="2" />
      <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeWidth="2" />
    </svg>
  ),
  YouTube: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
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

  const md = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    fn()
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#FAFAFA] border-b border-slate-200 min-h-11.5">
      {/* Heading */}
      <HeadingControl
        value={formatState.heading}
        onChange={(val) => execCommand('formatBlock', val)}
      />
      <Sep />

      {/* Font size */}
      <FontSizeControl onApply={applyFontSize} />
      <Sep />

      {/* Text color */}
      <ColorControl color={formatState.color} onApply={(c) => execCommand('foreColor', c)} />
      <Sep />

      {/* Bold / Italic / Underline / Strike */}
      <Btn active={formatState.bold} title="굵게 (Ctrl+B)" onMouseDown={md(() => execCommand('bold'))}>
        <Icons.Bold />
      </Btn>
      <Btn active={formatState.italic} title="기울임 (Ctrl+I)" onMouseDown={md(() => execCommand('italic'))}>
        <Icons.Italic />
      </Btn>
      <Btn active={formatState.underline} title="밑줄 (Ctrl+U)" onMouseDown={md(() => execCommand('underline'))}>
        <Icons.Underline />
      </Btn>
      <Btn active={formatState.strikeThrough} title="취소선" onMouseDown={md(() => execCommand('strikeThrough'))}>
        <Icons.Strike />
      </Btn>
      <Sep />

      {/* Alignment */}
      <AlignmentControl formatState={formatState} execCommand={execCommand} />
      <Sep />

      {/* Lists */}
      <Btn title="글머리 기호" onMouseDown={md(() => execCommand('insertUnorderedList'))}>
        <Icons.BulletList />
      </Btn>
      <Btn title="번호 매기기" onMouseDown={md(() => execCommand('insertOrderedList'))}>
        <Icons.OrderedList />
      </Btn>
      <Sep />

      {/* Undo / Redo */}
      <Btn title="실행 취소 (Ctrl+Z)" onMouseDown={md(() => execCommand('undo'))}>
        <Icons.Undo />
      </Btn>
      <Btn title="다시 실행 (Ctrl+Y)" onMouseDown={md(() => execCommand('redo'))}>
        <Icons.Redo />
      </Btn>
      <Sep />

      {/* YouTube embed */}
      {showYoutubeInput ? (
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={youtubeInput}
            onChange={(e) => setYoutubeInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleYoutubeSubmit()
              if (e.key === 'Escape') setShowYoutubeInput(false)
            }}
            placeholder="YouTube URL 입력..."
            className="text-xs border border-slate-200 rounded-md px-2.5 h-7.5 w-52 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
            autoFocus
          />
          <button
            type="button"
            className="h-7.5 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-md font-medium transition-colors"
            onMouseDown={md(handleYoutubeSubmit)}
          >
            Embed
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onMouseDown={md(() => setShowYoutubeInput(false))}
            title="닫기"
          >
            <Icons.Close />
          </button>
        </div>
      ) : (
        <Btn title="YouTube 영상 삽입" onMouseDown={md(() => setShowYoutubeInput(true))}>
          <Icons.YouTube />
        </Btn>
      )}

      {/* Save — right aligned */}
      <div className="ml-auto pl-2">
        <button
          type="button"
          onClick={onSave}
          className="h-7.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 rounded-md transition-colors shadow-sm"
        >
          저장
        </button>
      </div>
    </div>
  )
}
