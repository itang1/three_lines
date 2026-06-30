import type { Metadata } from 'next'
import { BOOKS } from '@/lib/data'
import NotebookClient from './NotebookClient'

export async function generateMetadata(
  { params }: { params: Promise<{ book: string; chapter: string }> }
): Promise<Metadata> {
  const { book: bookId, chapter } = await params
  const book = BOOKS.find(b => b.id === bookId)
  const bookName = book?.name ?? bookId
  const ch = parseInt(chapter) || 1
  return {
    title: `${bookName} ${ch}`,
    description: `Study ${bookName} chapter ${ch} using the Earl Palmer three lines method. Observe what happens, how people respond, and write your own reflection.`,
  }
}

export default function NotebookPage() {
  return <NotebookClient />
}
