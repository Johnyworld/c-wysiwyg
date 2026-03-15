'use client'

import { FormatState } from '../types'

interface Props {
  formatState: FormatState
  execCommand: (command: string) => void
}

const ALIGNMENTS: { cmd: string; title: string; key: keyof FormatState; icon: React.ReactNode }[] = [
  {
    cmd: 'justifyLeft', title: '왼쪽 정렬', key: 'alignLeft',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" />
      </svg>
    ),
  },
  {
    cmd: 'justifyCenter', title: '가운데 정렬', key: 'alignCenter',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
      </svg>
    ),
  },
  {
    cmd: 'justifyRight', title: '오른쪽 정렬', key: 'alignRight',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="9" y1="12" x2="21" y2="12" /><line x1="6" y1="18" x2="21" y2="18" />
      </svg>
    ),
  },
  {
    cmd: 'justifyFull', title: '양끝 맞춤', key: 'alignJustify',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
  },
]

export function AlignmentControl({ formatState, execCommand }: Props) {
  return (
    <>
      {ALIGNMENTS.map(({ cmd, icon, title, key }) => (
        <button
          key={cmd}
          type="button"
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
