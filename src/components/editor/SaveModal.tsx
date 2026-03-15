'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface SaveModalProps {
  isOpen: boolean
  html: string
  onClose: () => void
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function SaveModal({ isOpen, html, onClose }: SaveModalProps) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      textareaRef.current?.select()
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      document.execCommand('copy')
    }
  }

  if (!mounted || !isOpen) return null

  const charCount = html.length.toLocaleString()
  const lineCount = (html.match(/\n/g)?.length ?? 0) + 1

  return createPortal(
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-panel bg-white rounded-2xl shadow-[0_8px_32px_0_rgb(0,0,0,0.16),0_2px_8px_0_rgb(0,0,0,0.08)] w-full max-w-2xl flex flex-col max-h-[82vh] ring-1 ring-slate-900/8">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">HTML 출력</h2>
              <p className="text-xs text-slate-400 mt-0.5">{charCount}자 · {lineCount}줄</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Code area */}
        <div className="flex-1 overflow-hidden p-4">
          <textarea
            ref={textareaRef}
            readOnly
            value={html}
            spellCheck={false}
            className="w-full h-full min-h-52 max-h-96 text-[12px] leading-relaxed font-mono bg-slate-950 text-slate-300 rounded-xl p-4 resize-none focus:outline-none overflow-auto selection:bg-blue-500/30"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
          <p className="text-xs text-slate-400">Esc로 닫기</p>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 h-8 rounded-lg transition-colors shadow-sm"
            >
              {copied ? <><CheckIcon />복사됨</> : <><CopyIcon />복사</>}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white px-4 h-8 rounded-lg transition-colors shadow-sm"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
