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
      // ignore — queryCommand can throw in some edge cases
    }
  }, [])

  // Track selection changes; only save when inside the editor
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

  // Restore last saved selection and focus editor
  const restoreSelection = useCallback(() => {
    editorRef.current?.focus()
    if (savedRangeRef.current) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(savedRangeRef.current.cloneRange())
    }
  }, [])

  // Execute a document command (restores selection first)
  const execCommand = useCallback(
    (command: string, value?: string) => {
      restoreSelection()
      document.execCommand(command, false, value ?? undefined)
      updateFormatState()
    },
    [restoreSelection, updateFormatState]
  )

  // Apply font size by wrapping selection in a span (execCommand fontSize only supports 1-7)
  const applyFontSize = useCallback(
    (size: string) => {
      restoreSelection()
      const sel = window.getSelection()
      if (!sel || sel.rangeCount === 0) return
      const range = sel.getRangeAt(0)
      if (range.collapsed) return

      // Clone selected content to preserve inline HTML (bold, italic, etc.)
      const fragment = range.cloneContents()
      const tmp = document.createElement('div')
      tmp.appendChild(fragment)
      const selectedHTML = tmp.innerHTML

      document.execCommand(
        'insertHTML',
        false,
        `<span style="font-size:${size}">${selectedHTML}</span>`
      )
      updateFormatState()
    },
    [restoreSelection, updateFormatState]
  )

  // Image drag-and-drop
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
        `<img src="${src}" style="max-width:100%">`
      )
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (Array.from(e.dataTransfer.types).includes('Files')) e.preventDefault()
  }, [])

  // YouTube URL paste detection
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text/plain')
    const match = text.match(YOUTUBE_REGEX)
    if (match) {
      e.preventDefault()
      const videoId = match[1]
      document.execCommand(
        'insertHTML',
        false,
        `<div style="margin:8px 0"><iframe width="640" height="480" ` +
          `src="https://www.youtube-nocookie.com/embed/${videoId}" frameborder="0" ` +
          `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
          `allowfullscreen style="max-width:100%"></iframe></div>`
      )
    }
  }, [])

  // YouTube embed from toolbar URL input
  const handleYoutubeEmbed = useCallback(
    (url: string) => {
      const match = url.match(YOUTUBE_REGEX)
      if (!match) return
      const videoId = match[1]
      restoreSelection()
      document.execCommand(
        'insertHTML',
        false,
        `<div style="margin:8px 0"><iframe width="640" height="480" ` +
          `src="https://www.youtube-nocookie.com/embed/${videoId}" frameborder="0" ` +
          `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
          `allowfullscreen style="max-width:100%"></iframe></div>`
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">WYSIWYG Editor</h1>
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
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
      </div>
      <SaveModal
        isOpen={isModalOpen}
        html={savedHtml}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
