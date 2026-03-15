export interface FormatState {
  bold: boolean
  italic: boolean
  underline: boolean
  strikeThrough: boolean
  heading: string // 'p' | 'h1' | 'h2' | 'h3'
  alignLeft: boolean
  alignCenter: boolean
  alignRight: boolean
  alignJustify: boolean
  color: string // hex color
}

export const defaultFormatState: FormatState = {
  bold: false,
  italic: false,
  underline: false,
  strikeThrough: false,
  heading: 'p',
  alignLeft: false,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
  color: '#000000',
}
