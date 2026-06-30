import type { Metadata } from 'next'
import { BOOKS, getBook } from '@/lib/data'
import NotebookClient from './NotebookClient'

export async function generateMetadata(
  { params }: { params: Promise<{ book: string; chapter: string }> }
): Promise<Metadata> {
  const { book: bookId, chapter } = await params
  const book = getBook(bookId)
  const bookName = book?.name ?? bookId
  const ch = parseInt(chapter) || 1
  return {
    title: `${bookName} ${ch}`,
    description: `Study ${bookName} chapter ${ch} using the Earl Palmer three lines method. Observe what happens, how people respond, and write your own reflection.`,
  }
}

export default async function NotebookPage(
  { params }: { params: Promise<{ book: string; chapter: string }> }
) {
  const { book: bookId } = await params
  // Resolve the active book server-side and hand only its data to the client.
  // The full BOOKS dataset stays on the server.
  const book = getBook(bookId) ?? BOOKS.find(b => b.id === 'john') ?? BOOKS[0]
  return <NotebookClient book={book} />
}
