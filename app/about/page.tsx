import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: "The story behind Three Lines — a Scripture study tool drawing on Earl Palmer's three-line method and Bart Ehrman's analytical lenses.",
}

export default function AboutPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-8">About</h1>

      <div className="space-y-5 text-base text-gray-600 dark:text-gray-400 leading-relaxed">

        <p>
          Three Lines is a tool for studying Scripture across several lines of inquiry: what happens in a
          passage, how those in the scene respond, your own commentary, and the historical, literary,
          comparative context around it, and more. It grew out of a conviction about how narratives get framed by whoever is speaking.
        </p>

        <p>
          I believe that any sequence of events can be retold by a new storyteller to
          instill in a listener an entirely different impression than what the
          original storyteller intended, even when both storytellers&apos; accounts contain
          only truthful statements. Each narrator, shaped by their own peculiarities,
          experiences, dispositions, and intentions, will selectively include or exclude
          certain details, choose words that yield particular connotations, organize
          events to emphasize certain themes over others, draw connections that another
          might not even see. This is not to say that there is no such thing as objective
          truth; but rather it is to insist that truth is always <em>narrated</em>, and
          that <em>how</em> it is narrated can vary widely based on <em>who</em> is doing
          the narration.
        </p>

        <p>
          Built upon that conviction, Three Lines examines more than the
          narration itself. The name is drawn from <a href="https://en.wikipedia.org/wiki/Earl_Palmer" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">Rev. Dr. Earl Palmer</a>,
          who proposed the note-taking method of tracking a passage along three lines
          of inquiry: what happens, how those in the scene respond, and one&apos;s own personal
          commentary on it. Additional layers come from <a href="https://en.wikipedia.org/wiki/Bart_D._Ehrman" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">Bart Ehrman</a>&apos;s textbook, <em>The New Testament: A Historical Introduction to the Early Christian Writings</em>,
          which proposes approaching Scripture through three analytical lenses: historical,
          literary, and comparative (as well as sub-lenses that include socio-historical
          analysis, redaction criticism, genre identification, and thematic examination).
          This website collects these lenses into a tool to help us examine not
          just <em>what</em> the text says, but also <em>when</em>, <em>why</em>, <em>by whom</em>, <em>how</em>, and <em>alongside what else</em>.
        </p>

        <p>
          These lines are tools to give you more ways to scrutinize a
          passage and not to push you toward any one conclusion. Use them in accompaniment to whatever tradition you bring to your reading.
        </p>

        <p>
          I thank Don for hosting the &quot;John&apos;s Gospel: The Unauthorized Version&quot; study group
          that introduced me to Palmer&apos;s three lines method, and to Prof. Mark Wallace for
          introducing me to the Ehrman textbook.
        </p>

        <p>
          Built by <a href="https://github.com/itang1" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">itang1</a>.
        </p>

      </div>
    </div>
  )
}
