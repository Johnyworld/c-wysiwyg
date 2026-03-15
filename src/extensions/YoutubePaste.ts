import { Extension } from '@tiptap/core'
import { Plugin } from '@tiptap/pm/state'

const YOUTUBE_REGEX =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/

export const YoutubePaste = Extension.create({
  name: 'youtubePaste',

  addProseMirrorPlugins() {
    const editor = this.editor
    return [
      new Plugin({
        props: {
          handlePaste(_view, event) {
            const text = event.clipboardData?.getData('text/plain') ?? ''
            if (YOUTUBE_REGEX.test(text)) {
              editor.commands.setYoutubeVideo({ src: text, width: 640, height: 480 })
              return true
            }
            return false
          },
        },
      }),
    ]
  },
})
