'use client'

interface Props {
  onApply: (size: string) => void
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '24px', '32px', '48px']

export function FontSizeControl({ onApply }: Props) {
  return (
    <select
      defaultValue=""
      onChange={(e) => {
        const val = e.target.value
        if (val) {
          onApply(val)
          e.target.value = ''
        }
      }}
      className="toolbar-select w-20"
      title="글자 크기"
    >
      <option value="" disabled>크기</option>
      {FONT_SIZES.map((size) => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
  )
}
