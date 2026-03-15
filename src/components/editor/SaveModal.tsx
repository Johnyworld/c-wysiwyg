'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface SaveModalProps {
  isOpen: boolean
  html: string
  onClose: () => void
}

export function SaveModal({ isOpen, html, onClose }: SaveModalProps) {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mount guard for SSR (createPortal needs document.body)
  useEffect(() => {
    setMounted(true)
  }, [])

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
      document.execCommand('copy')
    }
  }

  if (!mounted || !isOpen) return null

  const charCount = html.length.toLocaleString()

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Saved HTML</h2>
            <p className="text-xs text-gray-400 mt-0.5">{charCount} characters</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* HTML content */}
        <div className="flex-1 overflow-hidden p-4">
          <textarea
            ref={textareaRef}
            readOnly
            value={html}
            className="w-full h-full min-h-48 max-h-96 text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-blue-300 overflow-auto"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button
            onClick={handleCopy}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          <button
            onClick={onClose}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
