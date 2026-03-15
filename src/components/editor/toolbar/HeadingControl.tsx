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
      className="text-sm border border-gray-200 rounded px-2 py-1 bg-white cursor-pointer"
      title="Heading"
    >
      <option value="p">Paragraph</option>
      <option value="h1">H1</option>
      <option value="h2">H2</option>
      <option value="h3">H3</option>
    </select>
  )
}
