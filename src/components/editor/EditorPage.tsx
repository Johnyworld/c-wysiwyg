'use client'

import { useState, useCallback } from 'react'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle, Color, FontSize } from '@tiptap/extension-text-style'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { YoutubePaste } from '@/extensions/YoutubePaste'
import { fileToBase64 } from '@/lib/imageToBase64'
import { Toolbar } from './Toolbar'
import { Editor } from './Editor'
import { SaveModal } from './SaveModal'

export function EditorPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedHtml, setSavedHtml] = useState('')

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ allowBase64: true, inline: false }),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: async (currentEditor, files, pos) => {
          for (const file of files) {
            const src = await fileToBase64(file)
            currentEditor
              .chain()
              .insertContentAt(pos, { type: 'image', attrs: { src } })
              .focus()
              .run()
          }
        },
        onPaste: async (currentEditor, files) => {
          for (const file of files) {
            const src = await fileToBase64(file)
            currentEditor
              .chain()
              .insertContent({ type: 'image', attrs: { src } })
              .focus()
              .run()
          }
        },
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        nocookie: true,
        modestBranding: true,
      }),
      YoutubePaste,
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose focus:outline-none min-h-96 p-4 max-w-none',
      },
    },
  })

  const handleYoutubeEmbed = useCallback(
    (url: string) => {
      if (!editor) return
      editor.commands.setYoutubeVideo({ src: url, width: 640, height: 480 })
      editor.commands.focus()
    },
    [editor]
  )

  const handleSave = () => {
    if (!editor) return
    setSavedHtml(editor.getHTML())
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">WYSIWYG Editor</h1>
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <Toolbar
            editor={editor}
            onSave={handleSave}
            onYoutubeEmbed={handleYoutubeEmbed}
          />
          <Editor editor={editor} />
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
