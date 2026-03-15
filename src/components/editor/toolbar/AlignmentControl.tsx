'use client'

import { FormatState } from '../types'

interface Props {
  formatState: FormatState
  execCommand: (command: string) => void
}

const ALIGNMENTS = [
  { cmd: 'justifyLeft', icon: '⇤', title: 'Align left', key: 'alignLeft' as keyof FormatState },
  { cmd: 'justifyCenter', icon: '↔', title: 'Align center', key: 'alignCenter' as keyof FormatState },
  { cmd: 'justifyRight', icon: '⇥', title: 'Align right', key: 'alignRight' as keyof FormatState },
  { cmd: 'justifyFull', icon: '⇔', title: 'Justify', key: 'alignJustify' as keyof FormatState },
]

export function AlignmentControl({ formatState, execCommand }: Props) {
  return (
    <>
      {ALIGNMENTS.map(({ cmd, icon, title, key }) => (
        <button
          key={cmd}
          className={`toolbar-btn${formatState[key] ? ' is-active' : ''}`}
          onMouseDown={(e) => {
            e.preventDefault()
            execCommand(cmd)
          }}
          title={title}
        >
          {icon}
        </button>
      ))}
    </>
  )
}
