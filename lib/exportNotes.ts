import { TRACKS, getBookMeta } from '@/lib/books-index'

export type NoteRow = { passage_ref: string; track_id: string; content: string }

function passageLabel(passage_ref: string): string {
  const parts = passage_ref.split(':')
  const book = getBookMeta(parts[0])
  return `${book?.name ?? parts[0]} ${parts[1]}:${parts.slice(2).join(':')}`
}

function trackLabel(track_id: string): string {
  return TRACKS.find(t => t.id === track_id)?.label ?? track_id
}

export function buildPlainText(title: string, notes: NoteRow[]): string {
  const lines: string[] = [title, `Exported ${new Date().toLocaleDateString()}`, '']
  let lastRef = ''
  for (const note of notes) {
    if (note.passage_ref !== lastRef) {
      if (lastRef) lines.push('')
      lines.push(`--- ${passageLabel(note.passage_ref)} ---`)
      lastRef = note.passage_ref
    }
    lines.push(`[${trackLabel(note.track_id)}]`)
    lines.push(note.content)
  }
  return lines.join('\n')
}

export function buildMarkdown(title: string, notes: NoteRow[]): string {
  const lines: string[] = [`# ${title}`, `*Exported ${new Date().toLocaleDateString()}*`, '']
  let lastRef = ''
  for (const note of notes) {
    if (note.passage_ref !== lastRef) {
      if (lastRef) lines.push('')
      lines.push(`## ${passageLabel(note.passage_ref)}`, '')
      lastRef = note.passage_ref
    }
    lines.push(`**${trackLabel(note.track_id)}**`)
    lines.push(note.content, '')
  }
  return lines.join('\n')
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
