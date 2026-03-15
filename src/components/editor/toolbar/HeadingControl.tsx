'use client'

interface Props {
  value: string
  onChange: (val: string) => void
}

export function HeadingControl({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="toolbar-select w-28"
      title="단락 스타일"
    >
      <option value="p">Paragraph</option>
      <option value="h1">Heading 1</option>
      <option value="h2">Heading 2</option>
      <option value="h3">Heading 3</option>
    </select>
  )
}
