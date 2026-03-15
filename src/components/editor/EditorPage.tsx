'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Toolbar } from './Toolbar'
import { Editor } from './Editor'
import { SaveModal } from './SaveModal'
import { fileToBase64 } from '@/lib/imageToBase64'
import { FormatState, defaultFormatState } from './types'

const YOUTUBE_REGEX =
  /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/

function rgbToHex(rgb: string): string {
  if (!rgb) return '#000000'
  const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  if (!match) return rgb.startsWith('#') ? rgb : '#000000'
  return (
    '#' +
    [match[1], match[2], match[3]]
      .map((n) => parseInt(n).toString(16).padStart(2, '0'))
      .join('')
  )
}

export function EditorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedHtml, setSavedHtml] = useState('')
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const [formatState, setFormatState] = useState<FormatState>(defaultFormatState)

  const updateFormatState = useCallback(() => {
    try {
      const rawHeading = document.queryCommandValue('formatBlock').toLowerCase()
      const heading = ['h1', 'h2', 'h3'].includes(rawHeading) ? rawHeading : 'p'
      const rawColor = document.queryCommandValue('foreColor')
      setFormatState({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        strikeThrough: document.queryCommandState('strikeThrough'),
        heading,
        alignLeft: document.queryCommandState('justifyLeft'),
        alignCenter: document.queryCommandState('justifyCenter'),
        alignRight: document.queryCommandState('justifyRight'),
        alignJustify: document.queryCommandState('justifyFull'),
        color: rawColor ? rgbToHex(rawColor) : '#000000',
      })
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const range = sel.getRangeAt(0)
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange()
        updateFormatState()
      }
    }
    document.addEventListener('selectionchange', handler)
    return () => document.removeEventListener('selectionchange', handler)
  }, [updateFormatState])

  const restoreSelection = useCallback(() => {
    editorRef.current?.focus()
    if (savedRangeRef.current) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(savedRangeRef.current.cloneRange())
    }
  }, [])

  const execCommand = useCallback(
    (command: string, value?: string) => {
      restoreSelection()
      document.execCommand(command, false, value ?? undefined)
      updateFormatState()
    },
    [restoreSelection, updateFormatState]
  )

  const applyFontSize = useCallback(
    (size: string) => {
      restoreSelection()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const range = sel.getRangeAt(0)
      if (range.collapsed) return
      const fragment = range.cloneContents()
      const tmp = document.createElement('div')
      tmp.appendChild(fragment)
      document.execCommand(
        'insertHTML',
        false,
        `<span style="font-size:${size}">${tmp.innerHTML}</span>`
      )
      updateFormatState()
    },
    [restoreSelection, updateFormatState]
  )

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (files.length === 0) return
    e.preventDefault()
    for (const file of files) {
      const src = await fileToBase64(file)
      editorRef.current?.focus()
      document.execCommand(
        'insertHTML',
        false,
        `<img src="${src}" style="max-width:100%;border-radius:6px">`
      )
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.types).includes('Files')) e.preventDefault()
  }, [])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text/plain')
    const match = text.match(YOUTUBE_REGEX)
    if (match) {
      e.preventDefault()
      const videoId = match[1]
      document.execCommand(
        'insertHTML',
        false,
        `<div style="margin:12px 0"><iframe width="640" height="480" ` +
          `src="https://www.youtube-nocookie.com/embed/${videoId}" frameborder="0" ` +
          `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
          `allowfullscreen style="max-width:100%;border-radius:8px"></iframe></div>`
      )
    }
  }, [])

  const handleYoutubeEmbed = useCallback(
    (url: string) => {
      const match = url.match(YOUTUBE_REGEX)
      if (!match) return
      const videoId = match[1]
      restoreSelection()
      document.execCommand(
        'insertHTML',
        false,
        `<div style="margin:12px 0"><iframe width="640" height="480" ` +
          `src="https://www.youtube-nocookie.com/embed/${videoId}" frameborder="0" ` +
          `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
          `allowfullscreen style="max-width:100%;border-radius:8px"></iframe></div>`
      )
      editorRef.current?.focus()
    },
    [restoreSelection]
  )

  const handleSave = () => {
    if (!editorRef.current) return
    setSavedHtml(editorRef.current.innerHTML)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">문서 편집기</h1>
          <p className="text-sm text-slate-400 mt-0.5">이미지를 드래그하거나 YouTube URL을 붙여넣어 삽입하세요</p>
        </div>
      </div>

      {/* Editor card */}
      <div className="max-w-4xl mx-auto rounded-xl bg-white shadow-[0_1px_3px_0_rgb(0,0,0,0.06),0_4px_12px_0_rgb(0,0,0,0.04)] overflow-hidden ring-1 ring-slate-900/5">
        <Toolbar
          formatState={formatState}
          execCommand={execCommand}
          applyFontSize={applyFontSize}
          onSave={handleSave}
          onYoutubeEmbed={handleYoutubeEmbed}
        />
        <Editor
          editorRef={editorRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onPaste={handlePaste}
        />
      </div>

      <SaveModal
        isOpen={isModalOpen}
        html={savedHtml}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
