/**
 * Cache warming script for non-ESV translations (KJV, NIV, CEV).
 * ESV is intentionally excluded — Crossway's terms prohibit local storage.
 *
 * Usage:
 *   npm run warm                                  # hits http://localhost:3000
 *   npm run warm -- --base-url=https://example.com
 *   BASE_URL=https://example.com npm run warm
 */

import { BOOKS } from '../lib/data'

const TRANSLATIONS = ['KJV', 'NIV', 'CEV']
const DELAY_MS = 250

const BASE_URL =
  process.argv.find(a => a.startsWith('--base-url='))?.split('=')[1] ??
  process.env.BASE_URL ??
  'http://localhost:3000'

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  type Job = { bookId: string; ch: number; esvRef: string; translation: string }
  const jobs: Job[] = []

  for (const book of BOOKS) {
    for (const chapter of book.chapters) {
      for (const chunk of chapter.chunks) {
        for (const t of TRANSLATIONS) {
          jobs.push({ bookId: book.id, ch: chapter.ch, esvRef: chunk.esvRef, translation: t })
        }
      }
    }
  }

  const total = jobs.length
  let fetched = 0, alreadyCached = 0, errors = 0

  console.log(`Warming ${total} passages (${BOOKS.length} books × ${TRANSLATIONS.join('/')})\nBase URL: ${BASE_URL}\n`)

  for (let i = 0; i < jobs.length; i++) {
    const { bookId, ch, esvRef, translation } = jobs[i]
    const url = `${BASE_URL}/api/passage?book=${bookId}&chapter=${ch}&ref=${encodeURIComponent(esvRef)}&translation=${translation}&vn=false`

    process.stdout.write(`[${i + 1}/${total}] ${translation.padEnd(3)} ${esvRef.padEnd(20)} `)

    try {
      const res = await fetch(url)
      const data = await res.json() as { text?: string; cached?: boolean; error?: string }
      if (!res.ok || data.error) {
        process.stdout.write(`ERROR: ${data.error ?? res.status}\n`)
        errors++
      } else if (data.cached) {
        process.stdout.write(`cached\n`)
        alreadyCached++
      } else {
        process.stdout.write(`fetched\n`)
        fetched++
      }
    } catch (err) {
      process.stdout.write(`FAILED (${err})\n`)
      errors++
    }

    if (i < jobs.length - 1) await sleep(DELAY_MS)
  }

  console.log(`\nDone. ${fetched} fetched fresh, ${alreadyCached} already cached, ${errors} errors.`)
  if (errors > 0) process.exit(1)
}

main()
