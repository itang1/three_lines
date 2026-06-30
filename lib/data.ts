export type Chunk = { ref: string; esvRef: string; pericope: string }
export type Chapter = { ch: number; chunks: Chunk[] }
export type Book = { id: string; name: string; testament: 'OT' | 'NT'; chapters: Chapter[] }

export const TRACKS = [
  {
    id: 'event',
    label: 'What happens',
    dot: '#378ADD',
    placeholder: 'Record the scene objectively without interpretation.',
    description: "Observe the scene without interpreting it. What occurs? Who is present? What is said or done?",
  },
  {
    id: 'reactions',
    label: 'How people respond',
    dot: '#1D9E75',
    placeholder: 'How do the characters in the scene respond to what happens?',
    description: "How do the characters respond to what happens? Look for faith, confusion, hostility, wonder, silence, evasion.",
  },
  {
    id: 'thoughts',
    label: 'My thoughts',
    dot: '#534AB7',
    placeholder: 'Your personal response to the passage.',
    description: "Your personal response to the passage. Questions, observations, connections, things that surprise or trouble you, ideas you want to return to.",
  },
  {
    id: 'historical',
    label: 'Historical context',
    dot: '#D85A30',
    placeholder: 'What do we know about the time, place, author, or audience?',
    description: "The world behind the text. What were the historical circumstances, political climate, or authorial background that shaped this passage? What was the original audience likely to have understood or assumed? Why it was written, for whom, and under what conditions.",
  },
  {
    id: 'literary',
    label: 'Literary observation',
    dot: '#BA7517',
    placeholder: 'What kind of writing is this? Note tone, structure, imagery, genre.',
    description: "The world within the text. What type of writing is this: narrative, poetry, letter, parable, apocalypse? How does the author use structure, repetition, imagery, or tone to shape meaning? What literary patterns or themes emerge?",
  },
  {
    id: 'comparative',
    label: 'Connections to other texts',
    dot: '#993556',
    placeholder: 'How does this compare to other texts, versions, or traditions?',
    description: "The world around the text. How does this passage compare to parallel accounts in other Gospels, earlier Scripture, or contemporary texts from the same era? Are there signs of editing or reshaping from an earlier source? What cross-cultural motifs appear?",
  },
]

// Books with pericope-level chunks use inline chapter arrays.
// All other books use buildChapters() — one chunk per chapter, whole-chapter ESV ref.
// Psalms uses "Psalm N" (singular) as required by the ESV API.

function buildChapters(name: string, count: number): Chapter[] {
  const esvName = name === 'Psalms' ? 'Psalm' : name
  return Array.from({ length: count }, (_, i) => ({
    ch: i + 1,
    chunks: [{ ref: String(i + 1), esvRef: `${esvName} ${i + 1}`, pericope: '' }],
  }))
}

export const BOOKS: Book[] = [

  // ── Old Testament ──────────────────────────────────────────────────────────

  {
    id: 'genesis',
    name: 'Genesis',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-2', esvRef: 'Genesis 1:1-2', pericope: 'In the Beginning' },
        { ref: '1:3-13', esvRef: 'Genesis 1:3-13', pericope: 'Days One Through Three' },
        { ref: '1:14-25', esvRef: 'Genesis 1:14-25', pericope: 'Days Four Through Six' },
        { ref: '1:26-31', esvRef: 'Genesis 1:26-31', pericope: "Humanity in God's Image" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-3', esvRef: 'Genesis 2:1-3', pericope: 'The Seventh Day' },
        { ref: '2:4-17', esvRef: 'Genesis 2:4-17', pericope: 'The Garden of Eden' },
        { ref: '2:18-25', esvRef: 'Genesis 2:18-25', pericope: 'The First Woman' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-7', esvRef: 'Genesis 3:1-7', pericope: 'The Fall' },
        { ref: '3:8-13', esvRef: 'Genesis 3:8-13', pericope: 'Where Are You?' },
        { ref: '3:14-19', esvRef: 'Genesis 3:14-19', pericope: 'The Curse' },
        { ref: '3:20-24', esvRef: 'Genesis 3:20-24', pericope: 'Banished from the Garden' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-16', esvRef: 'Genesis 4:1-16', pericope: 'Cain and Abel' },
        { ref: '4:17-26', esvRef: 'Genesis 4:17-26', pericope: 'The Line of Cain' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-32', esvRef: 'Genesis 5:1-32', pericope: 'Generations from Adam to Noah' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-8', esvRef: 'Genesis 6:1-8', pericope: 'Increasing Corruption' },
        { ref: '6:9-22', esvRef: 'Genesis 6:9-22', pericope: 'Noah Builds the Ark' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-10', esvRef: 'Genesis 7:1-10', pericope: 'Entering the Ark' },
        { ref: '7:11-24', esvRef: 'Genesis 7:11-24', pericope: 'The Flood' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-14', esvRef: 'Genesis 8:1-14', pericope: 'The Waters Recede' },
        { ref: '8:15-22', esvRef: 'Genesis 8:15-22', pericope: 'Leaving the Ark' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-17', esvRef: 'Genesis 9:1-17', pericope: "God's Covenant with Noah" },
        { ref: '9:18-29', esvRef: 'Genesis 9:18-29', pericope: 'Noah and His Sons' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-32', esvRef: 'Genesis 10:1-32', pericope: 'The Table of Nations' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-9', esvRef: 'Genesis 11:1-9', pericope: 'The Tower of Babel' },
        { ref: '11:10-32', esvRef: 'Genesis 11:10-32', pericope: 'From Shem to Abram' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-9', esvRef: 'Genesis 12:1-9', pericope: 'The Call of Abram' },
        { ref: '12:10-20', esvRef: 'Genesis 12:10-20', pericope: 'Abram and Sarai in Egypt' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-13', esvRef: 'Genesis 13:1-13', pericope: 'Abram and Lot Separate' },
        { ref: '13:14-18', esvRef: 'Genesis 13:14-18', pericope: "God's Promise to Abram" },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-16', esvRef: 'Genesis 14:1-16', pericope: 'The Battle of the Kings' },
        { ref: '14:17-24', esvRef: 'Genesis 14:17-24', pericope: 'Melchizedek Blesses Abram' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-11', esvRef: 'Genesis 15:1-11', pericope: "God's Covenant with Abram" },
        { ref: '15:12-21', esvRef: 'Genesis 15:12-21', pericope: 'The Covenant Confirmed' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-6', esvRef: 'Genesis 16:1-6', pericope: 'Sarai and Hagar' },
        { ref: '16:7-16', esvRef: 'Genesis 16:7-16', pericope: 'Hagar and the Angel' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-8', esvRef: 'Genesis 17:1-8', pericope: 'Abram Renamed Abraham' },
        { ref: '17:9-14', esvRef: 'Genesis 17:9-14', pericope: 'The Sign of Circumcision' },
        { ref: '17:15-27', esvRef: 'Genesis 17:15-27', pericope: 'Sarai Renamed Sarah' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-15', esvRef: 'Genesis 18:1-15', pericope: 'Three Visitors' },
        { ref: '18:16-33', esvRef: 'Genesis 18:16-33', pericope: 'Abraham Pleads for Sodom' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-11', esvRef: 'Genesis 19:1-11', pericope: 'The Angels Come to Sodom' },
        { ref: '19:12-29', esvRef: 'Genesis 19:12-29', pericope: 'The Destruction of Sodom' },
        { ref: '19:30-38', esvRef: 'Genesis 19:30-38', pericope: 'Lot and His Daughters' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-18', esvRef: 'Genesis 20:1-18', pericope: 'Abraham and Abimelech' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-7', esvRef: 'Genesis 21:1-7', pericope: 'The Birth of Isaac' },
        { ref: '21:8-21', esvRef: 'Genesis 21:8-21', pericope: 'Hagar and Ishmael Sent Away' },
        { ref: '21:22-34', esvRef: 'Genesis 21:22-34', pericope: "Abraham and Abimelech's Covenant" },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-14', esvRef: 'Genesis 22:1-14', pericope: 'The Testing of Abraham' },
        { ref: '22:15-24', esvRef: 'Genesis 22:15-24', pericope: "God's Promise Renewed" },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-20', esvRef: 'Genesis 23:1-20', pericope: 'The Death and Burial of Sarah' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-28', esvRef: 'Genesis 24:1-28', pericope: 'A Wife for Isaac' },
        { ref: '24:29-67', esvRef: 'Genesis 24:29-67', pericope: 'Rebekah Meets Isaac' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-11', esvRef: 'Genesis 25:1-11', pericope: 'The Death of Abraham' },
        { ref: '25:12-18', esvRef: 'Genesis 25:12-18', pericope: "Ishmael's Descendants" },
        { ref: '25:19-34', esvRef: 'Genesis 25:19-34', pericope: 'Jacob and Esau' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-16', esvRef: 'Genesis 26:1-16', pericope: 'Isaac and Abimelech' },
        { ref: '26:17-33', esvRef: 'Genesis 26:17-33', pericope: "Isaac's Wells" },
        { ref: '26:34-35', esvRef: 'Genesis 26:34-35', pericope: "Esau's Wives" },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-29', esvRef: 'Genesis 27:1-29', pericope: 'Jacob Steals the Blessing' },
        { ref: '27:30-46', esvRef: 'Genesis 27:30-46', pericope: "Esau's Grief" },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-9', esvRef: 'Genesis 28:1-9', pericope: 'Jacob Sent to Laban' },
        { ref: '28:10-22', esvRef: 'Genesis 28:10-22', pericope: "Jacob's Dream at Bethel" },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-14', esvRef: 'Genesis 29:1-14', pericope: 'Jacob Meets Rachel' },
        { ref: '29:15-30', esvRef: 'Genesis 29:15-30', pericope: 'Jacob Marries Leah and Rachel' },
        { ref: '29:31-35', esvRef: 'Genesis 29:31-35', pericope: "Leah's Sons" },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-24', esvRef: 'Genesis 30:1-24', pericope: "Jacob's Children" },
        { ref: '30:25-43', esvRef: 'Genesis 30:25-43', pericope: "Jacob's Flocks Increase" },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-21', esvRef: 'Genesis 31:1-21', pericope: 'Jacob Flees from Laban' },
        { ref: '31:22-55', esvRef: 'Genesis 31:22-55', pericope: 'Laban Pursues Jacob' },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-21', esvRef: 'Genesis 32:1-21', pericope: 'Jacob Prepares to Meet Esau' },
        { ref: '32:22-32', esvRef: 'Genesis 32:22-32', pericope: 'Jacob Wrestles with God' },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-17', esvRef: 'Genesis 33:1-17', pericope: 'Jacob and Esau Reconcile' },
        { ref: '33:18-20', esvRef: 'Genesis 33:18-20', pericope: 'Jacob Settles in Shechem' },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-24', esvRef: 'Genesis 34:1-24', pericope: 'The Defiling of Dinah' },
        { ref: '34:25-31', esvRef: 'Genesis 34:25-31', pericope: "Simeon and Levi's Revenge" },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-15', esvRef: 'Genesis 35:1-15', pericope: 'God Blesses Jacob at Bethel' },
        { ref: '35:16-29', esvRef: 'Genesis 35:16-29', pericope: 'Deaths of Rachel and Isaac' },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-43', esvRef: 'Genesis 36:1-43', pericope: "Esau's Descendants" },
      ]},
      { ch: 37, chunks: [
        { ref: '37:1-11', esvRef: 'Genesis 37:1-11', pericope: "Joseph's Dreams" },
        { ref: '37:12-36', esvRef: 'Genesis 37:12-36', pericope: 'Joseph Sold into Egypt' },
      ]},
      { ch: 38, chunks: [
        { ref: '38:1-30', esvRef: 'Genesis 38:1-30', pericope: 'Judah and Tamar' },
      ]},
      { ch: 39, chunks: [
        { ref: '39:1-18', esvRef: 'Genesis 39:1-18', pericope: "Joseph and Potiphar's Wife" },
        { ref: '39:19-23', esvRef: 'Genesis 39:19-23', pericope: 'Joseph in Prison' },
      ]},
      { ch: 40, chunks: [
        { ref: '40:1-23', esvRef: 'Genesis 40:1-23', pericope: 'Joseph Interprets Dreams' },
      ]},
      { ch: 41, chunks: [
        { ref: '41:1-36', esvRef: 'Genesis 41:1-36', pericope: "Pharaoh's Dreams" },
        { ref: '41:37-57', esvRef: 'Genesis 41:37-57', pericope: 'Joseph Rises to Power' },
      ]},
      { ch: 42, chunks: [
        { ref: '42:1-25', esvRef: 'Genesis 42:1-25', pericope: "Joseph's Brothers Go to Egypt" },
        { ref: '42:26-38', esvRef: 'Genesis 42:26-38', pericope: 'The Brothers Return to Jacob' },
      ]},
      { ch: 43, chunks: [
        { ref: '43:1-15', esvRef: 'Genesis 43:1-15', pericope: 'The Second Journey to Egypt' },
        { ref: '43:16-34', esvRef: 'Genesis 43:16-34', pericope: 'Joseph Receives His Brothers' },
      ]},
      { ch: 44, chunks: [
        { ref: '44:1-17', esvRef: 'Genesis 44:1-17', pericope: 'The Silver Cup' },
        { ref: '44:18-34', esvRef: 'Genesis 44:18-34', pericope: 'Judah Pleads for Benjamin' },
      ]},
      { ch: 45, chunks: [
        { ref: '45:1-15', esvRef: 'Genesis 45:1-15', pericope: 'Joseph Makes Himself Known' },
        { ref: '45:16-28', esvRef: 'Genesis 45:16-28', pericope: 'Jacob Learns Joseph Is Alive' },
      ]},
      { ch: 46, chunks: [
        { ref: '46:1-7', esvRef: 'Genesis 46:1-7', pericope: "God Speaks to Jacob" },
        { ref: '46:8-27', esvRef: 'Genesis 46:8-27', pericope: "Jacob's Family Goes to Egypt" },
        { ref: '46:28-34', esvRef: 'Genesis 46:28-34', pericope: 'Jacob and Joseph Reunited' },
      ]},
      { ch: 47, chunks: [
        { ref: '47:1-12', esvRef: 'Genesis 47:1-12', pericope: 'Jacob Before Pharaoh' },
        { ref: '47:13-26', esvRef: 'Genesis 47:13-26', pericope: 'Joseph and the Famine' },
        { ref: '47:27-31', esvRef: 'Genesis 47:27-31', pericope: "Jacob's Final Years" },
      ]},
      { ch: 48, chunks: [
        { ref: '48:1-22', esvRef: 'Genesis 48:1-22', pericope: 'Jacob Blesses Ephraim and Manasseh' },
      ]},
      { ch: 49, chunks: [
        { ref: '49:1-28', esvRef: 'Genesis 49:1-28', pericope: 'Jacob Blesses His Sons' },
        { ref: '49:29-33', esvRef: 'Genesis 49:29-33', pericope: 'The Death of Jacob' },
      ]},
      { ch: 50, chunks: [
        { ref: '50:1-14', esvRef: 'Genesis 50:1-14', pericope: 'Jacob Is Buried in Canaan' },
        { ref: '50:15-21', esvRef: 'Genesis 50:15-21', pericope: 'Joseph Forgives His Brothers' },
        { ref: '50:22-26', esvRef: 'Genesis 50:22-26', pericope: 'The Death of Joseph' },
      ]},
    ]
  },
  {
    id: 'exodus',
    name: 'Exodus',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-7', esvRef: 'Exodus 1:1-7', pericope: 'Israel Multiplies in Egypt' },
        { ref: '1:8-22', esvRef: 'Exodus 1:8-22', pericope: 'Egypt Oppresses Israel' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-10', esvRef: 'Exodus 2:1-10', pericope: 'The Birth of Moses' },
        { ref: '2:11-25', esvRef: 'Exodus 2:11-25', pericope: 'Moses Flees to Midian' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-12', esvRef: 'Exodus 3:1-12', pericope: 'The Burning Bush' },
        { ref: '3:13-22', esvRef: 'Exodus 3:13-22', pericope: 'The Name of God' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-17', esvRef: 'Exodus 4:1-17', pericope: 'Signs for Moses' },
        { ref: '4:18-31', esvRef: 'Exodus 4:18-31', pericope: 'Moses Returns to Egypt' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-21', esvRef: 'Exodus 5:1-21', pericope: 'Making Bricks Without Straw' },
        { ref: '5:22-23', esvRef: 'Exodus 5:22-23', pericope: 'Moses Complains to God' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-13', esvRef: 'Exodus 6:1-13', pericope: 'God Promises Deliverance' },
        { ref: '6:14-30', esvRef: 'Exodus 6:14-30', pericope: 'The Genealogy of Moses and Aaron' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-13', esvRef: 'Exodus 7:1-13', pericope: "Aaron's Staff Becomes a Snake" },
        { ref: '7:14-25', esvRef: 'Exodus 7:14-25', pericope: 'The First Plague: Water Turned to Blood' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-15', esvRef: 'Exodus 8:1-15', pericope: 'The Second Plague: Frogs' },
        { ref: '8:16-19', esvRef: 'Exodus 8:16-19', pericope: 'The Third Plague: Gnats' },
        { ref: '8:20-32', esvRef: 'Exodus 8:20-32', pericope: 'The Fourth Plague: Flies' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-7', esvRef: 'Exodus 9:1-7', pericope: 'The Fifth Plague: Egyptian Livestock Die' },
        { ref: '9:8-12', esvRef: 'Exodus 9:8-12', pericope: 'The Sixth Plague: Boils' },
        { ref: '9:13-35', esvRef: 'Exodus 9:13-35', pericope: 'The Seventh Plague: Hail' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-20', esvRef: 'Exodus 10:1-20', pericope: 'The Eighth Plague: Locusts' },
        { ref: '10:21-29', esvRef: 'Exodus 10:21-29', pericope: 'The Ninth Plague: Darkness' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-10', esvRef: 'Exodus 11:1-10', pericope: 'A Final Plague Threatened' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-20', esvRef: 'Exodus 12:1-20', pericope: 'The Passover Instructions' },
        { ref: '12:21-28', esvRef: 'Exodus 12:21-28', pericope: 'The First Passover Instituted' },
        { ref: '12:29-42', esvRef: 'Exodus 12:29-42', pericope: 'The Exodus' },
        { ref: '12:43-51', esvRef: 'Exodus 12:43-51', pericope: 'The Passover Regulations' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-16', esvRef: 'Exodus 13:1-16', pericope: 'Consecration of the Firstborn; Feast of Unleavened Bread' },
        { ref: '13:17-22', esvRef: 'Exodus 13:17-22', pericope: 'The Pillar of Cloud and Fire' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-14', esvRef: 'Exodus 14:1-14', pericope: 'Israel at the Red Sea' },
        { ref: '14:15-31', esvRef: 'Exodus 14:15-31', pericope: 'Crossing the Red Sea' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-21', esvRef: 'Exodus 15:1-21', pericope: 'The Song of Moses and Miriam' },
        { ref: '15:22-27', esvRef: 'Exodus 15:22-27', pericope: 'Bitter Water Made Sweet' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-21', esvRef: 'Exodus 16:1-21', pericope: 'Bread from Heaven' },
        { ref: '16:22-36', esvRef: 'Exodus 16:22-36', pericope: 'The Sabbath Regulation for Manna' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-7', esvRef: 'Exodus 17:1-7', pericope: 'Water from the Rock' },
        { ref: '17:8-16', esvRef: 'Exodus 17:8-16', pericope: 'Israel Defeats Amalek' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-12', esvRef: 'Exodus 18:1-12', pericope: 'Jethro Visits Moses' },
        { ref: '18:13-27', esvRef: 'Exodus 18:13-27', pericope: "Jethro's Advice" },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-9', esvRef: 'Exodus 19:1-9', pericope: 'Israel at Mount Sinai' },
        { ref: '19:10-25', esvRef: 'Exodus 19:10-25', pericope: 'The Lord Comes to Sinai' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-17', esvRef: 'Exodus 20:1-17', pericope: 'The Ten Commandments' },
        { ref: '20:18-21', esvRef: 'Exodus 20:18-21', pericope: 'The Fear of God' },
        { ref: '20:22-26', esvRef: 'Exodus 20:22-26', pericope: 'Laws About Altars' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-11', esvRef: 'Exodus 21:1-11', pericope: 'Laws About Slaves' },
        { ref: '21:12-36', esvRef: 'Exodus 21:12-36', pericope: 'Laws About Violence' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-15', esvRef: 'Exodus 22:1-15', pericope: 'Laws About Restitution' },
        { ref: '22:16-31', esvRef: 'Exodus 22:16-31', pericope: 'Laws About Social Justice' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-9', esvRef: 'Exodus 23:1-9', pericope: 'Laws of Justice' },
        { ref: '23:10-19', esvRef: 'Exodus 23:10-19', pericope: 'Sabbath Laws; Three Feasts' },
        { ref: '23:20-33', esvRef: 'Exodus 23:20-33', pericope: 'The Angel and the Promised Land' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-11', esvRef: 'Exodus 24:1-11', pericope: 'The Covenant Confirmed' },
        { ref: '24:12-18', esvRef: 'Exodus 24:12-18', pericope: 'Moses Goes Up the Mountain' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-9', esvRef: 'Exodus 25:1-9', pericope: 'Contributions for the Sanctuary' },
        { ref: '25:10-22', esvRef: 'Exodus 25:10-22', pericope: 'The Ark of the Covenant' },
        { ref: '25:23-30', esvRef: 'Exodus 25:23-30', pericope: 'The Table for Bread' },
        { ref: '25:31-40', esvRef: 'Exodus 25:31-40', pericope: 'The Golden Lampstand' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-37', esvRef: 'Exodus 26:1-37', pericope: 'The Tabernacle' },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-8', esvRef: 'Exodus 27:1-8', pericope: 'The Bronze Altar' },
        { ref: '27:9-19', esvRef: 'Exodus 27:9-19', pericope: 'The Court of the Tabernacle' },
        { ref: '27:20-21', esvRef: 'Exodus 27:20-21', pericope: 'Oil for the Lamp' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-14', esvRef: 'Exodus 28:1-14', pericope: 'The Priestly Garments; The Ephod' },
        { ref: '28:15-30', esvRef: 'Exodus 28:15-30', pericope: 'The Breastpiece' },
        { ref: '28:31-43', esvRef: 'Exodus 28:31-43', pericope: 'Other Priestly Garments' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-37', esvRef: 'Exodus 29:1-37', pericope: 'Consecration of the Priests' },
        { ref: '29:38-46', esvRef: 'Exodus 29:38-46', pericope: 'Regular Burnt Offerings' },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-10', esvRef: 'Exodus 30:1-10', pericope: 'The Altar of Incense' },
        { ref: '30:11-16', esvRef: 'Exodus 30:11-16', pericope: 'The Census Tax' },
        { ref: '30:17-21', esvRef: 'Exodus 30:17-21', pericope: 'The Bronze Basin' },
        { ref: '30:22-33', esvRef: 'Exodus 30:22-33', pericope: 'The Anointing Oil' },
        { ref: '30:34-38', esvRef: 'Exodus 30:34-38', pericope: 'The Incense' },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-11', esvRef: 'Exodus 31:1-11', pericope: 'The Craftsmen Appointed' },
        { ref: '31:12-18', esvRef: 'Exodus 31:12-18', pericope: 'The Sabbath Sign' },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-14', esvRef: 'Exodus 32:1-14', pericope: 'The Golden Calf' },
        { ref: '32:15-29', esvRef: 'Exodus 32:15-29', pericope: 'Moses Breaks the Tablets; The Levites Act' },
        { ref: '32:30-35', esvRef: 'Exodus 32:30-35', pericope: 'Moses Intercedes for Israel' },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-6', esvRef: 'Exodus 33:1-6', pericope: 'The Command to Leave Sinai' },
        { ref: '33:7-11', esvRef: 'Exodus 33:7-11', pericope: 'The Tent of Meeting' },
        { ref: '33:12-23', esvRef: 'Exodus 33:12-23', pericope: "Moses' Intercession" },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-9', esvRef: 'Exodus 34:1-9', pericope: 'Moses Makes New Tablets' },
        { ref: '34:10-28', esvRef: 'Exodus 34:10-28', pericope: 'The Covenant Renewed' },
        { ref: '34:29-35', esvRef: 'Exodus 34:29-35', pericope: 'The Shining Face of Moses' },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-3', esvRef: 'Exodus 35:1-3', pericope: 'Sabbath Regulations' },
        { ref: '35:4-29', esvRef: 'Exodus 35:4-29', pericope: 'Contributions for the Tabernacle' },
        { ref: '35:30-35', esvRef: 'Exodus 35:30-35', pericope: 'Bezalel and Oholiab' },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-7', esvRef: 'Exodus 36:1-7', pericope: 'Building the Tabernacle; Gifts Enough' },
        { ref: '36:8-38', esvRef: 'Exodus 36:8-38', pericope: 'The Tabernacle Constructed' },
      ]},
      { ch: 37, chunks: [
        { ref: '37:1-9', esvRef: 'Exodus 37:1-9', pericope: 'The Ark Made' },
        { ref: '37:10-16', esvRef: 'Exodus 37:10-16', pericope: 'The Table Made' },
        { ref: '37:17-24', esvRef: 'Exodus 37:17-24', pericope: 'The Lampstand Made' },
        { ref: '37:25-29', esvRef: 'Exodus 37:25-29', pericope: 'The Altar of Incense Made' },
      ]},
      { ch: 38, chunks: [
        { ref: '38:1-8', esvRef: 'Exodus 38:1-8', pericope: 'The Bronze Altar and Basin' },
        { ref: '38:9-20', esvRef: 'Exodus 38:9-20', pericope: 'The Court' },
        { ref: '38:21-31', esvRef: 'Exodus 38:21-31', pericope: 'Materials of the Tabernacle' },
      ]},
      { ch: 39, chunks: [
        { ref: '39:1-31', esvRef: 'Exodus 39:1-31', pericope: 'The Priestly Garments Made' },
        { ref: '39:32-43', esvRef: 'Exodus 39:32-43', pericope: 'The Tabernacle Completed' },
      ]},
      { ch: 40, chunks: [
        { ref: '40:1-16', esvRef: 'Exodus 40:1-16', pericope: 'The Tabernacle Erected' },
        { ref: '40:17-38', esvRef: 'Exodus 40:17-38', pericope: 'The Glory of the Lord Fills the Tabernacle' },
      ]},
    ]
  },
  {
    id: 'leviticus',
    name: 'Leviticus',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [{ ref: '1:1-17', esvRef: 'Leviticus 1:1-17', pericope: 'Laws for Burnt Offerings' }] },
      { ch: 2, chunks: [{ ref: '2:1-16', esvRef: 'Leviticus 2:1-16', pericope: 'Laws for Grain Offerings' }] },
      { ch: 3, chunks: [{ ref: '3:1-17', esvRef: 'Leviticus 3:1-17', pericope: 'Laws for Peace Offerings' }] },
      { ch: 4, chunks: [{ ref: '4:1-35', esvRef: 'Leviticus 4:1-35', pericope: 'Laws for Sin Offerings' }] },
      { ch: 5, chunks: [{ ref: '5:1-19', esvRef: 'Leviticus 5:1-19', pericope: 'More Offerings for Sin and Guilt' }] },
      { ch: 6, chunks: [{ ref: '6:1-30', esvRef: 'Leviticus 6:1-30', pericope: "Laws for Offerings; The Priests' Portions" }] },
      { ch: 7, chunks: [{ ref: '7:1-38', esvRef: 'Leviticus 7:1-38', pericope: 'Laws for Guilt and Peace Offerings' }] },
      { ch: 8, chunks: [{ ref: '8:1-36', esvRef: 'Leviticus 8:1-36', pericope: "The Ordination of Aaron and His Sons" }] },
      { ch: 9, chunks: [{ ref: '9:1-24', esvRef: 'Leviticus 9:1-24', pericope: "Aaron's First Offerings; The Glory of the Lord Appears" }] },
      { ch: 10, chunks: [{ ref: '10:1-20', esvRef: 'Leviticus 10:1-20', pericope: "Nadab and Abihu's Sin; Instructions for Priests" }] },
      { ch: 11, chunks: [{ ref: '11:1-47', esvRef: 'Leviticus 11:1-47', pericope: 'Clean and Unclean Animals' }] },
      { ch: 12, chunks: [{ ref: '12:1-8', esvRef: 'Leviticus 12:1-8', pericope: 'Purification After Childbirth' }] },
      { ch: 13, chunks: [
        { ref: '13:1-46', esvRef: 'Leviticus 13:1-46', pericope: 'Laws on Skin Diseases' },
        { ref: '13:47-59', esvRef: 'Leviticus 13:47-59', pericope: 'Laws on Diseased Garments' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-32', esvRef: 'Leviticus 14:1-32', pericope: 'Cleansing of Skin Diseases' },
        { ref: '14:33-57', esvRef: 'Leviticus 14:33-57', pericope: 'Cleansing of Diseased Houses' },
      ]},
      { ch: 15, chunks: [{ ref: '15:1-33', esvRef: 'Leviticus 15:1-33', pericope: 'Laws on Bodily Discharges' }] },
      { ch: 16, chunks: [{ ref: '16:1-34', esvRef: 'Leviticus 16:1-34', pericope: 'The Day of Atonement' }] },
      { ch: 17, chunks: [{ ref: '17:1-16', esvRef: 'Leviticus 17:1-16', pericope: 'Laws About Blood' }] },
      { ch: 18, chunks: [{ ref: '18:1-30', esvRef: 'Leviticus 18:1-30', pericope: 'Unlawful Sexual Relations' }] },
      { ch: 19, chunks: [{ ref: '19:1-37', esvRef: 'Leviticus 19:1-37', pericope: 'Various Laws; Love Your Neighbor' }] },
      { ch: 20, chunks: [{ ref: '20:1-27', esvRef: 'Leviticus 20:1-27', pericope: 'Punishments for Violations of Holiness' }] },
      { ch: 21, chunks: [{ ref: '21:1-24', esvRef: 'Leviticus 21:1-24', pericope: 'Holiness for Priests' }] },
      { ch: 22, chunks: [{ ref: '22:1-33', esvRef: 'Leviticus 22:1-33', pericope: 'Acceptable and Unacceptable Offerings' }] },
      { ch: 23, chunks: [
        { ref: '23:1-22', esvRef: 'Leviticus 23:1-22', pericope: 'The Sabbath; Passover; Firstfruits; Weeks' },
        { ref: '23:23-44', esvRef: 'Leviticus 23:23-44', pericope: 'Trumpets; Day of Atonement; Booths' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-9', esvRef: 'Leviticus 24:1-9', pericope: 'Oil for the Lamp; Bread for the Table' },
        { ref: '24:10-23', esvRef: 'Leviticus 24:10-23', pericope: 'Punishment for Blasphemy' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-22', esvRef: 'Leviticus 25:1-22', pericope: 'The Sabbath Year and the Year of Jubilee' },
        { ref: '25:23-55', esvRef: 'Leviticus 25:23-55', pericope: 'Redemption of Property and Persons' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-13', esvRef: 'Leviticus 26:1-13', pericope: 'Blessings for Obedience' },
        { ref: '26:14-46', esvRef: 'Leviticus 26:14-46', pericope: 'Punishments for Disobedience; Hope for Repentance' },
      ]},
      { ch: 27, chunks: [{ ref: '27:1-34', esvRef: 'Leviticus 27:1-34', pericope: 'Laws on Vows and Tithes' }] },
    ]
  },
  {
    id: 'numbers',
    name: 'Numbers',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [{ ref: '1:1-54', esvRef: 'Numbers 1:1-54', pericope: 'The First Census of Israel' }] },
      { ch: 2, chunks: [{ ref: '2:1-34', esvRef: 'Numbers 2:1-34', pericope: 'The Arrangement of the Camp' }] },
      { ch: 3, chunks: [{ ref: '3:1-51', esvRef: 'Numbers 3:1-51', pericope: 'The Levites and Their Duties' }] },
      { ch: 4, chunks: [{ ref: '4:1-49', esvRef: 'Numbers 4:1-49', pericope: 'The Levitical Clans and Their Duties' }] },
      { ch: 5, chunks: [{ ref: '5:1-31', esvRef: 'Numbers 5:1-31', pericope: 'Laws on Uncleanness, Restitution, and Jealousy' }] },
      { ch: 6, chunks: [
        { ref: '6:1-21', esvRef: 'Numbers 6:1-21', pericope: 'The Nazirite Vow' },
        { ref: '6:22-27', esvRef: 'Numbers 6:22-27', pericope: 'The Priestly Blessing' },
      ]},
      { ch: 7, chunks: [{ ref: '7:1-89', esvRef: 'Numbers 7:1-89', pericope: 'Offerings of the Tribal Chiefs' }] },
      { ch: 8, chunks: [{ ref: '8:1-26', esvRef: 'Numbers 8:1-26', pericope: 'The Lamps; The Levites Dedicated' }] },
      { ch: 9, chunks: [
        { ref: '9:1-14', esvRef: 'Numbers 9:1-14', pericope: 'The Passover in the Wilderness' },
        { ref: '9:15-23', esvRef: 'Numbers 9:15-23', pericope: 'The Cloud and Fire' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-10', esvRef: 'Numbers 10:1-10', pericope: 'The Silver Trumpets' },
        { ref: '10:11-36', esvRef: 'Numbers 10:11-36', pericope: 'Israel Leaves Sinai' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-35', esvRef: 'Numbers 11:1-35', pericope: 'Complaint and Quail; Moses Appoints Elders' },
      ]},
      { ch: 12, chunks: [{ ref: '12:1-16', esvRef: 'Numbers 12:1-16', pericope: "Miriam and Aaron Oppose Moses" }] },
      { ch: 13, chunks: [
        { ref: '13:1-25', esvRef: 'Numbers 13:1-25', pericope: 'Spies Sent into Canaan' },
        { ref: '13:26-33', esvRef: 'Numbers 13:26-33', pericope: 'Report of the Spies' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-19', esvRef: 'Numbers 14:1-19', pericope: "The People's Rebellion; Moses Intercedes" },
        { ref: '14:20-45', esvRef: 'Numbers 14:20-45', pericope: "The Lord's Judgment; Forty Years" },
      ]},
      { ch: 15, chunks: [{ ref: '15:1-41', esvRef: 'Numbers 15:1-41', pericope: 'Laws on Offerings; The Sabbath Breaker; Tassels' }] },
      { ch: 16, chunks: [
        { ref: '16:1-35', esvRef: 'Numbers 16:1-35', pericope: "Korah's Rebellion" },
        { ref: '16:36-50', esvRef: 'Numbers 16:36-50', pericope: "The Aftermath; Aaron Stays the Plague" },
      ]},
      { ch: 17, chunks: [{ ref: '17:1-13', esvRef: 'Numbers 17:1-13', pericope: "Aaron's Staff Buds" }] },
      { ch: 18, chunks: [{ ref: '18:1-32', esvRef: 'Numbers 18:1-32', pericope: "The Priests' and Levites' Duties and Portions" }] },
      { ch: 19, chunks: [{ ref: '19:1-22', esvRef: 'Numbers 19:1-22', pericope: 'The Red Heifer and Water of Cleansing' }] },
      { ch: 20, chunks: [
        { ref: '20:1-13', esvRef: 'Numbers 20:1-13', pericope: "The Death of Miriam; Water from the Rock; Moses' Sin" },
        { ref: '20:14-29', esvRef: 'Numbers 20:14-29', pericope: "Edom Refuses Passage; The Death of Aaron" },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-9', esvRef: 'Numbers 21:1-9', pericope: 'The Bronze Serpent' },
        { ref: '21:10-35', esvRef: 'Numbers 21:10-35', pericope: 'The Journey; Defeat of Sihon and Og' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-21', esvRef: 'Numbers 22:1-21', pericope: 'Balak Sends for Balaam' },
        { ref: '22:22-41', esvRef: 'Numbers 22:22-41', pericope: "Balaam's Donkey" },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-12', esvRef: 'Numbers 23:1-12', pericope: "Balaam's First Oracle" },
        { ref: '23:13-30', esvRef: 'Numbers 23:13-30', pericope: "Balaam's Second Oracle" },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-19', esvRef: 'Numbers 24:1-19', pericope: "Balaam's Third and Fourth Oracles" },
        { ref: '24:20-25', esvRef: 'Numbers 24:20-25', pericope: "Balaam's Remaining Oracles" },
      ]},
      { ch: 25, chunks: [{ ref: '25:1-18', esvRef: 'Numbers 25:1-18', pericope: "Israel's Idolatry; Phinehas' Zeal" }] },
      { ch: 26, chunks: [{ ref: '26:1-65', esvRef: 'Numbers 26:1-65', pericope: 'The Second Census' }] },
      { ch: 27, chunks: [
        { ref: '27:1-11', esvRef: 'Numbers 27:1-11', pericope: "The Daughters of Zelophehad" },
        { ref: '27:12-23', esvRef: 'Numbers 27:12-23', pericope: 'Joshua Commissioned' },
      ]},
      { ch: 28, chunks: [{ ref: '28:1-31', esvRef: 'Numbers 28:1-31', pericope: 'Regular Offerings; Passover; Feast of Weeks' }] },
      { ch: 29, chunks: [{ ref: '29:1-40', esvRef: 'Numbers 29:1-40', pericope: 'Feasts of Trumpets, Atonement, and Booths' }] },
      { ch: 30, chunks: [{ ref: '30:1-16', esvRef: 'Numbers 30:1-16', pericope: 'Laws on Vows' }] },
      { ch: 31, chunks: [{ ref: '31:1-54', esvRef: 'Numbers 31:1-54', pericope: 'War Against Midian' }] },
      { ch: 32, chunks: [{ ref: '32:1-42', esvRef: 'Numbers 32:1-42', pericope: 'Transjordan Settlements' }] },
      { ch: 33, chunks: [{ ref: '33:1-56', esvRef: 'Numbers 33:1-56', pericope: "Israel's Journey from Egypt to Canaan" }] },
      { ch: 34, chunks: [{ ref: '34:1-29', esvRef: 'Numbers 34:1-29', pericope: 'The Boundaries of Canaan; Division of the Land' }] },
      { ch: 35, chunks: [{ ref: '35:1-34', esvRef: 'Numbers 35:1-34', pericope: 'Levitical Cities; Cities of Refuge' }] },
      { ch: 36, chunks: [{ ref: '36:1-13', esvRef: 'Numbers 36:1-13', pericope: "Laws on the Daughters of Zelophehad's Inheritance" }] },
    ]
  },
  {
    id: 'deuteronomy',
    name: 'Deuteronomy',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-18', esvRef: 'Deuteronomy 1:1-18', pericope: 'Introduction; The Appointment of Leaders' },
        { ref: '1:19-46', esvRef: 'Deuteronomy 1:19-46', pericope: 'The Faithless Generation' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-25', esvRef: 'Deuteronomy 2:1-25', pericope: 'Wandering in the Wilderness' },
        { ref: '2:26-37', esvRef: 'Deuteronomy 2:26-37', pericope: 'Defeat of Sihon' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-22', esvRef: 'Deuteronomy 3:1-22', pericope: 'Defeat of Og; Division of the Land' },
        { ref: '3:23-29', esvRef: 'Deuteronomy 3:23-29', pericope: 'Moses Not Allowed to Enter the Land' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-24', esvRef: 'Deuteronomy 4:1-24', pericope: 'Hear, O Israel; Warning Against Idolatry' },
        { ref: '4:25-43', esvRef: 'Deuteronomy 4:25-43', pericope: 'Blessings for Obedience; Cities of Refuge' },
        { ref: '4:44-49', esvRef: 'Deuteronomy 4:44-49', pericope: 'Introduction to the Law' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-21', esvRef: 'Deuteronomy 5:1-21', pericope: 'The Ten Commandments Repeated' },
        { ref: '5:22-33', esvRef: 'Deuteronomy 5:22-33', pericope: 'The People Respond; Moses Mediates' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-9', esvRef: 'Deuteronomy 6:1-9', pericope: 'The Shema: Love the Lord Your God' },
        { ref: '6:10-25', esvRef: 'Deuteronomy 6:10-25', pericope: 'Warning Against Forgetting God' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-26', esvRef: 'Deuteronomy 7:1-26', pericope: 'Drive Out the Nations; No Intermarriage' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-20', esvRef: 'Deuteronomy 8:1-20', pericope: 'Remember the Lord Your God' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-29', esvRef: 'Deuteronomy 9:1-29', pericope: 'Not Because of Righteousness' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-22', esvRef: 'Deuteronomy 10:1-22', pericope: 'New Tablets; What God Requires' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-32', esvRef: 'Deuteronomy 11:1-32', pericope: 'Love and Obey the Lord; Blessings and Curses' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-32', esvRef: 'Deuteronomy 12:1-32', pericope: 'The Central Place of Worship' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-18', esvRef: 'Deuteronomy 13:1-18', pericope: 'Warning Against Idolatry and False Prophets' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-29', esvRef: 'Deuteronomy 14:1-29', pericope: 'Clean and Unclean Foods; Tithes' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-23', esvRef: 'Deuteronomy 15:1-23', pericope: 'The Sabbatical Year; Slavery Laws' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-22', esvRef: 'Deuteronomy 16:1-22', pericope: 'The Three Annual Feasts; Judges' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-20', esvRef: 'Deuteronomy 17:1-20', pericope: 'Legal Procedures; The King' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-22', esvRef: 'Deuteronomy 18:1-22', pericope: 'Levitical Priests; Prophet Like Moses' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-21', esvRef: 'Deuteronomy 19:1-21', pericope: 'Cities of Refuge; Witnesses' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-20', esvRef: 'Deuteronomy 20:1-20', pericope: 'Rules of War' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-23', esvRef: 'Deuteronomy 21:1-23', pericope: 'Various Laws' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-30', esvRef: 'Deuteronomy 22:1-30', pericope: 'Social Laws; Marriage Laws' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-25', esvRef: 'Deuteronomy 23:1-25', pericope: 'Exclusions from the Assembly; Vows' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-22', esvRef: 'Deuteronomy 24:1-22', pericope: 'Marriage and Divorce; Protection of the Vulnerable' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-19', esvRef: 'Deuteronomy 25:1-19', pericope: 'Various Laws; Amalek' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-19', esvRef: 'Deuteronomy 26:1-19', pericope: 'Firstfruits and Tithes; Covenant Ratification' },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-26', esvRef: 'Deuteronomy 27:1-26', pericope: 'The Altar on Mount Ebal; The Twelve Curses' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-14', esvRef: 'Deuteronomy 28:1-14', pericope: 'Blessings for Obedience' },
        { ref: '28:15-68', esvRef: 'Deuteronomy 28:15-68', pericope: 'Curses for Disobedience' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-29', esvRef: 'Deuteronomy 29:1-29', pericope: 'The Covenant in Moab' },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-20', esvRef: 'Deuteronomy 30:1-20', pericope: 'Return and Prosperity; Choose Life' },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-29', esvRef: 'Deuteronomy 31:1-29', pericope: 'Joshua Commissioned; The Song and Law Deposited' },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-52', esvRef: 'Deuteronomy 32:1-52', pericope: 'The Song of Moses' },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-29', esvRef: 'Deuteronomy 33:1-29', pericope: 'Moses Blesses the Tribes' },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-12', esvRef: 'Deuteronomy 34:1-12', pericope: 'The Death of Moses' },
      ]},
    ]
  },
  {
    id: 'joshua',
    name: 'Joshua',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-9', esvRef: 'Joshua 1:1-9', pericope: 'God Commands Joshua' },
        { ref: '1:10-18', esvRef: 'Joshua 1:10-18', pericope: 'Joshua Commands the People' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-24', esvRef: 'Joshua 2:1-24', pericope: 'Rahab and the Spies' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-17', esvRef: 'Joshua 3:1-17', pericope: 'Israel Crosses the Jordan' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-24', esvRef: 'Joshua 4:1-24', pericope: 'The Twelve Stones' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-12', esvRef: 'Joshua 5:1-12', pericope: 'Circumcision and Passover at Gilgal' },
        { ref: '5:13-15', esvRef: 'Joshua 5:13-15', pericope: "The Commander of the Lord's Army" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-21', esvRef: 'Joshua 6:1-21', pericope: 'The Fall of Jericho' },
        { ref: '6:22-27', esvRef: 'Joshua 6:22-27', pericope: 'Rahab Saved' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-15', esvRef: 'Joshua 7:1-15', pericope: "Israel Defeated at Ai; Achan's Sin" },
        { ref: '7:16-26', esvRef: 'Joshua 7:16-26', pericope: 'Achan Punished' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-29', esvRef: 'Joshua 8:1-29', pericope: 'The Capture of Ai' },
        { ref: '8:30-35', esvRef: 'Joshua 8:30-35', pericope: 'The Covenant Renewed at Mount Ebal' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-27', esvRef: 'Joshua 9:1-27', pericope: 'The Gibeonite Deception' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-15', esvRef: 'Joshua 10:1-15', pericope: 'The Day the Sun Stood Still' },
        { ref: '10:16-43', esvRef: 'Joshua 10:16-43', pericope: "Joshua's Campaign in the South" },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-23', esvRef: 'Joshua 11:1-23', pericope: "Joshua's Campaign in the North" },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-24', esvRef: 'Joshua 12:1-24', pericope: 'Kings Defeated by Moses and Joshua' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-33', esvRef: 'Joshua 13:1-33', pericope: 'The Land Yet to Be Conquered; Transjordan Allotments' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-15', esvRef: 'Joshua 14:1-15', pericope: "Caleb's Inheritance" },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-63', esvRef: 'Joshua 15:1-63', pericope: 'The Territory of Judah' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-10', esvRef: 'Joshua 16:1-10', pericope: 'The Territory of Ephraim' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-18', esvRef: 'Joshua 17:1-18', pericope: 'The Territory of Manasseh' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-10', esvRef: 'Joshua 18:1-10', pericope: 'The Remaining Land Divided' },
        { ref: '18:11-28', esvRef: 'Joshua 18:11-28', pericope: 'The Territory of Benjamin' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-51', esvRef: 'Joshua 19:1-51', pericope: 'Territories of the Remaining Tribes' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-9', esvRef: 'Joshua 20:1-9', pericope: 'The Cities of Refuge' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-45', esvRef: 'Joshua 21:1-45', pericope: 'Cities for the Levites' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-34', esvRef: 'Joshua 22:1-34', pericope: 'The Eastern Tribes Return Home; The Altar of Witness' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-16', esvRef: 'Joshua 23:1-16', pericope: "Joshua's Farewell Address" },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-28', esvRef: 'Joshua 24:1-28', pericope: 'The Covenant Renewed at Shechem' },
        { ref: '24:29-33', esvRef: 'Joshua 24:29-33', pericope: 'The Death of Joshua' },
      ]},
    ]
  },
  {
    id: 'judges',
    name: 'Judges',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-26', esvRef: 'Judges 1:1-26', pericope: "Israel's Incomplete Conquest of Canaan" },
        { ref: '1:27-36', esvRef: 'Judges 1:27-36', pericope: "Israel's Failure to Drive Out the Nations" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-5', esvRef: 'Judges 2:1-5', pericope: "The Angel of the Lord Rebukes Israel" },
        { ref: '2:6-23', esvRef: 'Judges 2:6-23', pericope: "Israel's Unfaithfulness; The Cycle of Judges" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-11', esvRef: 'Judges 3:1-11', pericope: 'Othniel Delivers Israel' },
        { ref: '3:12-30', esvRef: 'Judges 3:12-30', pericope: 'Ehud Defeats Moab' },
        { ref: '3:31', esvRef: 'Judges 3:31', pericope: 'Shamgar' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-16', esvRef: 'Judges 4:1-16', pericope: 'Deborah and Barak Defeat Sisera' },
        { ref: '4:17-24', esvRef: 'Judges 4:17-24', pericope: 'Jael Kills Sisera' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-31', esvRef: 'Judges 5:1-31', pericope: 'The Song of Deborah' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-24', esvRef: 'Judges 6:1-24', pericope: "The Angel Calls Gideon" },
        { ref: '6:25-40', esvRef: 'Judges 6:25-40', pericope: "Gideon Tears Down Baal's Altar; The Fleece" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-22', esvRef: 'Judges 7:1-22', pericope: "Gideon's Three Hundred Men Defeat Midian" },
        { ref: '7:23-25', esvRef: 'Judges 7:23-25', pericope: 'The Ephraimites Pursue Midian' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-21', esvRef: 'Judges 8:1-21', pericope: "Gideon Pursues Midian's Kings" },
        { ref: '8:22-35', esvRef: 'Judges 8:22-35', pericope: "Gideon's Ephod; His Death" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-21', esvRef: 'Judges 9:1-21', pericope: "Abimelech Becomes King; Jotham's Parable" },
        { ref: '9:22-57', esvRef: 'Judges 9:22-57', pericope: "Abimelech's Fall" },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-18', esvRef: 'Judges 10:1-18', pericope: 'Tola, Jair; Israel Oppressed Again' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-28', esvRef: 'Judges 11:1-28', pericope: "Jephthah's History and Negotiations" },
        { ref: '11:29-40', esvRef: 'Judges 11:29-40', pericope: "Jephthah's Vow and His Daughter" },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-7', esvRef: 'Judges 12:1-7', pericope: 'Jephthah and the Ephraimites' },
        { ref: '12:8-15', esvRef: 'Judges 12:8-15', pericope: 'Ibzan, Elon, and Abdon' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-25', esvRef: 'Judges 13:1-25', pericope: "The Birth of Samson" },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-20', esvRef: 'Judges 14:1-20', pericope: "Samson's Marriage and Riddle" },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-20', esvRef: 'Judges 15:1-20', pericope: "Samson's Revenge; He Judges Israel" },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-22', esvRef: 'Judges 16:1-22', pericope: 'Samson and Delilah' },
        { ref: '16:23-31', esvRef: 'Judges 16:23-31', pericope: "Samson's Death" },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-13', esvRef: 'Judges 17:1-13', pericope: "Micah's Idols and Levite" },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-31', esvRef: 'Judges 18:1-31', pericope: "The Danites Steal Micah's Idols; Dan's Conquest" },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-30', esvRef: 'Judges 19:1-30', pericope: "The Levite's Concubine at Gibeah" },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-48', esvRef: 'Judges 20:1-48', pericope: 'Israel Fights Benjamin' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-25', esvRef: 'Judges 21:1-25', pericope: "Wives for Benjamin; Israel's Chaos" },
      ]},
    ]
  },
  {
    id: 'ruth',
    name: 'Ruth',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-7', esvRef: 'Ruth 1:1-7', pericope: "Naomi's Loss" },
        { ref: '1:8-22', esvRef: 'Ruth 1:8-22', pericope: "Ruth's Loyalty to Naomi" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-17', esvRef: 'Ruth 2:1-17', pericope: 'Ruth Meets Boaz' },
        { ref: '2:18-23', esvRef: 'Ruth 2:18-23', pericope: 'Ruth Returns to Naomi' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-13', esvRef: 'Ruth 3:1-13', pericope: 'Ruth and Boaz at the Threshing Floor' },
        { ref: '3:14-18', esvRef: 'Ruth 3:14-18', pericope: 'Ruth Returns to Naomi' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-12', esvRef: 'Ruth 4:1-12', pericope: 'Boaz Redeems Ruth' },
        { ref: '4:13-22', esvRef: 'Ruth 4:13-22', pericope: 'The Line of Judah' },
      ]},
    ]
  },
  {
    id: '1-samuel',
    name: '1 Samuel',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-8', esvRef: '1 Samuel 1:1-8', pericope: 'Elkanah and His Two Wives' },
        { ref: '1:9-20', esvRef: '1 Samuel 1:9-20', pericope: "Hannah's Vow and Prayer" },
        { ref: '1:21-28', esvRef: '1 Samuel 1:21-28', pericope: 'Samuel Given to the Lord' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: '1 Samuel 2:1-11', pericope: "Hannah's Prayer" },
        { ref: '2:12-26', esvRef: '1 Samuel 2:12-26', pericope: "The Wickedness of Eli's Sons" },
        { ref: '2:27-36', esvRef: '1 Samuel 2:27-36', pericope: "The Prophecy Against Eli's House" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-18', esvRef: '1 Samuel 3:1-18', pericope: 'The Lord Calls Samuel' },
        { ref: '3:19-21', esvRef: '1 Samuel 3:19-21', pericope: "Samuel's Growth and Recognition" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-11', esvRef: '1 Samuel 4:1-11', pericope: 'Israel Defeated; The Ark Captured' },
        { ref: '4:12-22', esvRef: '1 Samuel 4:12-22', pericope: "Eli's Death; Ichabod" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-12', esvRef: '1 Samuel 5:1-12', pericope: 'The Ark in Philistia' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-18', esvRef: '1 Samuel 6:1-18', pericope: 'The Ark Returned to Israel' },
        { ref: '6:19-21', esvRef: '1 Samuel 6:19-21', pericope: 'The Ark at Beth-shemesh' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-17', esvRef: '1 Samuel 7:1-17', pericope: 'Samuel Judges Israel' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-22', esvRef: '1 Samuel 8:1-22', pericope: 'Israel Demands a King' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-14', esvRef: '1 Samuel 9:1-14', pericope: 'Saul Sent to Find Donkeys' },
        { ref: '9:15-27', esvRef: '1 Samuel 9:15-27', pericope: 'Samuel and Saul Meet' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-16', esvRef: '1 Samuel 10:1-16', pericope: 'Samuel Anoints Saul' },
        { ref: '10:17-27', esvRef: '1 Samuel 10:17-27', pericope: 'Saul Chosen as King' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-15', esvRef: '1 Samuel 11:1-15', pericope: 'Saul Defeats the Ammonites' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-25', esvRef: '1 Samuel 12:1-25', pericope: "Samuel's Farewell Address" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-14', esvRef: '1 Samuel 13:1-14', pericope: "Saul's Unlawful Sacrifice" },
        { ref: '13:15-23', esvRef: '1 Samuel 13:15-23', pericope: "Saul's Army Depleted" },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-23', esvRef: '1 Samuel 14:1-23', pericope: "Jonathan's Daring Attack" },
        { ref: '14:24-46', esvRef: '1 Samuel 14:24-46', pericope: "Saul's Rash Oath" },
        { ref: '14:47-52', esvRef: '1 Samuel 14:47-52', pericope: "Saul's Reign and Family" },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-9', esvRef: '1 Samuel 15:1-9', pericope: 'Saul Defeats the Amalekites' },
        { ref: '15:10-35', esvRef: '1 Samuel 15:10-35', pericope: 'Saul Rejected as King' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-13', esvRef: '1 Samuel 16:1-13', pericope: 'Samuel Anoints David' },
        { ref: '16:14-23', esvRef: '1 Samuel 16:14-23', pericope: 'David Serves Saul' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-30', esvRef: '1 Samuel 17:1-30', pericope: 'David and Goliath Meet' },
        { ref: '17:31-58', esvRef: '1 Samuel 17:31-58', pericope: 'David Defeats Goliath' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-16', esvRef: '1 Samuel 18:1-16', pericope: "David's Popularity; Saul's Jealousy" },
        { ref: '18:17-30', esvRef: '1 Samuel 18:17-30', pericope: 'David Marries Michal' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-17', esvRef: '1 Samuel 19:1-17', pericope: 'Saul Tries to Kill David' },
        { ref: '19:18-24', esvRef: '1 Samuel 19:18-24', pericope: 'David Flees to Samuel' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-23', esvRef: '1 Samuel 20:1-23', pericope: "Jonathan's Covenant with David" },
        { ref: '20:24-42', esvRef: '1 Samuel 20:24-42', pericope: 'Jonathan Warns David' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-9', esvRef: '1 Samuel 21:1-9', pericope: 'David and the Holy Bread' },
        { ref: '21:10-15', esvRef: '1 Samuel 21:10-15', pericope: 'David Flees to Achish' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-5', esvRef: '1 Samuel 22:1-5', pericope: "David's Men at Adullam" },
        { ref: '22:6-23', esvRef: '1 Samuel 22:6-23', pericope: 'Saul Massacres the Priests' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-14', esvRef: '1 Samuel 23:1-14', pericope: 'David Saves Keilah' },
        { ref: '23:15-29', esvRef: '1 Samuel 23:15-29', pericope: 'Jonathan Visits David; Saul Pursues' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-22', esvRef: '1 Samuel 24:1-22', pericope: "David Spares Saul's Life" },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-17', esvRef: '1 Samuel 25:1-17', pericope: "Nabal Refuses David; Abigail's Wisdom" },
        { ref: '25:18-44', esvRef: '1 Samuel 25:18-44', pericope: 'Abigail Comes to David' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-25', esvRef: '1 Samuel 26:1-25', pericope: 'David Spares Saul Again' },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-12', esvRef: '1 Samuel 27:1-12', pericope: 'David Among the Philistines' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-25', esvRef: '1 Samuel 28:1-25', pericope: 'Saul and the Medium at Endor' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-11', esvRef: '1 Samuel 29:1-11', pericope: 'David Dismissed from the Philistine Army' },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-20', esvRef: '1 Samuel 30:1-20', pericope: 'David Defeats the Amalekites' },
        { ref: '30:21-31', esvRef: '1 Samuel 30:21-31', pericope: 'The Division of the Spoil' },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-13', esvRef: '1 Samuel 31:1-13', pericope: 'The Death of Saul and His Sons' },
      ]},
    ]
  },
  {
    id: '2-samuel',
    name: '2 Samuel',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-16', esvRef: '2 Samuel 1:1-16', pericope: "David Told of Saul's Death" },
        { ref: '1:17-27', esvRef: '2 Samuel 1:17-27', pericope: 'David\'s Lament for Saul and Jonathan' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: '2 Samuel 2:1-11', pericope: 'David Anointed King over Judah' },
        { ref: '2:12-32', esvRef: '2 Samuel 2:12-32', pericope: 'War Between the Houses of Saul and David' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-21', esvRef: '2 Samuel 3:1-21', pericope: 'Abner Joins David' },
        { ref: '3:22-39', esvRef: '2 Samuel 3:22-39', pericope: 'The Death of Abner' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-12', esvRef: '2 Samuel 4:1-12', pericope: "Ish-bosheth Killed; David's Response" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-16', esvRef: '2 Samuel 5:1-16', pericope: 'David Anointed King over All Israel; The Capture of Jerusalem' },
        { ref: '5:17-25', esvRef: '2 Samuel 5:17-25', pericope: 'David Defeats the Philistines' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-15', esvRef: '2 Samuel 6:1-15', pericope: 'David Brings the Ark to Jerusalem' },
        { ref: '6:16-23', esvRef: '2 Samuel 6:16-23', pericope: 'Michal Despises David' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-17', esvRef: '2 Samuel 7:1-17', pericope: "God's Covenant with David" },
        { ref: '7:18-29', esvRef: '2 Samuel 7:18-29', pericope: "David's Prayer" },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-18', esvRef: '2 Samuel 8:1-18', pericope: "David's Military Victories" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-13', esvRef: '2 Samuel 9:1-13', pericope: "David's Kindness to Mephibosheth" },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-19', esvRef: '2 Samuel 10:1-19', pericope: 'War with the Ammonites and Syrians' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-13', esvRef: '2 Samuel 11:1-13', pericope: 'David and Bathsheba' },
        { ref: '11:14-27', esvRef: '2 Samuel 11:14-27', pericope: 'The Death of Uriah' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-15', esvRef: '2 Samuel 12:1-15', pericope: 'Nathan Rebukes David' },
        { ref: '12:16-31', esvRef: '2 Samuel 12:16-31', pericope: "The Death of David's Son; Solomon Born; Rabbah Captured" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-22', esvRef: '2 Samuel 13:1-22', pericope: 'Amnon and Tamar' },
        { ref: '13:23-39', esvRef: '2 Samuel 13:23-39', pericope: "Absalom's Revenge; Absalom Flees" },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-33', esvRef: '2 Samuel 14:1-33', pericope: 'Joab Brings Absalom Back' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-12', esvRef: '2 Samuel 15:1-12', pericope: "Absalom's Conspiracy" },
        { ref: '15:13-37', esvRef: '2 Samuel 15:13-37', pericope: 'David Flees Jerusalem' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-14', esvRef: '2 Samuel 16:1-14', pericope: 'Shimei Curses David' },
        { ref: '16:15-23', esvRef: '2 Samuel 16:15-23', pericope: 'Hushai and Ahithophel with Absalom' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-23', esvRef: '2 Samuel 17:1-23', pericope: "Hushai Foils Ahithophel's Counsel" },
        { ref: '17:24-29', esvRef: '2 Samuel 17:24-29', pericope: 'David at Mahanaim' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-18', esvRef: '2 Samuel 18:1-18', pericope: 'The Defeat and Death of Absalom' },
        { ref: '18:19-33', esvRef: '2 Samuel 18:19-33', pericope: 'David Mourns for Absalom' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-15', esvRef: '2 Samuel 19:1-15', pericope: 'Joab Urges David to Return' },
        { ref: '19:16-43', esvRef: '2 Samuel 19:16-43', pericope: 'David Returns to Jerusalem' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-22', esvRef: '2 Samuel 20:1-22', pericope: "Sheba's Rebellion" },
        { ref: '20:23-26', esvRef: '2 Samuel 20:23-26', pericope: "David's Officials" },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-14', esvRef: '2 Samuel 21:1-14', pericope: "The Gibeonites' Revenge" },
        { ref: '21:15-22', esvRef: '2 Samuel 21:15-22', pericope: 'War with the Philistines' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-51', esvRef: '2 Samuel 22:1-51', pericope: "David's Song of Deliverance" },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-7', esvRef: '2 Samuel 23:1-7', pericope: "David's Last Words" },
        { ref: '23:8-39', esvRef: '2 Samuel 23:8-39', pericope: "David's Mighty Men" },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-17', esvRef: '2 Samuel 24:1-17', pericope: "David's Census and Its Punishment" },
        { ref: '24:18-25', esvRef: '2 Samuel 24:18-25', pericope: 'David Builds an Altar' },
      ]},
    ]
  },
  {
    id: '1-kings',
    name: '1 Kings',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-27', esvRef: '1 Kings 1:1-27', pericope: "Adonijah's Claim to the Throne" },
        { ref: '1:28-53', esvRef: '1 Kings 1:28-53', pericope: 'Solomon Anointed King' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12', esvRef: '1 Kings 2:1-12', pericope: "David's Charge to Solomon; David's Death" },
        { ref: '2:13-46', esvRef: '1 Kings 2:13-46', pericope: "Solomon's Kingdom Established" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: '1 Kings 3:1-15', pericope: "Solomon's Request for Wisdom" },
        { ref: '3:16-28', esvRef: '1 Kings 3:16-28', pericope: "Solomon's Wisdom: Two Mothers" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-34', esvRef: '1 Kings 4:1-34', pericope: "Solomon's Officials and Administration" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-18', esvRef: '1 Kings 5:1-18', pericope: 'Preparations for Building the Temple' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-38', esvRef: '1 Kings 6:1-38', pericope: 'Solomon Builds the Temple' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-12', esvRef: '1 Kings 7:1-12', pericope: "Solomon's Palace" },
        { ref: '7:13-51', esvRef: '1 Kings 7:13-51', pericope: 'The Temple Furnishings' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-21', esvRef: '1 Kings 8:1-21', pericope: 'The Ark Brought into the Temple' },
        { ref: '8:22-53', esvRef: '1 Kings 8:22-53', pericope: "Solomon's Prayer of Dedication" },
        { ref: '8:54-66', esvRef: '1 Kings 8:54-66', pericope: 'Solomon Blesses the People' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-9', esvRef: '1 Kings 9:1-9', pericope: 'God Appears to Solomon Again' },
        { ref: '9:10-28', esvRef: '1 Kings 9:10-28', pericope: "Solomon's Other Activities" },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-13', esvRef: '1 Kings 10:1-13', pericope: 'The Queen of Sheba Visits Solomon' },
        { ref: '10:14-29', esvRef: '1 Kings 10:14-29', pericope: "Solomon's Wealth and Splendor" },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-13', esvRef: '1 Kings 11:1-13', pericope: "Solomon's Wives and Idolatry" },
        { ref: '11:14-40', esvRef: '1 Kings 11:14-40', pericope: 'Adversaries and Jeroboam' },
        { ref: '11:41-43', esvRef: '1 Kings 11:41-43', pericope: 'The Death of Solomon' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-24', esvRef: '1 Kings 12:1-24', pericope: 'The Kingdom Divided' },
        { ref: '12:25-33', esvRef: '1 Kings 12:25-33', pericope: "Jeroboam's Golden Calves" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-34', esvRef: '1 Kings 13:1-34', pericope: 'A Man of God from Judah; The Old Prophet' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-20', esvRef: '1 Kings 14:1-20', pericope: 'The Word Against Jeroboam' },
        { ref: '14:21-31', esvRef: '1 Kings 14:21-31', pericope: 'Rehoboam Reigns over Judah' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-24', esvRef: '1 Kings 15:1-24', pericope: 'Abijam and Asa Reign over Judah' },
        { ref: '15:25-34', esvRef: '1 Kings 15:25-34', pericope: 'Nadab and Baasha Reign over Israel' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-28', esvRef: '1 Kings 16:1-28', pericope: 'Kings of Israel: Baasha Through Omri' },
        { ref: '16:29-34', esvRef: '1 Kings 16:29-34', pericope: 'Ahab Reigns over Israel' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-7', esvRef: '1 Kings 17:1-7', pericope: 'Elijah Fed by Ravens' },
        { ref: '17:8-24', esvRef: '1 Kings 17:8-24', pericope: 'The Widow of Zarephath' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-19', esvRef: '1 Kings 18:1-19', pericope: 'Elijah and Obadiah' },
        { ref: '18:20-40', esvRef: '1 Kings 18:20-40', pericope: 'Elijah and the Prophets of Baal' },
        { ref: '18:41-46', esvRef: '1 Kings 18:41-46', pericope: 'The Rain Returns' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-14', esvRef: '1 Kings 19:1-14', pericope: 'Elijah Flees to Horeb' },
        { ref: '19:15-21', esvRef: '1 Kings 19:15-21', pericope: 'Elijah Commissions Elisha' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-43', esvRef: '1 Kings 20:1-43', pericope: "Ahab's Wars with Syria" },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-29', esvRef: '1 Kings 21:1-29', pericope: "Naboth's Vineyard" },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-28', esvRef: '1 Kings 22:1-28', pericope: 'Ahab and Micaiah the Prophet' },
        { ref: '22:29-53', esvRef: '1 Kings 22:29-53', pericope: 'The Death of Ahab; Jehoshaphat and Ahaziah' },
      ]},
    ]
  },
  {
    id: '2-kings',
    name: '2 Kings',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-18', esvRef: '2 Kings 1:1-18', pericope: 'Elijah and Ahaziah' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-18', esvRef: '2 Kings 2:1-18', pericope: 'Elijah Taken Up to Heaven; Elisha Begins His Ministry' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-27', esvRef: '2 Kings 3:1-27', pericope: 'Moab Rebels Against Israel' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-7', esvRef: '2 Kings 4:1-7', pericope: "Elisha and the Widow's Oil" },
        { ref: '4:8-37', esvRef: '2 Kings 4:8-37', pericope: 'The Shunammite Woman and Her Son' },
        { ref: '4:38-44', esvRef: '2 Kings 4:38-44', pericope: 'Elisha Purifies Food; Feeds a Hundred' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-19', esvRef: '2 Kings 5:1-19', pericope: "Naaman Healed of Leprosy" },
        { ref: '5:20-27', esvRef: '2 Kings 5:20-27', pericope: "Gehazi's Greed" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-7', esvRef: '2 Kings 6:1-7', pericope: 'The Floating Axe Head' },
        { ref: '6:8-23', esvRef: '2 Kings 6:8-23', pericope: "Elisha Captures the Syrians" },
        { ref: '6:24-33', esvRef: '2 Kings 6:24-33', pericope: 'The Siege of Samaria' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-20', esvRef: '2 Kings 7:1-20', pericope: "Elisha's Prophecy; The Siege Lifted" },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-6', esvRef: '2 Kings 8:1-6', pericope: 'The Shunammite Woman and the King' },
        { ref: '8:7-29', esvRef: '2 Kings 8:7-29', pericope: 'Hazael Becomes King of Syria; Kings of Judah' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-29', esvRef: '2 Kings 9:1-29', pericope: 'Jehu Anointed King; Joram and Ahaziah Killed' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-17', esvRef: '2 Kings 10:1-17', pericope: "Jehu Destroys Ahab's Family" },
        { ref: '10:18-36', esvRef: '2 Kings 10:18-36', pericope: 'Jehu Destroys Baal Worship' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-21', esvRef: '2 Kings 11:1-21', pericope: "Athaliah and Joash; Athaliah's Death" },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-21', esvRef: '2 Kings 12:1-21', pericope: 'Joash Repairs the Temple; His Death' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-25', esvRef: '2 Kings 13:1-25', pericope: "Jehoahaz and Jehoash Reign; Elisha's Death" },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-29', esvRef: '2 Kings 14:1-29', pericope: 'Amaziah Reigns over Judah; Jeroboam II over Israel' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-38', esvRef: '2 Kings 15:1-38', pericope: 'Kings of Israel and Judah' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-20', esvRef: '2 Kings 16:1-20', pericope: 'Ahaz Reigns over Judah' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-23', esvRef: '2 Kings 17:1-23', pericope: 'Israel Exiled to Assyria' },
        { ref: '17:24-41', esvRef: '2 Kings 17:24-41', pericope: 'Assyria Resettles Samaria' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-12', esvRef: '2 Kings 18:1-12', pericope: 'Hezekiah Reigns over Judah' },
        { ref: '18:13-37', esvRef: '2 Kings 18:13-37', pericope: 'Sennacherib Threatens Jerusalem' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-19', esvRef: '2 Kings 19:1-19', pericope: "Hezekiah's Prayer" },
        { ref: '19:20-37', esvRef: '2 Kings 19:20-37', pericope: "The Lord's Word Through Isaiah; Sennacherib Slain" },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-11', esvRef: '2 Kings 20:1-11', pericope: "Hezekiah's Illness and Recovery" },
        { ref: '20:12-21', esvRef: '2 Kings 20:12-21', pericope: 'Babylonian Envoys; Isaiah Prophesies Captivity' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-18', esvRef: '2 Kings 21:1-18', pericope: 'Manasseh Reigns over Judah' },
        { ref: '21:19-26', esvRef: '2 Kings 21:19-26', pericope: 'Amon Reigns over Judah' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-13', esvRef: '2 Kings 22:1-13', pericope: 'Josiah Finds the Book of the Law' },
        { ref: '22:14-20', esvRef: '2 Kings 22:14-20', pericope: 'Huldah the Prophetess' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-25', esvRef: '2 Kings 23:1-25', pericope: "Josiah's Reforms" },
        { ref: '23:26-37', esvRef: '2 Kings 23:26-37', pericope: "Josiah's Death; Jehoahaz and Jehoiakim" },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-20', esvRef: '2 Kings 24:1-20', pericope: 'Jehoiakim and Jehoiachin Reign; First Deportation' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-21', esvRef: '2 Kings 25:1-21', pericope: 'The Fall of Jerusalem' },
        { ref: '25:22-30', esvRef: '2 Kings 25:22-30', pericope: 'Gedaliah Made Governor; Jehoiachin Released' },
      ]},
    ]
  },
  {
    id: '1-chronicles',
    name: '1 Chronicles',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [{ ref: '1:1-54', esvRef: '1 Chronicles 1:1-54', pericope: 'Genealogies from Adam to Esau' }] },
      { ch: 2, chunks: [{ ref: '2:1-55', esvRef: '1 Chronicles 2:1-55', pericope: "The Sons of Israel; Judah's Line" }] },
      { ch: 3, chunks: [{ ref: '3:1-24', esvRef: '1 Chronicles 3:1-24', pericope: "David's Sons; Royal Line After the Exile" }] },
      { ch: 4, chunks: [{ ref: '4:1-43', esvRef: '1 Chronicles 4:1-43', pericope: 'Genealogies of Judah and Simeon' }] },
      { ch: 5, chunks: [{ ref: '5:1-26', esvRef: '1 Chronicles 5:1-26', pericope: 'Genealogies of Reuben, Gad, and Manasseh' }] },
      { ch: 6, chunks: [{ ref: '6:1-81', esvRef: '1 Chronicles 6:1-81', pericope: "The Tribe of Levi; The Levites' Cities" }] },
      { ch: 7, chunks: [{ ref: '7:1-40', esvRef: '1 Chronicles 7:1-40', pericope: 'Genealogies of Issachar, Benjamin, Naphtali, Ephraim, and Asher' }] },
      { ch: 8, chunks: [{ ref: '8:1-40', esvRef: '1 Chronicles 8:1-40', pericope: "The Genealogy of Benjamin; Saul's Line" }] },
      { ch: 9, chunks: [
        { ref: '9:1-34', esvRef: '1 Chronicles 9:1-34', pericope: 'The People Who Returned to Jerusalem' },
        { ref: '9:35-44', esvRef: '1 Chronicles 9:35-44', pericope: "Saul's Genealogy" },
      ]},
      { ch: 10, chunks: [{ ref: '10:1-14', esvRef: '1 Chronicles 10:1-14', pericope: 'The Death of Saul' }] },
      { ch: 11, chunks: [
        { ref: '11:1-9', esvRef: '1 Chronicles 11:1-9', pericope: 'David Becomes King; The Capture of Jerusalem' },
        { ref: '11:10-47', esvRef: '1 Chronicles 11:10-47', pericope: "David's Mighty Men" },
      ]},
      { ch: 12, chunks: [{ ref: '12:1-40', esvRef: '1 Chronicles 12:1-40', pericope: "David's Warriors at Ziklag and Hebron" }] },
      { ch: 13, chunks: [{ ref: '13:1-14', esvRef: '1 Chronicles 13:1-14', pericope: 'The Ark Moved from Kiriath-jearim' }] },
      { ch: 14, chunks: [{ ref: '14:1-17', esvRef: '1 Chronicles 14:1-17', pericope: "David's House; Victories over the Philistines" }] },
      { ch: 15, chunks: [{ ref: '15:1-29', esvRef: '1 Chronicles 15:1-29', pericope: 'The Ark Brought to Jerusalem' }] },
      { ch: 16, chunks: [
        { ref: '16:1-36', esvRef: '1 Chronicles 16:1-36', pericope: 'The Ark Installed; Psalm of Thanksgiving' },
        { ref: '16:37-43', esvRef: '1 Chronicles 16:37-43', pericope: 'Regular Ministry Before the Ark' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-15', esvRef: '1 Chronicles 17:1-15', pericope: "God's Covenant with David" },
        { ref: '17:16-27', esvRef: '1 Chronicles 17:16-27', pericope: "David's Prayer" },
      ]},
      { ch: 18, chunks: [{ ref: '18:1-17', esvRef: '1 Chronicles 18:1-17', pericope: "David's Military Victories" }] },
      { ch: 19, chunks: [{ ref: '19:1-19', esvRef: '1 Chronicles 19:1-19', pericope: 'War with the Ammonites and Syrians' }] },
      { ch: 20, chunks: [{ ref: '20:1-8', esvRef: '1 Chronicles 20:1-8', pericope: 'Rabbah Captured; War with Philistines' }] },
      { ch: 21, chunks: [
        { ref: '21:1-17', esvRef: '1 Chronicles 21:1-17', pericope: "David's Census and Its Punishment" },
        { ref: '21:18-30', esvRef: '1 Chronicles 21:18-30', pericope: 'David Builds an Altar' },
      ]},
      { ch: 22, chunks: [{ ref: '22:1-19', esvRef: '1 Chronicles 22:1-19', pericope: "David Prepares Materials for the Temple; Solomon's Charge" }] },
      { ch: 23, chunks: [{ ref: '23:1-32', esvRef: '1 Chronicles 23:1-32', pericope: 'David Organizes the Levites' }] },
      { ch: 24, chunks: [{ ref: '24:1-31', esvRef: '1 Chronicles 24:1-31', pericope: "The Divisions of the Priests and Levites" }] },
      { ch: 25, chunks: [{ ref: '25:1-31', esvRef: '1 Chronicles 25:1-31', pericope: 'The Musicians' }] },
      { ch: 26, chunks: [{ ref: '26:1-32', esvRef: '1 Chronicles 26:1-32', pericope: 'The Gatekeepers; Other Officials' }] },
      { ch: 27, chunks: [{ ref: '27:1-34', esvRef: '1 Chronicles 27:1-34', pericope: "David's Army and Officials" }] },
      { ch: 28, chunks: [{ ref: '28:1-21', esvRef: '1 Chronicles 28:1-21', pericope: "David's Instructions to Solomon; The Temple Plans" }] },
      { ch: 29, chunks: [
        { ref: '29:1-20', esvRef: '1 Chronicles 29:1-20', pericope: "Gifts for the Temple; David's Praise" },
        { ref: '29:21-30', esvRef: '1 Chronicles 29:21-30', pericope: "Solomon Anointed King; David's Death" },
      ]},
    ]
  },
  {
    id: '2-chronicles',
    name: '2 Chronicles',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [{ ref: '1:1-17', esvRef: '2 Chronicles 1:1-17', pericope: "Solomon's Request for Wisdom; His Wealth" }] },
      { ch: 2, chunks: [{ ref: '2:1-18', esvRef: '2 Chronicles 2:1-18', pericope: 'Preparations for Building the Temple' }] },
      { ch: 3, chunks: [{ ref: '3:1-17', esvRef: '2 Chronicles 3:1-17', pericope: 'Solomon Builds the Temple' }] },
      { ch: 4, chunks: [{ ref: '4:1-22', esvRef: '2 Chronicles 4:1-22', pericope: 'The Temple Furnishings' }] },
      { ch: 5, chunks: [{ ref: '5:1-14', esvRef: '2 Chronicles 5:1-14', pericope: 'The Ark Brought into the Temple' }] },
      { ch: 6, chunks: [{ ref: '6:1-42', esvRef: '2 Chronicles 6:1-42', pericope: "Solomon's Prayer of Dedication" }] },
      { ch: 7, chunks: [
        { ref: '7:1-10', esvRef: '2 Chronicles 7:1-10', pericope: "Fire from Heaven; The Lord's Blessing" },
        { ref: '7:11-22', esvRef: '2 Chronicles 7:11-22', pericope: "God's Covenant with Solomon" },
      ]},
      { ch: 8, chunks: [{ ref: '8:1-18', esvRef: '2 Chronicles 8:1-18', pericope: "Solomon's Other Activities" }] },
      { ch: 9, chunks: [
        { ref: '9:1-12', esvRef: '2 Chronicles 9:1-12', pericope: 'The Queen of Sheba' },
        { ref: '9:13-31', esvRef: '2 Chronicles 9:13-31', pericope: "Solomon's Wealth; His Death" },
      ]},
      { ch: 10, chunks: [{ ref: '10:1-19', esvRef: '2 Chronicles 10:1-19', pericope: 'The Kingdom Divided' }] },
      { ch: 11, chunks: [{ ref: '11:1-23', esvRef: '2 Chronicles 11:1-23', pericope: "Rehoboam's Rule; The Priests and Levites" }] },
      { ch: 12, chunks: [{ ref: '12:1-16', esvRef: '2 Chronicles 12:1-16', pericope: "Shishak Invades; Rehoboam's Death" }] },
      { ch: 13, chunks: [{ ref: '13:1-22', esvRef: '2 Chronicles 13:1-22', pericope: "Abijah's Reign and Victory over Jeroboam" }] },
      { ch: 14, chunks: [{ ref: '14:1-15', esvRef: '2 Chronicles 14:1-15', pericope: "Asa's Reforms; Victory over Ethiopia" }] },
      { ch: 15, chunks: [{ ref: '15:1-19', esvRef: '2 Chronicles 15:1-19', pericope: "Asa's Further Reforms" }] },
      { ch: 16, chunks: [{ ref: '16:1-14', esvRef: '2 Chronicles 16:1-14', pericope: "Asa's Alliance with Syria; His Death" }] },
      { ch: 17, chunks: [{ ref: '17:1-19', esvRef: '2 Chronicles 17:1-19', pericope: "Jehoshaphat's Strength and Righteousness" }] },
      { ch: 18, chunks: [{ ref: '18:1-34', esvRef: '2 Chronicles 18:1-34', pericope: 'Micaiah Prophesies; Ahab Killed' }] },
      { ch: 19, chunks: [{ ref: '19:1-11', esvRef: '2 Chronicles 19:1-11', pericope: "Jehoshaphat Appoints Judges" }] },
      { ch: 20, chunks: [
        { ref: '20:1-30', esvRef: '2 Chronicles 20:1-30', pericope: "Jehoshaphat's Prayer; Miraculous Victory" },
        { ref: '20:31-37', esvRef: '2 Chronicles 20:31-37', pericope: "Jehoshaphat's Death" },
      ]},
      { ch: 21, chunks: [{ ref: '21:1-20', esvRef: '2 Chronicles 21:1-20', pericope: "Jehoram's Wicked Reign; His Death" }] },
      { ch: 22, chunks: [{ ref: '22:1-12', esvRef: '2 Chronicles 22:1-12', pericope: "Ahaziah's Reign; Athaliah Seizes Power" }] },
      { ch: 23, chunks: [{ ref: '23:1-21', esvRef: '2 Chronicles 23:1-21', pericope: "Joash Made King; Athaliah's Death" }] },
      { ch: 24, chunks: [
        { ref: '24:1-16', esvRef: '2 Chronicles 24:1-16', pericope: 'Joash Repairs the Temple' },
        { ref: '24:17-27', esvRef: '2 Chronicles 24:17-27', pericope: "Joash's Apostasy; His Death" },
      ]},
      { ch: 25, chunks: [{ ref: '25:1-28', esvRef: '2 Chronicles 25:1-28', pericope: "Amaziah's Reign; His Victory and Defeat" }] },
      { ch: 26, chunks: [{ ref: '26:1-23', esvRef: '2 Chronicles 26:1-23', pericope: "Uzziah's Reign; His Pride and Leprosy" }] },
      { ch: 27, chunks: [{ ref: '27:1-9', esvRef: '2 Chronicles 27:1-9', pericope: "Jotham's Reign" }] },
      { ch: 28, chunks: [{ ref: '28:1-27', esvRef: '2 Chronicles 28:1-27', pericope: "Ahaz's Wicked Reign" }] },
      { ch: 29, chunks: [{ ref: '29:1-36', esvRef: '2 Chronicles 29:1-36', pericope: "Hezekiah Cleanses the Temple" }] },
      { ch: 30, chunks: [{ ref: '30:1-27', esvRef: '2 Chronicles 30:1-27', pericope: "Hezekiah's Passover" }] },
      { ch: 31, chunks: [{ ref: '31:1-21', esvRef: '2 Chronicles 31:1-21', pericope: "Hezekiah's Further Reforms" }] },
      { ch: 32, chunks: [
        { ref: '32:1-23', esvRef: '2 Chronicles 32:1-23', pericope: "Sennacherib's Invasion; Hezekiah's Faith" },
        { ref: '32:24-33', esvRef: '2 Chronicles 32:24-33', pericope: "Hezekiah's Pride and Death" },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-20', esvRef: '2 Chronicles 33:1-20', pericope: "Manasseh's Wickedness and Repentance" },
        { ref: '33:21-25', esvRef: '2 Chronicles 33:21-25', pericope: "Amon's Wicked Reign" },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-13', esvRef: '2 Chronicles 34:1-13', pericope: "Josiah's Reforms" },
        { ref: '34:14-33', esvRef: '2 Chronicles 34:14-33', pericope: 'The Book of the Law Found; Covenant Renewed' },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-19', esvRef: '2 Chronicles 35:1-19', pericope: "Josiah's Passover" },
        { ref: '35:20-27', esvRef: '2 Chronicles 35:20-27', pericope: "Josiah's Death" },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-21', esvRef: '2 Chronicles 36:1-21', pericope: 'The Last Kings; The Fall of Jerusalem' },
        { ref: '36:22-23', esvRef: '2 Chronicles 36:22-23', pericope: "Cyrus's Decree" },
      ]},
    ]
  },
  {
    id: 'ezra',
    name: 'Ezra',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: 'Ezra 1:1-11', pericope: "Cyrus's Decree; The Return Begins" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-70', esvRef: 'Ezra 2:1-70', pericope: 'The List of Returned Exiles' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-13', esvRef: 'Ezra 3:1-13', pericope: 'Rebuilding the Altar; Foundation of the Temple Laid' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-24', esvRef: 'Ezra 4:1-24', pericope: 'Opposition to the Rebuilding' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-17', esvRef: 'Ezra 5:1-17', pericope: 'Rebuilding Resumes; Letter to Darius' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-22', esvRef: 'Ezra 6:1-22', pericope: "Darius's Decree; The Temple Completed and Dedicated" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-28', esvRef: 'Ezra 7:1-28', pericope: "Ezra Goes to Jerusalem; Artaxerxes's Letter" },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-36', esvRef: 'Ezra 8:1-36', pericope: "Ezra's Company Returns; Arrival in Jerusalem" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-15', esvRef: 'Ezra 9:1-15', pericope: "Ezra's Prayer About Intermarriage" },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-17', esvRef: 'Ezra 10:1-17', pericope: "The People's Repentance; Foreign Wives Put Away" },
        { ref: '10:18-44', esvRef: 'Ezra 10:18-44', pericope: 'The List of Those Who Had Married Foreign Women' },
      ]},
    ]
  },
  {
    id: 'nehemiah',
    name: 'Nehemiah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: 'Nehemiah 1:1-11', pericope: "Nehemiah's Prayer" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-10', esvRef: 'Nehemiah 2:1-10', pericope: "Nehemiah Goes to Jerusalem" },
        { ref: '2:11-20', esvRef: 'Nehemiah 2:11-20', pericope: 'Nehemiah Inspects the Walls' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-32', esvRef: 'Nehemiah 3:1-32', pericope: 'The Builders of the Wall' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-23', esvRef: 'Nehemiah 4:1-23', pericope: 'Opposition and Defense' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-19', esvRef: 'Nehemiah 5:1-19', pericope: "Nehemiah Addresses Economic Injustice; His Generosity" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-19', esvRef: 'Nehemiah 6:1-19', pericope: "Plots Against Nehemiah; The Wall Completed" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-73', esvRef: 'Nehemiah 7:1-73', pericope: 'Lists of Returned Exiles' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-18', esvRef: 'Nehemiah 8:1-18', pericope: 'Ezra Reads the Law; The Feast of Booths' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-37', esvRef: 'Nehemiah 9:1-37', pericope: "The People's Confession of Sin" },
        { ref: '9:38', esvRef: 'Nehemiah 9:38', pericope: 'A Firm Covenant' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-39', esvRef: 'Nehemiah 10:1-39', pericope: 'Those Who Sealed the Covenant; The Obligations' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-36', esvRef: 'Nehemiah 11:1-36', pericope: 'The People Who Settled in Jerusalem' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-26', esvRef: 'Nehemiah 12:1-26', pericope: 'Lists of Priests and Levites' },
        { ref: '12:27-47', esvRef: 'Nehemiah 12:27-47', pericope: 'Dedication of the Wall' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-31', esvRef: 'Nehemiah 13:1-31', pericope: "Nehemiah's Final Reforms" },
      ]},
    ]
  },
  {
    id: 'esther',
    name: 'Esther',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-9', esvRef: 'Esther 1:1-9', pericope: "Queen Vashti's Feast" },
        { ref: '1:10-22', esvRef: 'Esther 1:10-22', pericope: 'Queen Vashti Removed' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: 'Esther 2:1-11', pericope: 'Esther Brought to the King' },
        { ref: '2:12-23', esvRef: 'Esther 2:12-23', pericope: 'Esther Becomes Queen; Mordecai Uncovers a Plot' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: 'Esther 3:1-15', pericope: "Haman's Plot to Destroy the Jews" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-17', esvRef: 'Esther 4:1-17', pericope: 'Esther Agrees to Help' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-14', esvRef: 'Esther 5:1-14', pericope: "Esther's Banquet; Haman's Plot Against Mordecai" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-14', esvRef: 'Esther 6:1-14', pericope: 'Mordecai Is Honored' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-10', esvRef: 'Esther 7:1-10', pericope: 'Haman Is Hanged' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-17', esvRef: 'Esther 8:1-17', pericope: 'Esther Saves the Jews' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-19', esvRef: 'Esther 9:1-19', pericope: 'The Jews Destroy Their Enemies' },
        { ref: '9:20-32', esvRef: 'Esther 9:20-32', pericope: 'The Feast of Purim' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-3', esvRef: 'Esther 10:1-3', pericope: 'The Greatness of Mordecai' },
      ]},
    ]
  },
  {
    id: 'job',
    name: 'Job',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-5', esvRef: 'Job 1:1-5', pericope: "Job's Character and Wealth" },
        { ref: '1:6-22', esvRef: 'Job 1:6-22', pericope: "Job's First Test" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-10', esvRef: 'Job 2:1-10', pericope: "Job's Second Test" },
        { ref: '2:11-13', esvRef: 'Job 2:11-13', pericope: "Job's Three Friends Arrive" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-26', esvRef: 'Job 3:1-26', pericope: "Job's Lament" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-21', esvRef: 'Job 4:1-21', pericope: "Eliphaz's First Speech" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-27', esvRef: 'Job 5:1-27', pericope: 'Eliphaz Continues' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-30', esvRef: 'Job 6:1-30', pericope: "Job's Reply to Eliphaz" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-21', esvRef: 'Job 7:1-21', pericope: 'Job Continues His Reply' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-22', esvRef: 'Job 8:1-22', pericope: "Bildad's First Speech" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-35', esvRef: 'Job 9:1-35', pericope: "Job's Reply to Bildad" },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-22', esvRef: 'Job 10:1-22', pericope: 'Job Continues' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-20', esvRef: 'Job 11:1-20', pericope: "Zophar's First Speech" },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-25', esvRef: 'Job 12:1-25', pericope: "Job's Reply to Zophar" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-28', esvRef: 'Job 13:1-28', pericope: 'Job Continues; Job Will Defend Himself Before God' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-22', esvRef: 'Job 14:1-22', pericope: 'Job Reflects on Human Mortality' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-35', esvRef: 'Job 15:1-35', pericope: "Eliphaz's Second Speech" },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-22', esvRef: 'Job 16:1-22', pericope: "Job's Reply to Eliphaz" },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-16', esvRef: 'Job 17:1-16', pericope: 'Job Continues' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-21', esvRef: 'Job 18:1-21', pericope: "Bildad's Second Speech" },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-29', esvRef: 'Job 19:1-29', pericope: "Job's Reply; I Know My Redeemer Lives" },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-29', esvRef: 'Job 20:1-29', pericope: "Zophar's Second Speech" },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-34', esvRef: 'Job 21:1-34', pericope: "Job's Reply to Zophar" },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-30', esvRef: 'Job 22:1-30', pericope: "Eliphaz's Third Speech" },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-17', esvRef: 'Job 23:1-17', pericope: "Job's Reply; God Is There but Hidden" },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-25', esvRef: 'Job 24:1-25', pericope: 'Job Continues; The Wicked Go Unpunished' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-6', esvRef: 'Job 25:1-6', pericope: "Bildad's Third Speech" },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-14', esvRef: 'Job 26:1-14', pericope: "Job's Reply to Bildad" },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-23', esvRef: 'Job 27:1-23', pericope: "Job's Final Monologue" },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-28', esvRef: 'Job 28:1-28', pericope: 'Where Is Wisdom Found?' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-25', esvRef: 'Job 29:1-25', pericope: "Job's Past Happiness" },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-31', esvRef: 'Job 30:1-31', pericope: "Job's Present Misery" },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-40', esvRef: 'Job 31:1-40', pericope: "Job's Final Defense" },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-22', esvRef: 'Job 32:1-22', pericope: 'Elihu Speaks' },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-33', esvRef: 'Job 33:1-33', pericope: "Elihu's First Address" },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-37', esvRef: 'Job 34:1-37', pericope: "Elihu's Second Address" },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-16', esvRef: 'Job 35:1-16', pericope: "Elihu's Third Address" },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-33', esvRef: 'Job 36:1-33', pericope: "Elihu's Fourth Address" },
      ]},
      { ch: 37, chunks: [
        { ref: '37:1-24', esvRef: 'Job 37:1-24', pericope: "Elihu Continues; God's Majesty in Creation" },
      ]},
      { ch: 38, chunks: [
        { ref: '38:1-41', esvRef: 'Job 38:1-41', pericope: 'The Lord Speaks from the Whirlwind' },
      ]},
      { ch: 39, chunks: [
        { ref: '39:1-30', esvRef: 'Job 39:1-30', pericope: 'The Lord Continues; The Animal Kingdom' },
      ]},
      { ch: 40, chunks: [
        { ref: '40:1-14', esvRef: 'Job 40:1-14', pericope: "Job's Response; The Lord's Challenge Continues" },
        { ref: '40:15-24', esvRef: 'Job 40:15-24', pericope: 'Behemoth' },
      ]},
      { ch: 41, chunks: [
        { ref: '41:1-34', esvRef: 'Job 41:1-34', pericope: 'Leviathan' },
      ]},
      { ch: 42, chunks: [
        { ref: '42:1-6', esvRef: 'Job 42:1-6', pericope: "Job's Repentance" },
        { ref: '42:7-17', esvRef: 'Job 42:7-17', pericope: 'Job Restored' },
      ]},
    ]
  },
  { id: 'psalms', name: 'Psalms', testament: 'OT', chapters: [
    { ch: 1, chunks: [{ ref: '1', esvRef: 'Psalm 1', pericope: 'The Way of the Righteous and the Wicked' }] },
    { ch: 2, chunks: [{ ref: '2', esvRef: 'Psalm 2', pericope: 'The Reign of the Lord\'s Anointed' }] },
    { ch: 3, chunks: [{ ref: '3', esvRef: 'Psalm 3', pericope: 'Save Me, O My God' }] },
    { ch: 4, chunks: [{ ref: '4', esvRef: 'Psalm 4', pericope: 'Answer Me When I Call' }] },
    { ch: 5, chunks: [{ ref: '5', esvRef: 'Psalm 5', pericope: 'Lead Me in Your Righteousness' }] },
    { ch: 6, chunks: [{ ref: '6', esvRef: 'Psalm 6', pericope: 'O Lord, Deliver My Life' }] },
    { ch: 7, chunks: [{ ref: '7', esvRef: 'Psalm 7', pericope: 'My Shield Is God Most High' }] },
    { ch: 8, chunks: [{ ref: '8', esvRef: 'Psalm 8', pericope: 'How Majestic Is Your Name' }] },
    { ch: 9, chunks: [{ ref: '9', esvRef: 'Psalm 9', pericope: 'I Will Recount Your Wonderful Deeds' }] },
    { ch: 10, chunks: [{ ref: '10', esvRef: 'Psalm 10', pericope: 'Why Do You Hide Yourself, O Lord?' }] },
    { ch: 11, chunks: [{ ref: '11', esvRef: 'Psalm 11', pericope: 'The Lord Is in His Holy Temple' }] },
    { ch: 12, chunks: [{ ref: '12', esvRef: 'Psalm 12', pericope: 'Save, O Lord, for the Godly One Is Gone' }] },
    { ch: 13, chunks: [{ ref: '13', esvRef: 'Psalm 13', pericope: 'How Long, O Lord?' }] },
    { ch: 14, chunks: [{ ref: '14', esvRef: 'Psalm 14', pericope: 'The Fool Says There Is No God' }] },
    { ch: 15, chunks: [{ ref: '15', esvRef: 'Psalm 15', pericope: 'Who Shall Dwell on Your Holy Hill?' }] },
    { ch: 16, chunks: [{ ref: '16', esvRef: 'Psalm 16', pericope: 'You Will Not Abandon My Soul' }] },
    { ch: 17, chunks: [{ ref: '17', esvRef: 'Psalm 17', pericope: 'In Your Righteousness Behold My Face' }] },
    { ch: 18, chunks: [{ ref: '18', esvRef: 'Psalm 18', pericope: 'I Love You, O Lord, My Strength' }] },
    { ch: 19, chunks: [{ ref: '19', esvRef: 'Psalm 19', pericope: 'The Heavens Declare the Glory of God' }] },
    { ch: 20, chunks: [{ ref: '20', esvRef: 'Psalm 20', pericope: 'May the Lord Answer You in the Day of Trouble' }] },
    { ch: 21, chunks: [{ ref: '21', esvRef: 'Psalm 21', pericope: 'The King Rejoices in Your Strength' }] },
    { ch: 22, chunks: [{ ref: '22', esvRef: 'Psalm 22', pericope: 'My God, My God, Why Have You Forsaken Me?' }] },
    { ch: 23, chunks: [{ ref: '23', esvRef: 'Psalm 23', pericope: 'The Lord Is My Shepherd' }] },
    { ch: 24, chunks: [{ ref: '24', esvRef: 'Psalm 24', pericope: 'The King of Glory' }] },
    { ch: 25, chunks: [{ ref: '25', esvRef: 'Psalm 25', pericope: 'To You, O Lord, I Lift Up My Soul' }] },
    { ch: 26, chunks: [{ ref: '26', esvRef: 'Psalm 26', pericope: 'Vindicate Me, O Lord' }] },
    { ch: 27, chunks: [{ ref: '27', esvRef: 'Psalm 27', pericope: 'The Lord Is My Light and My Salvation' }] },
    { ch: 28, chunks: [{ ref: '28', esvRef: 'Psalm 28', pericope: 'The Lord Is My Strength and My Shield' }] },
    { ch: 29, chunks: [{ ref: '29', esvRef: 'Psalm 29', pericope: 'Ascribe to the Lord Glory and Strength' }] },
    { ch: 30, chunks: [{ ref: '30', esvRef: 'Psalm 30', pericope: 'Weeping May Tarry for the Night' }] },
    { ch: 31, chunks: [{ ref: '31', esvRef: 'Psalm 31', pericope: 'In You, O Lord, Do I Take Refuge' }] },
    { ch: 32, chunks: [{ ref: '32', esvRef: 'Psalm 32', pericope: 'Blessed Is the One Whose Transgression Is Forgiven' }] },
    { ch: 33, chunks: [{ ref: '33', esvRef: 'Psalm 33', pericope: 'Shout for Joy in the Lord' }] },
    { ch: 34, chunks: [{ ref: '34', esvRef: 'Psalm 34', pericope: 'I Will Bless the Lord at All Times' }] },
    { ch: 35, chunks: [{ ref: '35', esvRef: 'Psalm 35', pericope: 'Contend, O Lord, with Those Who Contend with Me' }] },
    { ch: 36, chunks: [{ ref: '36', esvRef: 'Psalm 36', pericope: 'Your Steadfast Love, O Lord' }] },
    { ch: 37, chunks: [{ ref: '37', esvRef: 'Psalm 37', pericope: 'Fret Not Yourself Because of Evildoers' }] },
    { ch: 38, chunks: [{ ref: '38', esvRef: 'Psalm 38', pericope: 'Do Not Forsake Me, O Lord' }] },
    { ch: 39, chunks: [{ ref: '39', esvRef: 'Psalm 39', pericope: 'Make Me Know My End' }] },
    { ch: 40, chunks: [{ ref: '40', esvRef: 'Psalm 40', pericope: 'I Waited Patiently for the Lord' }] },
    { ch: 41, chunks: [{ ref: '41', esvRef: 'Psalm 41', pericope: 'Blessed Is the One Who Considers the Poor' }] },
    { ch: 42, chunks: [{ ref: '42', esvRef: 'Psalm 42', pericope: 'As a Deer Pants for Flowing Streams' }] },
    { ch: 43, chunks: [{ ref: '43', esvRef: 'Psalm 43', pericope: 'Vindicate Me, O God' }] },
    { ch: 44, chunks: [{ ref: '44', esvRef: 'Psalm 44', pericope: 'We Have Heard with Our Ears, O God' }] },
    { ch: 45, chunks: [{ ref: '45', esvRef: 'Psalm 45', pericope: 'Your Throne, O God, Is Forever' }] },
    { ch: 46, chunks: [{ ref: '46', esvRef: 'Psalm 46', pericope: 'God Is Our Refuge and Strength' }] },
    { ch: 47, chunks: [{ ref: '47', esvRef: 'Psalm 47', pericope: 'God Has Gone Up with a Shout' }] },
    { ch: 48, chunks: [{ ref: '48', esvRef: 'Psalm 48', pericope: 'Great Is the Lord in the City of Our God' }] },
    { ch: 49, chunks: [{ ref: '49', esvRef: 'Psalm 49', pericope: 'Why Should I Fear in Times of Trouble?' }] },
    { ch: 50, chunks: [{ ref: '50', esvRef: 'Psalm 50', pericope: 'The Mighty One, God the Lord, Speaks' }] },
    { ch: 51, chunks: [{ ref: '51', esvRef: 'Psalm 51', pericope: 'Create in Me a Clean Heart, O God' }] },
    { ch: 52, chunks: [{ ref: '52', esvRef: 'Psalm 52', pericope: 'Why Do You Boast of Evil?' }] },
    { ch: 53, chunks: [{ ref: '53', esvRef: 'Psalm 53', pericope: 'The Fool Says in His Heart There Is No God' }] },
    { ch: 54, chunks: [{ ref: '54', esvRef: 'Psalm 54', pericope: 'Save Me, O God, by Your Name' }] },
    { ch: 55, chunks: [{ ref: '55', esvRef: 'Psalm 55', pericope: 'Cast Your Burden on the Lord' }] },
    { ch: 56, chunks: [{ ref: '56', esvRef: 'Psalm 56', pericope: 'When I Am Afraid, I Put My Trust in You' }] },
    { ch: 57, chunks: [{ ref: '57', esvRef: 'Psalm 57', pericope: 'Be Exalted, O God, Above the Heavens' }] },
    { ch: 58, chunks: [{ ref: '58', esvRef: 'Psalm 58', pericope: 'Do You Indeed Decree What Is Right?' }] },
    { ch: 59, chunks: [{ ref: '59', esvRef: 'Psalm 59', pericope: 'Deliver Me from My Enemies, O My God' }] },
    { ch: 60, chunks: [{ ref: '60', esvRef: 'Psalm 60', pericope: 'Give Us Help Against the Foe' }] },
    { ch: 61, chunks: [{ ref: '61', esvRef: 'Psalm 61', pericope: 'Lead Me to the Rock That Is Higher Than I' }] },
    { ch: 62, chunks: [{ ref: '62', esvRef: 'Psalm 62', pericope: 'My Soul Waits for God Alone' }] },
    { ch: 63, chunks: [{ ref: '63', esvRef: 'Psalm 63', pericope: 'My Soul Thirsts for You' }] },
    { ch: 64, chunks: [{ ref: '64', esvRef: 'Psalm 64', pericope: 'Hear My Voice, O God, in My Complaint' }] },
    { ch: 65, chunks: [{ ref: '65', esvRef: 'Psalm 65', pericope: 'You Crown the Year with Your Bounty' }] },
    { ch: 66, chunks: [{ ref: '66', esvRef: 'Psalm 66', pericope: 'Shout for Joy to God, All the Earth' }] },
    { ch: 67, chunks: [{ ref: '67', esvRef: 'Psalm 67', pericope: 'Let the Peoples Praise You, O God' }] },
    { ch: 68, chunks: [{ ref: '68', esvRef: 'Psalm 68', pericope: 'God Shall Arise, His Enemies Shall Be Scattered' }] },
    { ch: 69, chunks: [{ ref: '69', esvRef: 'Psalm 69', pericope: 'Save Me, O God, for the Waters Have Come' }] },
    { ch: 70, chunks: [{ ref: '70', esvRef: 'Psalm 70', pericope: 'Make Haste, O God, to Deliver Me' }] },
    { ch: 71, chunks: [{ ref: '71', esvRef: 'Psalm 71', pericope: 'In You, O Lord, Do I Take Refuge' }] },
    { ch: 72, chunks: [{ ref: '72', esvRef: 'Psalm 72', pericope: 'Give the King Your Justice, O God' }] },
    { ch: 73, chunks: [{ ref: '73', esvRef: 'Psalm 73', pericope: 'Truly God Is Good to Israel' }] },
    { ch: 74, chunks: [{ ref: '74', esvRef: 'Psalm 74', pericope: 'Why Do You Cast Us Off, O God?' }] },
    { ch: 75, chunks: [{ ref: '75', esvRef: 'Psalm 75', pericope: 'At the Set Time That I Appoint' }] },
    { ch: 76, chunks: [{ ref: '76', esvRef: 'Psalm 76', pericope: 'In Judah God Is Known' }] },
    { ch: 77, chunks: [{ ref: '77', esvRef: 'Psalm 77', pericope: 'I Will Remember the Deeds of the Lord' }] },
    { ch: 78, chunks: [{ ref: '78', esvRef: 'Psalm 78', pericope: 'Give Ear, O My People, to My Teaching' }] },
    { ch: 79, chunks: [{ ref: '79', esvRef: 'Psalm 79', pericope: 'O God, the Nations Have Come into Your Inheritance' }] },
    { ch: 80, chunks: [{ ref: '80', esvRef: 'Psalm 80', pericope: 'Restore Us, O God' }] },
    { ch: 81, chunks: [{ ref: '81', esvRef: 'Psalm 81', pericope: 'Sing Aloud to God Our Strength' }] },
    { ch: 82, chunks: [{ ref: '82', esvRef: 'Psalm 82', pericope: 'God Has Taken His Place in the Divine Council' }] },
    { ch: 83, chunks: [{ ref: '83', esvRef: 'Psalm 83', pericope: 'O God, Do Not Keep Silence' }] },
    { ch: 84, chunks: [{ ref: '84', esvRef: 'Psalm 84', pericope: 'How Lovely Is Your Dwelling Place' }] },
    { ch: 85, chunks: [{ ref: '85', esvRef: 'Psalm 85', pericope: 'Will You Not Revive Us Again?' }] },
    { ch: 86, chunks: [{ ref: '86', esvRef: 'Psalm 86', pericope: 'Teach Me Your Way, O Lord' }] },
    { ch: 87, chunks: [{ ref: '87', esvRef: 'Psalm 87', pericope: 'On the Holy Mount Stands the City' }] },
    { ch: 88, chunks: [{ ref: '88', esvRef: 'Psalm 88', pericope: 'O Lord, God of My Salvation' }] },
    { ch: 89, chunks: [{ ref: '89', esvRef: 'Psalm 89', pericope: 'I Will Sing of the Steadfast Love of the Lord' }] },
    { ch: 90, chunks: [{ ref: '90', esvRef: 'Psalm 90', pericope: 'Lord, You Have Been Our Dwelling Place' }] },
    { ch: 91, chunks: [{ ref: '91', esvRef: 'Psalm 91', pericope: 'He Who Dwells in the Shelter of the Most High' }] },
    { ch: 92, chunks: [{ ref: '92', esvRef: 'Psalm 92', pericope: 'It Is Good to Give Thanks to the Lord' }] },
    { ch: 93, chunks: [{ ref: '93', esvRef: 'Psalm 93', pericope: 'The Lord Reigns' }] },
    { ch: 94, chunks: [{ ref: '94', esvRef: 'Psalm 94', pericope: 'O Lord, God of Vengeance' }] },
    { ch: 95, chunks: [{ ref: '95', esvRef: 'Psalm 95', pericope: 'Oh Come, Let Us Sing to the Lord' }] },
    { ch: 96, chunks: [{ ref: '96', esvRef: 'Psalm 96', pericope: 'Sing to the Lord a New Song' }] },
    { ch: 97, chunks: [{ ref: '97', esvRef: 'Psalm 97', pericope: 'The Lord Reigns, Let the Earth Rejoice' }] },
    { ch: 98, chunks: [{ ref: '98', esvRef: 'Psalm 98', pericope: 'Make a Joyful Noise to the Lord' }] },
    { ch: 99, chunks: [{ ref: '99', esvRef: 'Psalm 99', pericope: 'The Lord Reigns; Let the Peoples Tremble' }] },
    { ch: 100, chunks: [{ ref: '100', esvRef: 'Psalm 100', pericope: 'Make a Joyful Noise to the Lord, All the Earth' }] },
    { ch: 101, chunks: [{ ref: '101', esvRef: 'Psalm 101', pericope: 'I Will Sing of Steadfast Love and Justice' }] },
    { ch: 102, chunks: [{ ref: '102', esvRef: 'Psalm 102', pericope: 'A Prayer of One Afflicted' }] },
    { ch: 103, chunks: [{ ref: '103', esvRef: 'Psalm 103', pericope: 'Bless the Lord, O My Soul' }] },
    { ch: 104, chunks: [{ ref: '104', esvRef: 'Psalm 104', pericope: 'Bless the Lord, O My Soul — Creation Psalm' }] },
    { ch: 105, chunks: [{ ref: '105', esvRef: 'Psalm 105', pericope: 'Oh Give Thanks to the Lord; Call Upon His Name' }] },
    { ch: 106, chunks: [{ ref: '106', esvRef: 'Psalm 106', pericope: 'Praise the Lord! — Israel\'s History of Rebellion' }] },
    { ch: 107, chunks: [{ ref: '107', esvRef: 'Psalm 107', pericope: 'Oh Give Thanks to the Lord, for He Is Good' }] },
    { ch: 108, chunks: [{ ref: '108', esvRef: 'Psalm 108', pericope: 'My Heart Is Steadfast, O God' }] },
    { ch: 109, chunks: [{ ref: '109', esvRef: 'Psalm 109', pericope: 'Be Not Silent, O God of My Praise' }] },
    { ch: 110, chunks: [{ ref: '110', esvRef: 'Psalm 110', pericope: 'The Lord Says to My Lord: Sit at My Right Hand' }] },
    { ch: 111, chunks: [{ ref: '111', esvRef: 'Psalm 111', pericope: 'Praise the Lord! Great Are the Works of the Lord' }] },
    { ch: 112, chunks: [{ ref: '112', esvRef: 'Psalm 112', pericope: 'Blessed Is the Man Who Fears the Lord' }] },
    { ch: 113, chunks: [{ ref: '113', esvRef: 'Psalm 113', pericope: 'Praise the Lord! Praise the Name of the Lord' }] },
    { ch: 114, chunks: [{ ref: '114', esvRef: 'Psalm 114', pericope: 'When Israel Went Out from Egypt' }] },
    { ch: 115, chunks: [{ ref: '115', esvRef: 'Psalm 115', pericope: 'Not to Us, O Lord, but to Your Name Give Glory' }] },
    { ch: 116, chunks: [{ ref: '116', esvRef: 'Psalm 116', pericope: 'I Love the Lord, Because He Has Heard My Voice' }] },
    { ch: 117, chunks: [{ ref: '117', esvRef: 'Psalm 117', pericope: 'Praise the Lord, All Nations' }] },
    { ch: 118, chunks: [{ ref: '118', esvRef: 'Psalm 118', pericope: 'His Steadfast Love Endures Forever' }] },
    { ch: 119, chunks: [{ ref: '119', esvRef: 'Psalm 119', pericope: 'Blessed Are Those Whose Way Is Blameless' }] },
    { ch: 120, chunks: [{ ref: '120', esvRef: 'Psalm 120', pericope: 'In My Distress I Called to the Lord' }] },
    { ch: 121, chunks: [{ ref: '121', esvRef: 'Psalm 121', pericope: 'I Lift Up My Eyes to the Hills' }] },
    { ch: 122, chunks: [{ ref: '122', esvRef: 'Psalm 122', pericope: 'I Was Glad When They Said to Me' }] },
    { ch: 123, chunks: [{ ref: '123', esvRef: 'Psalm 123', pericope: 'To You I Lift Up My Eyes' }] },
    { ch: 124, chunks: [{ ref: '124', esvRef: 'Psalm 124', pericope: 'If It Had Not Been the Lord Who Was on Our Side' }] },
    { ch: 125, chunks: [{ ref: '125', esvRef: 'Psalm 125', pericope: 'Those Who Trust in the Lord Are Like Mount Zion' }] },
    { ch: 126, chunks: [{ ref: '126', esvRef: 'Psalm 126', pericope: 'When the Lord Restored the Fortunes of Zion' }] },
    { ch: 127, chunks: [{ ref: '127', esvRef: 'Psalm 127', pericope: 'Unless the Lord Builds the House' }] },
    { ch: 128, chunks: [{ ref: '128', esvRef: 'Psalm 128', pericope: 'Blessed Is Everyone Who Fears the Lord' }] },
    { ch: 129, chunks: [{ ref: '129', esvRef: 'Psalm 129', pericope: 'Greatly Have They Afflicted Me from My Youth' }] },
    { ch: 130, chunks: [{ ref: '130', esvRef: 'Psalm 130', pericope: 'Out of the Depths I Cry to You, O Lord' }] },
    { ch: 131, chunks: [{ ref: '131', esvRef: 'Psalm 131', pericope: 'O Lord, My Heart Is Not Lifted Up' }] },
    { ch: 132, chunks: [{ ref: '132', esvRef: 'Psalm 132', pericope: 'Remember, O Lord, in David\'s Favor' }] },
    { ch: 133, chunks: [{ ref: '133', esvRef: 'Psalm 133', pericope: 'Behold, How Good and Pleasant It Is' }] },
    { ch: 134, chunks: [{ ref: '134', esvRef: 'Psalm 134', pericope: 'Come, Bless the Lord, All You Servants of the Lord' }] },
    { ch: 135, chunks: [{ ref: '135', esvRef: 'Psalm 135', pericope: 'Praise the Lord! Praise the Name of the Lord' }] },
    { ch: 136, chunks: [{ ref: '136', esvRef: 'Psalm 136', pericope: 'Give Thanks to the Lord, for He Is Good' }] },
    { ch: 137, chunks: [{ ref: '137', esvRef: 'Psalm 137', pericope: 'By the Waters of Babylon' }] },
    { ch: 138, chunks: [{ ref: '138', esvRef: 'Psalm 138', pericope: 'I Give You Thanks, O Lord, with My Whole Heart' }] },
    { ch: 139, chunks: [{ ref: '139', esvRef: 'Psalm 139', pericope: 'O Lord, You Have Searched Me and Known Me' }] },
    { ch: 140, chunks: [{ ref: '140', esvRef: 'Psalm 140', pericope: 'Deliver Me, O Lord, from Evil Men' }] },
    { ch: 141, chunks: [{ ref: '141', esvRef: 'Psalm 141', pericope: 'O Lord, I Call Upon You; Hasten to Me' }] },
    { ch: 142, chunks: [{ ref: '142', esvRef: 'Psalm 142', pericope: 'With My Voice I Cry Out to the Lord' }] },
    { ch: 143, chunks: [{ ref: '143', esvRef: 'Psalm 143', pericope: 'Hear My Prayer, O Lord' }] },
    { ch: 144, chunks: [{ ref: '144', esvRef: 'Psalm 144', pericope: 'Blessed Be the Lord, My Rock' }] },
    { ch: 145, chunks: [{ ref: '145', esvRef: 'Psalm 145', pericope: 'I Will Extol You, My God and King' }] },
    { ch: 146, chunks: [{ ref: '146', esvRef: 'Psalm 146', pericope: 'Praise the Lord! Praise the Lord, O My Soul' }] },
    { ch: 147, chunks: [{ ref: '147', esvRef: 'Psalm 147', pericope: 'Praise the Lord! It Is Good to Sing Praises' }] },
    { ch: 148, chunks: [{ ref: '148', esvRef: 'Psalm 148', pericope: 'Praise the Lord! Praise the Lord from the Heavens' }] },
    { ch: 149, chunks: [{ ref: '149', esvRef: 'Psalm 149', pericope: 'Praise the Lord! Sing to the Lord a New Song' }] },
    { ch: 150, chunks: [{ ref: '150', esvRef: 'Psalm 150', pericope: 'Praise the Lord! Praise God in His Sanctuary' }] },
  ] },
  {
    id: 'proverbs',
    name: 'Proverbs',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-7', esvRef: 'Proverbs 1:1-7', pericope: 'The Purpose of Proverbs' },
        { ref: '1:8-19', esvRef: 'Proverbs 1:8-19', pericope: 'Warning Against Sinners' },
        { ref: '1:20-33', esvRef: 'Proverbs 1:20-33', pericope: 'Wisdom Cries Aloud' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-22', esvRef: 'Proverbs 2:1-22', pericope: 'The Value of Wisdom' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-12', esvRef: 'Proverbs 3:1-12', pericope: 'Trust in the Lord' },
        { ref: '3:13-35', esvRef: 'Proverbs 3:13-35', pericope: 'The Blessings of Wisdom' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-27', esvRef: 'Proverbs 4:1-27', pericope: 'Get Wisdom; Guard Your Heart' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-23', esvRef: 'Proverbs 5:1-23', pericope: 'Warning Against Adultery' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-19', esvRef: 'Proverbs 6:1-19', pericope: 'Warnings Against Various Sins' },
        { ref: '6:20-35', esvRef: 'Proverbs 6:20-35', pericope: 'Warning Against Adultery' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-27', esvRef: 'Proverbs 7:1-27', pericope: 'Warning Against the Forbidden Woman' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-36', esvRef: 'Proverbs 8:1-36', pericope: 'Wisdom Cries Out; I Was Beside God' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-18', esvRef: 'Proverbs 9:1-18', pericope: 'Wisdom vs. Folly' },
      ]},
      { ch: 10, chunks: [{ ref: '10:1-32', esvRef: 'Proverbs 10:1-32', pericope: 'The Proverbs of Solomon' }] },
      { ch: 11, chunks: [{ ref: '11:1-31', esvRef: 'Proverbs 11:1-31', pericope: 'The Proverbs of Solomon' }] },
      { ch: 12, chunks: [{ ref: '12:1-28', esvRef: 'Proverbs 12:1-28', pericope: 'The Proverbs of Solomon' }] },
      { ch: 13, chunks: [{ ref: '13:1-25', esvRef: 'Proverbs 13:1-25', pericope: 'The Proverbs of Solomon' }] },
      { ch: 14, chunks: [{ ref: '14:1-35', esvRef: 'Proverbs 14:1-35', pericope: 'The Proverbs of Solomon' }] },
      { ch: 15, chunks: [{ ref: '15:1-33', esvRef: 'Proverbs 15:1-33', pericope: 'The Proverbs of Solomon' }] },
      { ch: 16, chunks: [{ ref: '16:1-33', esvRef: 'Proverbs 16:1-33', pericope: 'The Proverbs of Solomon' }] },
      { ch: 17, chunks: [{ ref: '17:1-28', esvRef: 'Proverbs 17:1-28', pericope: 'The Proverbs of Solomon' }] },
      { ch: 18, chunks: [{ ref: '18:1-24', esvRef: 'Proverbs 18:1-24', pericope: 'The Proverbs of Solomon' }] },
      { ch: 19, chunks: [{ ref: '19:1-29', esvRef: 'Proverbs 19:1-29', pericope: 'The Proverbs of Solomon' }] },
      { ch: 20, chunks: [{ ref: '20:1-30', esvRef: 'Proverbs 20:1-30', pericope: 'The Proverbs of Solomon' }] },
      { ch: 21, chunks: [{ ref: '21:1-31', esvRef: 'Proverbs 21:1-31', pericope: 'The Proverbs of Solomon' }] },
      { ch: 22, chunks: [
        { ref: '22:1-16', esvRef: 'Proverbs 22:1-16', pericope: 'The Proverbs of Solomon' },
        { ref: '22:17-29', esvRef: 'Proverbs 22:17-29', pericope: 'Words of the Wise' },
      ]},
      { ch: 23, chunks: [{ ref: '23:1-35', esvRef: 'Proverbs 23:1-35', pericope: 'More Words of the Wise' }] },
      { ch: 24, chunks: [{ ref: '24:1-34', esvRef: 'Proverbs 24:1-34', pericope: 'More Sayings of the Wise' }] },
      { ch: 25, chunks: [{ ref: '25:1-28', esvRef: 'Proverbs 25:1-28', pericope: 'More Proverbs of Solomon' }] },
      { ch: 26, chunks: [{ ref: '26:1-28', esvRef: 'Proverbs 26:1-28', pericope: 'More Proverbs of Solomon' }] },
      { ch: 27, chunks: [{ ref: '27:1-27', esvRef: 'Proverbs 27:1-27', pericope: 'More Proverbs of Solomon' }] },
      { ch: 28, chunks: [{ ref: '28:1-28', esvRef: 'Proverbs 28:1-28', pericope: 'More Proverbs of Solomon' }] },
      { ch: 29, chunks: [{ ref: '29:1-27', esvRef: 'Proverbs 29:1-27', pericope: 'More Proverbs of Solomon' }] },
      { ch: 30, chunks: [{ ref: '30:1-33', esvRef: 'Proverbs 30:1-33', pericope: 'The Words of Agur' }] },
      { ch: 31, chunks: [
        { ref: '31:1-9', esvRef: 'Proverbs 31:1-9', pericope: 'The Words of Lemuel' },
        { ref: '31:10-31', esvRef: 'Proverbs 31:10-31', pericope: 'The Excellent Wife' },
      ]},
    ]
  },
  {
    id: 'ecclesiastes',
    name: 'Ecclesiastes',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: 'Ecclesiastes 1:1-11', pericope: 'Vanity of Vanities' },
        { ref: '1:12-18', esvRef: 'Ecclesiastes 1:12-18', pericope: "The Preacher's Search for Wisdom" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: 'Ecclesiastes 2:1-11', pericope: 'The Vanity of Pleasure and Toil' },
        { ref: '2:12-26', esvRef: 'Ecclesiastes 2:12-26', pericope: 'The Fate of the Wise and Fool' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: 'Ecclesiastes 3:1-15', pericope: 'A Time for Everything; God and Eternity' },
        { ref: '3:16-22', esvRef: 'Ecclesiastes 3:16-22', pericope: 'Injustice and the Fate of All' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-16', esvRef: 'Ecclesiastes 4:1-16', pericope: 'Oppression, Toil, Friendship, and Ambition' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-7', esvRef: 'Ecclesiastes 5:1-7', pericope: 'Fear God; Guard Your Steps' },
        { ref: '5:8-20', esvRef: 'Ecclesiastes 5:8-20', pericope: 'The Vanity of Wealth' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-12', esvRef: 'Ecclesiastes 6:1-12', pericope: 'The Misery of Riches Without Enjoyment' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-14', esvRef: 'Ecclesiastes 7:1-14', pericope: 'Practical Wisdom' },
        { ref: '7:15-29', esvRef: 'Ecclesiastes 7:15-29', pericope: 'The Limits of Wisdom' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-17', esvRef: 'Ecclesiastes 8:1-17', pericope: 'Wisdom and the Mystery of Providence' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-12', esvRef: 'Ecclesiastes 9:1-12', pericope: 'One Fate Comes to All' },
        { ref: '9:13-18', esvRef: 'Ecclesiastes 9:13-18', pericope: 'Wisdom Better Than Might' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-20', esvRef: 'Ecclesiastes 10:1-20', pericope: 'Wisdom and Folly' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-8', esvRef: 'Ecclesiastes 11:1-8', pericope: 'Cast Your Bread on the Waters' },
        { ref: '11:9-10', esvRef: 'Ecclesiastes 11:9-10', pericope: 'Rejoice in Your Youth' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-8', esvRef: 'Ecclesiastes 12:1-8', pericope: 'Remember Your Creator in Your Youth' },
        { ref: '12:9-14', esvRef: 'Ecclesiastes 12:9-14', pericope: 'The Conclusion: Fear God and Keep His Commandments' },
      ]},
    ]
  },
  {
    id: 'song-of-solomon',
    name: 'Song of Solomon',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-8', esvRef: 'Song of Solomon 1:1-8', pericope: "The Bride's Longing" },
        { ref: '1:9-17', esvRef: 'Song of Solomon 1:9-17', pericope: 'Mutual Admiration' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-7', esvRef: 'Song of Solomon 2:1-7', pericope: "The Beloved's Beauty; A Charge" },
        { ref: '2:8-17', esvRef: 'Song of Solomon 2:8-17', pericope: "The Beloved Comes; The Vineyard in Bloom" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-5', esvRef: 'Song of Solomon 3:1-5', pericope: 'The Bride Seeks Her Beloved' },
        { ref: '3:6-11', esvRef: 'Song of Solomon 3:6-11', pericope: "Solomon's Wedding Procession" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-15', esvRef: 'Song of Solomon 4:1-15', pericope: "The Bridegroom Praises His Bride" },
        { ref: '4:16', esvRef: 'Song of Solomon 4:16', pericope: 'The Bride Invites Her Beloved' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1', esvRef: 'Song of Solomon 5:1', pericope: 'The Consummation' },
        { ref: '5:2-16', esvRef: 'Song of Solomon 5:2-16', pericope: "The Bride Seeks Her Beloved; She Praises Him" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-3', esvRef: 'Song of Solomon 6:1-3', pericope: 'Where Has Your Beloved Gone?' },
        { ref: '6:4-13', esvRef: 'Song of Solomon 6:4-13', pericope: 'The Bridegroom Praises His Bride' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-9', esvRef: 'Song of Solomon 7:1-9', pericope: 'The Bridegroom Continues His Praise' },
        { ref: '7:10-13', esvRef: 'Song of Solomon 7:10-13', pericope: 'The Bride Invites Her Beloved to the Country' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-7', esvRef: 'Song of Solomon 8:1-7', pericope: 'The Power of Love' },
        { ref: '8:8-14', esvRef: 'Song of Solomon 8:8-14', pericope: 'The Little Sister; Beloved, Come Away' },
      ]},
    ]
  },
  {
    id: 'isaiah',
    name: 'Isaiah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-9', esvRef: 'Isaiah 1:1-9', pericope: 'The Sinful Nation' },
        { ref: '1:10-20', esvRef: 'Isaiah 1:10-20', pericope: 'True Versus False Worship' },
        { ref: '1:21-31', esvRef: 'Isaiah 1:21-31', pericope: 'The Faithful City to Be Restored' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-5', esvRef: 'Isaiah 2:1-5', pericope: 'The Mountain of the Lord' },
        { ref: '2:6-22', esvRef: 'Isaiah 2:6-22', pericope: 'The Day of the Lord' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: 'Isaiah 3:1-15', pericope: 'Judgment on Jerusalem and Judah' },
        { ref: '3:16-26', esvRef: 'Isaiah 3:16-26', pericope: 'The Proud Daughters of Zion' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-6', esvRef: 'Isaiah 4:1-6', pericope: 'The Branch of the Lord' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-7', esvRef: 'Isaiah 5:1-7', pericope: 'The Parable of the Vineyard' },
        { ref: '5:8-30', esvRef: 'Isaiah 5:8-30', pericope: 'Woes to the Corrupt' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-13', esvRef: 'Isaiah 6:1-13', pericope: "Isaiah's Call" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-17', esvRef: 'Isaiah 7:1-17', pericope: 'The Sign of Immanuel' },
        { ref: '7:18-25', esvRef: 'Isaiah 7:18-25', pericope: 'Further Warnings' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-22', esvRef: 'Isaiah 8:1-22', pericope: "Isaiah's Children as Signs; Fear the Lord" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-7', esvRef: 'Isaiah 9:1-7', pericope: 'Unto Us a Child Is Born' },
        { ref: '9:8-21', esvRef: 'Isaiah 9:8-21', pericope: 'Judgment on Israel' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-19', esvRef: 'Isaiah 10:1-19', pericope: 'Woe to Assyria' },
        { ref: '10:20-34', esvRef: 'Isaiah 10:20-34', pericope: 'The Remnant of Israel' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-16', esvRef: 'Isaiah 11:1-16', pericope: 'The Branch of Jesse; The Peaceful Kingdom' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-6', esvRef: 'Isaiah 12:1-6', pericope: 'A Song of Thanksgiving' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-22', esvRef: 'Isaiah 13:1-22', pericope: 'The Burden of Babylon' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-23', esvRef: 'Isaiah 14:1-23', pericope: 'Taunt Against the King of Babylon' },
        { ref: '14:24-32', esvRef: 'Isaiah 14:24-32', pericope: 'Judgment on Assyria and Philistia' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-9', esvRef: 'Isaiah 15:1-9', pericope: 'Burden of Moab' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-14', esvRef: 'Isaiah 16:1-14', pericope: "Moab's Desolation" },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-14', esvRef: 'Isaiah 17:1-14', pericope: 'Burden of Damascus; Judgment on Israel' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-7', esvRef: 'Isaiah 18:1-7', pericope: 'Burden Against Ethiopia' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-25', esvRef: 'Isaiah 19:1-25', pericope: 'Burden of Egypt; Egypt Will Know the Lord' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-6', esvRef: 'Isaiah 20:1-6', pericope: 'A Sign Against Egypt and Ethiopia' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-17', esvRef: 'Isaiah 21:1-17', pericope: 'Burdens Against Babylon, Edom, and Arabia' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-25', esvRef: 'Isaiah 22:1-25', pericope: 'Burden of Jerusalem; Shebna and Eliakim' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-18', esvRef: 'Isaiah 23:1-18', pericope: 'Burden of Tyre' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-23', esvRef: 'Isaiah 24:1-23', pericope: 'The Lord Lays Waste the Earth' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-12', esvRef: 'Isaiah 25:1-12', pericope: 'Songs of Praise; God Will Swallow Up Death' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-21', esvRef: 'Isaiah 26:1-21', pericope: 'A Song of Trust in God' },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-13', esvRef: 'Isaiah 27:1-13', pericope: 'Redemption of Israel' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-29', esvRef: 'Isaiah 28:1-29', pericope: 'Woe to Ephraim; The Precious Cornerstone' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-24', esvRef: 'Isaiah 29:1-24', pericope: 'Woe to Ariel; The Deaf Will Hear' },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-33', esvRef: 'Isaiah 30:1-33', pericope: 'Woe to Those Who Go to Egypt; Awaiting God' },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-9', esvRef: 'Isaiah 31:1-9', pericope: 'Woe to Those Who Go Down to Egypt' },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-20', esvRef: 'Isaiah 32:1-20', pericope: 'The Righteous Kingdom; The Spirit Is Poured Out' },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-24', esvRef: 'Isaiah 33:1-24', pericope: 'Woe to the Destroyer; The Lord Is Our King' },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-17', esvRef: 'Isaiah 34:1-17', pericope: 'Judgment on the Nations; Desolation of Edom' },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-10', esvRef: 'Isaiah 35:1-10', pericope: 'The Return of the Redeemed' },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-22', esvRef: 'Isaiah 36:1-22', pericope: 'Sennacherib Threatens Jerusalem' },
      ]},
      { ch: 37, chunks: [
        { ref: '37:1-20', esvRef: 'Isaiah 37:1-20', pericope: "Hezekiah's Prayer" },
        { ref: '37:21-38', esvRef: 'Isaiah 37:21-38', pericope: "Isaiah Prophesies Deliverance; Sennacherib Slain" },
      ]},
      { ch: 38, chunks: [
        { ref: '38:1-22', esvRef: 'Isaiah 38:1-22', pericope: "Hezekiah's Illness and Recovery" },
      ]},
      { ch: 39, chunks: [
        { ref: '39:1-8', esvRef: 'Isaiah 39:1-8', pericope: 'Envoys from Babylon; Isaiah Prophesies Captivity' },
      ]},
      { ch: 40, chunks: [
        { ref: '40:1-11', esvRef: 'Isaiah 40:1-11', pericope: 'Comfort, Comfort My People' },
        { ref: '40:12-31', esvRef: 'Isaiah 40:12-31', pericope: 'The Incomparable God; Those Who Wait Will Soar' },
      ]},
      { ch: 41, chunks: [
        { ref: '41:1-20', esvRef: 'Isaiah 41:1-20', pericope: 'Fear Not, for I Am with You' },
        { ref: '41:21-29', esvRef: 'Isaiah 41:21-29', pericope: 'The Idols Are Nothing' },
      ]},
      { ch: 42, chunks: [
        { ref: '42:1-9', esvRef: 'Isaiah 42:1-9', pericope: 'The Servant of the Lord' },
        { ref: '42:10-25', esvRef: 'Isaiah 42:10-25', pericope: "Praise to the Lord; Israel's Blindness" },
      ]},
      { ch: 43, chunks: [
        { ref: '43:1-21', esvRef: 'Isaiah 43:1-21', pericope: 'The Redeemer of Israel' },
        { ref: '43:22-28', esvRef: 'Isaiah 43:22-28', pericope: "Israel's Failure; God's Forgiveness" },
      ]},
      { ch: 44, chunks: [
        { ref: '44:1-23', esvRef: 'Isaiah 44:1-23', pericope: 'Idol Makers Are Nothing; The Lord Is King' },
        { ref: '44:24-28', esvRef: 'Isaiah 44:24-28', pericope: "Cyrus, God's Instrument" },
      ]},
      { ch: 45, chunks: [
        { ref: '45:1-13', esvRef: 'Isaiah 45:1-13', pericope: 'God Appoints Cyrus' },
        { ref: '45:14-25', esvRef: 'Isaiah 45:14-25', pericope: 'There Is No Other God' },
      ]},
      { ch: 46, chunks: [
        { ref: '46:1-13', esvRef: 'Isaiah 46:1-13', pericope: 'Bel and Nebo Fail; God Carries Israel' },
      ]},
      { ch: 47, chunks: [
        { ref: '47:1-15', esvRef: 'Isaiah 47:1-15', pericope: 'Fallen Babylon' },
      ]},
      { ch: 48, chunks: [
        { ref: '48:1-22', esvRef: 'Isaiah 48:1-22', pericope: 'Refined but Not as Silver' },
      ]},
      { ch: 49, chunks: [
        { ref: '49:1-13', esvRef: 'Isaiah 49:1-13', pericope: "The Servant's Mission" },
        { ref: '49:14-26', esvRef: 'Isaiah 49:14-26', pericope: 'The Lord Will Not Forget Zion' },
      ]},
      { ch: 50, chunks: [
        { ref: '50:1-11', esvRef: 'Isaiah 50:1-11', pericope: "The Servant's Obedience" },
      ]},
      { ch: 51, chunks: [
        { ref: '51:1-23', esvRef: 'Isaiah 51:1-23', pericope: "Listen to Me; The Lord's Comfort" },
      ]},
      { ch: 52, chunks: [
        { ref: '52:1-12', esvRef: 'Isaiah 52:1-12', pericope: 'Awake, Awake; The Beautiful Feet' },
        { ref: '52:13-15', esvRef: 'Isaiah 52:13-15', pericope: 'The Suffering Servant Exalted' },
      ]},
      { ch: 53, chunks: [
        { ref: '53:1-12', esvRef: 'Isaiah 53:1-12', pericope: 'The Suffering Servant' },
      ]},
      { ch: 54, chunks: [
        { ref: '54:1-17', esvRef: 'Isaiah 54:1-17', pericope: "The Lord's Everlasting Love for Israel" },
      ]},
      { ch: 55, chunks: [
        { ref: '55:1-13', esvRef: 'Isaiah 55:1-13', pericope: "The Invitation; The Power of God's Word" },
      ]},
      { ch: 56, chunks: [
        { ref: '56:1-8', esvRef: 'Isaiah 56:1-8', pericope: 'Salvation Extended to Foreigners and Eunuchs' },
        { ref: '56:9-12', esvRef: 'Isaiah 56:9-12', pericope: 'Wicked Leaders' },
      ]},
      { ch: 57, chunks: [
        { ref: '57:1-21', esvRef: 'Isaiah 57:1-21', pericope: 'Idolatry Condemned; Peace for the Contrite' },
      ]},
      { ch: 58, chunks: [
        { ref: '58:1-14', esvRef: 'Isaiah 58:1-14', pericope: 'True Fasting; Keep the Sabbath' },
      ]},
      { ch: 59, chunks: [
        { ref: '59:1-21', esvRef: 'Isaiah 59:1-21', pericope: 'Sin Separates from God; The Redeemer Comes' },
      ]},
      { ch: 60, chunks: [
        { ref: '60:1-22', esvRef: 'Isaiah 60:1-22', pericope: 'The Radiance of Zion' },
      ]},
      { ch: 61, chunks: [
        { ref: '61:1-11', esvRef: 'Isaiah 61:1-11', pericope: "Good News to the Poor; The Year of the Lord's Favor" },
      ]},
      { ch: 62, chunks: [
        { ref: '62:1-12', esvRef: 'Isaiah 62:1-12', pericope: "Zion's New Name" },
      ]},
      { ch: 63, chunks: [
        { ref: '63:1-6', esvRef: 'Isaiah 63:1-6', pericope: 'The Lord Treads the Winepress' },
        { ref: '63:7-19', esvRef: 'Isaiah 63:7-19', pericope: "God's Faithfulness; Prayer for Help" },
      ]},
      { ch: 64, chunks: [
        { ref: '64:1-12', esvRef: 'Isaiah 64:1-12', pericope: 'A Prayer for Mercy' },
      ]},
      { ch: 65, chunks: [
        { ref: '65:1-25', esvRef: 'Isaiah 65:1-25', pericope: "The Lord's Judgment; The New Creation" },
      ]},
      { ch: 66, chunks: [
        { ref: '66:1-24', esvRef: 'Isaiah 66:1-24', pericope: 'Judgment and Restoration; The New Heavens and Earth' },
      ]},
    ]
  },
  {
    id: 'jeremiah',
    name: 'Jeremiah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-10', esvRef: 'Jeremiah 1:1-10', pericope: "Jeremiah's Call" },
        { ref: '1:11-19', esvRef: 'Jeremiah 1:11-19', pericope: 'Two Visions; God Promises to Be with Jeremiah' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-13', esvRef: 'Jeremiah 2:1-13', pericope: "Israel's Faithlessness" },
        { ref: '2:14-37', esvRef: 'Jeremiah 2:14-37', pericope: "Israel's Apostasy Continued" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-10', esvRef: 'Jeremiah 3:1-10', pericope: "Israel's Unfaithfulness" },
        { ref: '3:11-25', esvRef: 'Jeremiah 3:11-25', pericope: 'A Call to Repentance' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-18', esvRef: 'Jeremiah 4:1-18', pericope: 'A Call to Repentance; Disaster from the North' },
        { ref: '4:19-31', esvRef: 'Jeremiah 4:19-31', pericope: "Jeremiah's Anguish; The Desolation" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-19', esvRef: 'Jeremiah 5:1-19', pericope: "Israel's Widespread Corruption" },
        { ref: '5:20-31', esvRef: 'Jeremiah 5:20-31', pericope: 'A Foolish and Senseless People' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-15', esvRef: 'Jeremiah 6:1-15', pericope: 'Disaster from the North; False Prophets' },
        { ref: '6:16-30', esvRef: 'Jeremiah 6:16-30', pericope: 'Stand at the Crossroads; Rejected Silver' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-15', esvRef: 'Jeremiah 7:1-15', pericope: "Jeremiah's Temple Sermon" },
        { ref: '7:16-34', esvRef: 'Jeremiah 7:16-34', pericope: 'Idolatry and Its Consequences' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-17', esvRef: 'Jeremiah 8:1-17', pericope: "Israel's Stubborn Refusal to Repent" },
        { ref: '8:18-22', esvRef: 'Jeremiah 8:18-22', pericope: "Jeremiah's Grief" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-16', esvRef: 'Jeremiah 9:1-16', pericope: "Jeremiah's Mourning; Judgment Announced" },
        { ref: '9:17-26', esvRef: 'Jeremiah 9:17-26', pericope: 'Wailing Women; True Boasting' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-16', esvRef: 'Jeremiah 10:1-16', pericope: 'Idols vs. the Living God' },
        { ref: '10:17-25', esvRef: 'Jeremiah 10:17-25', pericope: "Coming Exile; Jeremiah's Prayer" },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-17', esvRef: 'Jeremiah 11:1-17', pericope: "The Covenant Broken; Israel's Apostasy" },
        { ref: '11:18-23', esvRef: 'Jeremiah 11:18-23', pericope: 'Plot Against Jeremiah' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-17', esvRef: 'Jeremiah 12:1-17', pericope: "Jeremiah's Complaint; God's Answer" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-14', esvRef: 'Jeremiah 13:1-14', pericope: 'The Ruined Loincloth; The Jars of Wine' },
        { ref: '13:15-27', esvRef: 'Jeremiah 13:15-27', pericope: "Warning Against Pride; Jerusalem's Shame" },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-22', esvRef: 'Jeremiah 14:1-22', pericope: "Drought and Famine; Jeremiah's Intercession" },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-21', esvRef: 'Jeremiah 15:1-21', pericope: "The Lord's Judgment; Jeremiah's Complaint and God's Reply" },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-21', esvRef: 'Jeremiah 16:1-21', pericope: "Jeremiah's Celibacy; Coming Exile; Future Restoration" },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-18', esvRef: 'Jeremiah 17:1-18', pericope: "Judah's Sin; Trust in the Lord; Jeremiah's Prayer" },
        { ref: '17:19-27', esvRef: 'Jeremiah 17:19-27', pericope: 'Sabbath Observance' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-17', esvRef: 'Jeremiah 18:1-17', pericope: 'The Potter and the Clay' },
        { ref: '18:18-23', esvRef: 'Jeremiah 18:18-23', pericope: 'Jeremiah Persecuted; His Prayer' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-15', esvRef: 'Jeremiah 19:1-15', pericope: 'The Broken Flask; Disaster Coming to Judah' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-6', esvRef: 'Jeremiah 20:1-6', pericope: "Pashhur Strikes Jeremiah; Jeremiah's Prophecy Against Him" },
        { ref: '20:7-18', esvRef: 'Jeremiah 20:7-18', pericope: "Jeremiah's Lament" },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-14', esvRef: 'Jeremiah 21:1-14', pericope: 'Jerusalem Will Fall to Babylon; Message to the King' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-30', esvRef: 'Jeremiah 22:1-30', pericope: "Messages to Judah's Kings" },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-8', esvRef: 'Jeremiah 23:1-8', pericope: 'The Righteous Branch' },
        { ref: '23:9-40', esvRef: 'Jeremiah 23:9-40', pericope: 'Concerning False Prophets' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-10', esvRef: 'Jeremiah 24:1-10', pericope: 'Two Baskets of Figs' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-14', esvRef: 'Jeremiah 25:1-14', pericope: 'Seventy Years of Desolation' },
        { ref: '25:15-38', esvRef: 'Jeremiah 25:15-38', pericope: 'The Cup of Wrath for the Nations' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-24', esvRef: 'Jeremiah 26:1-24', pericope: "Jeremiah's Trial" },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-22', esvRef: 'Jeremiah 27:1-22', pericope: 'Submit to Babylon; Warning Against False Prophets' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-17', esvRef: 'Jeremiah 28:1-17', pericope: 'The False Prophet Hananiah' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-23', esvRef: 'Jeremiah 29:1-23', pericope: "Jeremiah's Letter to the Exiles; Plans for Welfare and Peace" },
        { ref: '29:24-32', esvRef: 'Jeremiah 29:24-32', pericope: 'Shemaiah the False Prophet' },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-24', esvRef: 'Jeremiah 30:1-24', pericope: "The Time of Jacob's Trouble; Promise of Restoration" },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-26', esvRef: 'Jeremiah 31:1-26', pericope: "Israel's Restoration; Return of the Remnant" },
        { ref: '31:27-40', esvRef: 'Jeremiah 31:27-40', pericope: 'The New Covenant' },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-25', esvRef: 'Jeremiah 32:1-25', pericope: "Jeremiah Buys a Field" },
        { ref: '32:26-44', esvRef: 'Jeremiah 32:26-44', pericope: "The Lord's Promise to Restore" },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-26', esvRef: 'Jeremiah 33:1-26', pericope: 'The Righteous Branch; Promises of Restoration' },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-22', esvRef: 'Jeremiah 34:1-22', pericope: "Message to Zedekiah; The People's Broken Pledge" },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-19', esvRef: 'Jeremiah 35:1-19', pericope: "The Recabites' Obedience" },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-32', esvRef: 'Jeremiah 36:1-32', pericope: "Jeremiah's Scroll Read and Burned; Rewritten" },
      ]},
      { ch: 37, chunks: [
        { ref: '37:1-21', esvRef: 'Jeremiah 37:1-21', pericope: "Jeremiah in the Cistern; His Consultation with the King" },
      ]},
      { ch: 38, chunks: [
        { ref: '38:1-28', esvRef: 'Jeremiah 38:1-28', pericope: "Jeremiah in the Cistern; His Rescue; Advice to Zedekiah" },
      ]},
      { ch: 39, chunks: [
        { ref: '39:1-18', esvRef: 'Jeremiah 39:1-18', pericope: 'The Fall of Jerusalem; Jeremiah Released' },
      ]},
      { ch: 40, chunks: [
        { ref: '40:1-16', esvRef: 'Jeremiah 40:1-16', pericope: "Jeremiah with Gedaliah; Ishmael's Plot" },
      ]},
      { ch: 41, chunks: [
        { ref: '41:1-18', esvRef: 'Jeremiah 41:1-18', pericope: "Ishmael Assassinates Gedaliah; Flight to Egypt" },
      ]},
      { ch: 42, chunks: [
        { ref: '42:1-22', esvRef: 'Jeremiah 42:1-22', pericope: "The People's Question; God's Warning Against Going to Egypt" },
      ]},
      { ch: 43, chunks: [
        { ref: '43:1-13', esvRef: 'Jeremiah 43:1-13', pericope: "Flight to Egypt; Jeremiah's Prophecy in Egypt" },
      ]},
      { ch: 44, chunks: [
        { ref: '44:1-30', esvRef: 'Jeremiah 44:1-30', pericope: "Jeremiah's Message to the Jews in Egypt" },
      ]},
      { ch: 45, chunks: [
        { ref: '45:1-5', esvRef: 'Jeremiah 45:1-5', pericope: "A Message to Baruch" },
      ]},
      { ch: 46, chunks: [
        { ref: '46:1-28', esvRef: 'Jeremiah 46:1-28', pericope: 'Prophecy Against Egypt' },
      ]},
      { ch: 47, chunks: [
        { ref: '47:1-7', esvRef: 'Jeremiah 47:1-7', pericope: 'Prophecy Against Philistia' },
      ]},
      { ch: 48, chunks: [
        { ref: '48:1-47', esvRef: 'Jeremiah 48:1-47', pericope: 'Prophecy Against Moab' },
      ]},
      { ch: 49, chunks: [
        { ref: '49:1-39', esvRef: 'Jeremiah 49:1-39', pericope: 'Prophecies Against the Nations' },
      ]},
      { ch: 50, chunks: [
        { ref: '50:1-46', esvRef: 'Jeremiah 50:1-46', pericope: 'Prophecy Against Babylon, Part 1' },
      ]},
      { ch: 51, chunks: [
        { ref: '51:1-64', esvRef: 'Jeremiah 51:1-64', pericope: 'Prophecy Against Babylon, Part 2' },
      ]},
      { ch: 52, chunks: [
        { ref: '52:1-34', esvRef: 'Jeremiah 52:1-34', pericope: "The Fall of Jerusalem; Jehoiachin's Release" },
      ]},
    ]
  },
  {
    id: 'lamentations',
    name: 'Lamentations',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: 'Lamentations 1:1-11', pericope: "Jerusalem's Desolation" },
        { ref: '1:12-22', esvRef: 'Lamentations 1:12-22', pericope: "Jerusalem's Plea" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-10', esvRef: 'Lamentations 2:1-10', pericope: "The Lord's Anger Against Jerusalem" },
        { ref: '2:11-22', esvRef: 'Lamentations 2:11-22', pericope: "The Prophet's Grief; A Call to Cry Out" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-21', esvRef: 'Lamentations 3:1-21', pericope: 'Suffering Under the Wrath of God' },
        { ref: '3:22-42', esvRef: 'Lamentations 3:22-42', pericope: 'Great Is Your Faithfulness' },
        { ref: '3:43-66', esvRef: 'Lamentations 3:43-66', pericope: 'Renewed Plea; Trust in God' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-16', esvRef: 'Lamentations 4:1-16', pericope: "Jerusalem's Punishment" },
        { ref: '4:17-22', esvRef: 'Lamentations 4:17-22', pericope: "The Fall of Jerusalem; Edom's Doom" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-22', esvRef: 'Lamentations 5:1-22', pericope: "A Plea for the Lord's Restoration" },
      ]},
    ]
  },
  {
    id: 'ezekiel',
    name: 'Ezekiel',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-14', esvRef: 'Ezekiel 1:1-14', pericope: "Ezekiel's Vision of God" },
        { ref: '1:15-28', esvRef: 'Ezekiel 1:15-28', pericope: 'The Wheels and the Glory of God' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-3:3', esvRef: 'Ezekiel 2:1-3:3', pericope: "Ezekiel's Call; The Scroll" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:4-27', esvRef: 'Ezekiel 3:4-27', pericope: 'Ezekiel as Watchman; The Spirit Comes' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-17', esvRef: 'Ezekiel 4:1-17', pericope: "Signs of Jerusalem's Siege" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-17', esvRef: 'Ezekiel 5:1-17', pericope: "The Sign of the Hair; Jerusalem's Judgment" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-14', esvRef: 'Ezekiel 6:1-14', pericope: 'Prophecy Against the Mountains of Israel' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-27', esvRef: 'Ezekiel 7:1-27', pericope: 'The End Has Come' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-18', esvRef: 'Ezekiel 8:1-18', pericope: 'Idolatry in the Temple' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-11', esvRef: 'Ezekiel 9:1-11', pericope: 'The Slaughter of the Idolaters' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-22', esvRef: 'Ezekiel 10:1-22', pericope: 'The Glory Departs from the Temple' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-21', esvRef: 'Ezekiel 11:1-21', pericope: 'Judgment on the Wicked; Promise for the Exiles' },
        { ref: '11:22-25', esvRef: 'Ezekiel 11:22-25', pericope: 'The Glory of the Lord Departs Jerusalem' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-20', esvRef: 'Ezekiel 12:1-20', pericope: 'The Sign of the Exile' },
        { ref: '12:21-28', esvRef: 'Ezekiel 12:21-28', pericope: 'Visions Will Be Fulfilled Soon' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-23', esvRef: 'Ezekiel 13:1-23', pericope: 'Prophecy Against False Prophets and Prophetesses' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-23', esvRef: 'Ezekiel 14:1-23', pericope: 'Idolatrous Elders; Judgment Is Sure' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-8', esvRef: 'Ezekiel 15:1-8', pericope: 'Jerusalem Like a Useless Vine' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-43', esvRef: 'Ezekiel 16:1-43', pericope: "Jerusalem's Unfaithfulness" },
        { ref: '16:44-63', esvRef: 'Ezekiel 16:44-63', pericope: 'Judgment and Future Restoration' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-24', esvRef: 'Ezekiel 17:1-24', pericope: 'The Parable of the Two Eagles and the Vine' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-32', esvRef: 'Ezekiel 18:1-32', pericope: 'Individual Responsibility; Repent and Live' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-14', esvRef: 'Ezekiel 19:1-14', pericope: "A Lament for Israel's Princes" },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-44', esvRef: 'Ezekiel 20:1-44', pericope: "Israel's History of Rebellion; Future Restoration" },
        { ref: '20:45-49', esvRef: 'Ezekiel 20:45-49', pericope: 'Prophecy Against the South' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-32', esvRef: 'Ezekiel 21:1-32', pericope: "The Lord's Sword; Babylon and Ammon" },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-31', esvRef: 'Ezekiel 22:1-31', pericope: "Jerusalem's Sins; The Smelting Furnace" },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-49', esvRef: 'Ezekiel 23:1-49', pericope: 'Oholah and Oholibah: Two Sisters' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-14', esvRef: 'Ezekiel 24:1-14', pericope: 'The Cooking Pot' },
        { ref: '24:15-27', esvRef: 'Ezekiel 24:15-27', pericope: "The Death of Ezekiel's Wife; A Sign" },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-17', esvRef: 'Ezekiel 25:1-17', pericope: 'Prophecies Against Ammon, Moab, Edom, and Philistia' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-21', esvRef: 'Ezekiel 26:1-21', pericope: 'Prophecy Against Tyre' },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-36', esvRef: 'Ezekiel 27:1-36', pericope: "A Lament Over Tyre's Destruction" },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-19', esvRef: 'Ezekiel 28:1-19', pericope: 'Prophecy Against the Prince and King of Tyre' },
        { ref: '28:20-26', esvRef: 'Ezekiel 28:20-26', pericope: 'Prophecy Against Sidon; Restoration Promised' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-21', esvRef: 'Ezekiel 29:1-21', pericope: 'Prophecy Against Egypt' },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-26', esvRef: 'Ezekiel 30:1-26', pericope: "Lament for Egypt; Pharaoh's Arm Broken" },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-18', esvRef: 'Ezekiel 31:1-18', pericope: 'Egypt Like a Cedar in Lebanon' },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-32', esvRef: 'Ezekiel 32:1-32', pericope: "A Lament for Pharaoh; Egypt's Descent" },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-20', esvRef: 'Ezekiel 33:1-20', pericope: 'Ezekiel as Watchman; Individual Responsibility' },
        { ref: '33:21-33', esvRef: 'Ezekiel 33:21-33', pericope: 'Jerusalem Has Fallen; The People Will Not Repent' },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-16', esvRef: 'Ezekiel 34:1-16', pericope: 'Prophecy Against the Shepherds of Israel' },
        { ref: '34:17-31', esvRef: 'Ezekiel 34:17-31', pericope: "God Will Be Israel's Shepherd; The Covenant of Peace" },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-15', esvRef: 'Ezekiel 35:1-15', pericope: "Prophecy Against Edom" },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-15', esvRef: 'Ezekiel 36:1-15', pericope: "Prophecy to the Mountains of Israel" },
        { ref: '36:16-38', esvRef: 'Ezekiel 36:16-38', pericope: 'The Restoration of Israel; A New Heart and Spirit' },
      ]},
      { ch: 37, chunks: [
        { ref: '37:1-14', esvRef: 'Ezekiel 37:1-14', pericope: 'The Valley of Dry Bones' },
        { ref: '37:15-28', esvRef: 'Ezekiel 37:15-28', pericope: 'The Two Sticks; One Nation Under David' },
      ]},
      { ch: 38, chunks: [
        { ref: '38:1-23', esvRef: 'Ezekiel 38:1-23', pericope: "Prophecy Against Gog" },
      ]},
      { ch: 39, chunks: [
        { ref: '39:1-29', esvRef: 'Ezekiel 39:1-29', pericope: "Gog's Defeat; Israel's Restoration" },
      ]},
      { ch: 40, chunks: [
        { ref: '40:1-49', esvRef: 'Ezekiel 40:1-49', pericope: 'The Vision of the New Temple: The Gates and Courts' },
      ]},
      { ch: 41, chunks: [
        { ref: '41:1-26', esvRef: 'Ezekiel 41:1-26', pericope: 'The Inner Temple' },
      ]},
      { ch: 42, chunks: [
        { ref: '42:1-20', esvRef: 'Ezekiel 42:1-20', pericope: "The Priests' Chambers; Dimensions of the Temple Area" },
      ]},
      { ch: 43, chunks: [
        { ref: '43:1-12', esvRef: 'Ezekiel 43:1-12', pericope: 'The Glory Returns to the Temple' },
        { ref: '43:13-27', esvRef: 'Ezekiel 43:13-27', pericope: 'The Altar' },
      ]},
      { ch: 44, chunks: [
        { ref: '44:1-31', esvRef: 'Ezekiel 44:1-31', pericope: "The Closed Gate; The Priests' Duties" },
      ]},
      { ch: 45, chunks: [
        { ref: '45:1-25', esvRef: 'Ezekiel 45:1-25', pericope: "The Sacred District; The Prince's Offerings; The Feasts" },
      ]},
      { ch: 46, chunks: [
        { ref: '46:1-24', esvRef: 'Ezekiel 46:1-24', pericope: 'Offerings; The Prince and His Sons; The Kitchens' },
      ]},
      { ch: 47, chunks: [
        { ref: '47:1-12', esvRef: 'Ezekiel 47:1-12', pericope: 'The River from the Temple' },
        { ref: '47:13-23', esvRef: 'Ezekiel 47:13-23', pericope: 'The Boundaries of the Land' },
      ]},
      { ch: 48, chunks: [
        { ref: '48:1-35', esvRef: 'Ezekiel 48:1-35', pericope: 'Division of the Land; The New Jerusalem' },
      ]},
    ]
  },
  {
    id: 'daniel',
    name: 'Daniel',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-7', esvRef: 'Daniel 1:1-7', pericope: 'Daniel and His Friends in Babylon' },
        { ref: '1:8-21', esvRef: 'Daniel 1:8-21', pericope: "Daniel's Faithfulness" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-23', esvRef: 'Daniel 2:1-23', pericope: "Nebuchadnezzar's Dream" },
        { ref: '2:24-49', esvRef: 'Daniel 2:24-49', pericope: 'Daniel Interprets the Dream' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-18', esvRef: 'Daniel 3:1-18', pericope: "The Fiery Furnace" },
        { ref: '3:19-30', esvRef: 'Daniel 3:19-30', pericope: 'Shadrach, Meshach, and Abednego Delivered' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-18', esvRef: 'Daniel 4:1-18', pericope: "Nebuchadnezzar's Dream of a Tree" },
        { ref: '4:19-37', esvRef: 'Daniel 4:19-37', pericope: 'Daniel Interprets; The Dream Fulfilled' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-16', esvRef: 'Daniel 5:1-16', pericope: 'The Writing on the Wall' },
        { ref: '5:17-31', esvRef: 'Daniel 5:17-31', pericope: 'Daniel Interprets the Writing' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-15', esvRef: 'Daniel 6:1-15', pericope: "Daniel in the Lions' Den" },
        { ref: '6:16-28', esvRef: 'Daniel 6:16-28', pericope: 'Daniel Delivered' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-14', esvRef: 'Daniel 7:1-14', pericope: "Daniel's Vision of the Four Beasts" },
        { ref: '7:15-28', esvRef: 'Daniel 7:15-28', pericope: 'The Interpretation of the Vision' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-14', esvRef: 'Daniel 8:1-14', pericope: 'The Vision of the Ram and the Goat' },
        { ref: '8:15-27', esvRef: 'Daniel 8:15-27', pericope: 'The Interpretation' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-19', esvRef: 'Daniel 9:1-19', pericope: "Daniel's Prayer for His People" },
        { ref: '9:20-27', esvRef: 'Daniel 9:20-27', pericope: 'The Seventy Weeks' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-21', esvRef: 'Daniel 10:1-21', pericope: 'Daniel\'s Vision of a Man' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-45', esvRef: 'Daniel 11:1-45', pericope: 'The Coming Conflicts' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-13', esvRef: 'Daniel 12:1-13', pericope: 'The Time of the End' },
      ]},
    ]
  },
  {
    id: 'hosea',
    name: 'Hosea',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-9', esvRef: 'Hosea 1:1-9', pericope: "Hosea's Marriage and Children" },
        { ref: '1:10-11', esvRef: 'Hosea 1:10-11', pericope: "Israel's Restoration Promised" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-13', esvRef: 'Hosea 2:1-13', pericope: "Israel's Unfaithfulness" },
        { ref: '2:14-23', esvRef: 'Hosea 2:14-23', pericope: "The Lord's Love for Israel Renewed" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-5', esvRef: 'Hosea 3:1-5', pericope: "Hosea Redeems His Wife; Israel's Return" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-19', esvRef: 'Hosea 4:1-19', pericope: "Israel's Spiritual Whoredom; Priests Condemned" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-15', esvRef: 'Hosea 5:1-15', pericope: "Judgment on Israel and Judah" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-3', esvRef: 'Hosea 6:1-3', pericope: 'A Call to Return' },
        { ref: '6:4-11', esvRef: 'Hosea 6:4-11', pericope: "Israel's Treachery" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-16', esvRef: 'Hosea 7:1-16', pericope: "Israel's Political Corruption and Foolishness" },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-14', esvRef: 'Hosea 8:1-14', pericope: "Israel Reaps the Whirlwind" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-17', esvRef: 'Hosea 9:1-17', pericope: "Punishment for Israel's Sin" },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-15', esvRef: 'Hosea 10:1-15', pericope: "Israel's Guilt and Punishment" },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-11', esvRef: 'Hosea 11:1-11', pericope: "God's Love for Israel" },
        { ref: '11:12-12:1', esvRef: 'Hosea 11:12-12:1', pericope: "Israel's Treachery" },
      ]},
      { ch: 12, chunks: [
        { ref: '12:2-14', esvRef: 'Hosea 12:2-14', pericope: "The Lord's Contention with Israel" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-16', esvRef: 'Hosea 13:1-16', pericope: "Israel's Apostasy; Coming Destruction" },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-9', esvRef: 'Hosea 14:1-9', pericope: "A Plea to Return; The Lord's Promise of Healing" },
      ]},
    ]
  },
  {
    id: 'joel',
    name: 'Joel',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-12', esvRef: 'Joel 1:1-12', pericope: 'The Locust Plague' },
        { ref: '1:13-20', esvRef: 'Joel 1:13-20', pericope: 'A Call to Lamentation' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: 'Joel 2:1-11', pericope: 'The Day of the Lord' },
        { ref: '2:12-17', esvRef: 'Joel 2:12-17', pericope: 'A Call to Repentance' },
        { ref: '2:18-27', esvRef: 'Joel 2:18-27', pericope: "The Lord's Response" },
        { ref: '2:28-32', esvRef: 'Joel 2:28-32', pericope: 'The Promise of the Spirit' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-16', esvRef: 'Joel 3:1-16', pericope: 'Judgment of the Nations' },
        { ref: '3:17-21', esvRef: 'Joel 3:17-21', pericope: "The Lord's Blessing on Judah" },
      ]},
    ]
  },
  {
    id: 'amos',
    name: 'Amos',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-2', esvRef: 'Amos 1:1-2', pericope: 'Introduction' },
        { ref: '1:3-15', esvRef: 'Amos 1:3-15', pericope: 'Judgment on Syria and Philistia' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-8', esvRef: 'Amos 2:1-8', pericope: 'Judgment on Moab and Israel' },
        { ref: '2:9-16', esvRef: 'Amos 2:9-16', pericope: "Israel's Ingratitude and Doom" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: 'Amos 3:1-15', pericope: "Israel's Punishment Announced" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-13', esvRef: 'Amos 4:1-13', pericope: "Israel's Failure to Return to God" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-17', esvRef: 'Amos 5:1-17', pericope: 'A Lament for Israel; Seek the Lord' },
        { ref: '5:18-27', esvRef: 'Amos 5:18-27', pericope: "The Day of the Lord; Israel's Empty Religion" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-14', esvRef: 'Amos 6:1-14', pericope: 'Woe to the Complacent' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-9', esvRef: 'Amos 7:1-9', pericope: 'Three Visions: Locusts, Fire, Plumb Line' },
        { ref: '7:10-17', esvRef: 'Amos 7:10-17', pericope: 'Amaziah Confronts Amos' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-14', esvRef: 'Amos 8:1-14', pericope: 'The Vision of the Basket of Summer Fruit; A Famine of the Word' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-10', esvRef: 'Amos 9:1-10', pericope: 'The Vision of the Lord Beside the Altar' },
        { ref: '9:11-15', esvRef: 'Amos 9:11-15', pericope: "The Restoration of Israel" },
      ]},
    ]
  },
  {
    id: 'obadiah',
    name: 'Obadiah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-9', esvRef: 'Obadiah 1:1-9', pericope: "Edom's Pride and Coming Judgment" },
        { ref: '1:10-16', esvRef: 'Obadiah 1:10-16', pericope: "Edom's Sin Against Judah" },
        { ref: '1:17-21', esvRef: 'Obadiah 1:17-21', pericope: "The Restoration of Israel" },
      ]},
    ]
  },
  {
    id: 'jonah',
    name: 'Jonah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-17', esvRef: 'Jonah 1:1-17', pericope: 'Jonah Flees; Swallowed by a Great Fish' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-10', esvRef: 'Jonah 2:1-10', pericope: "Jonah's Prayer" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-10', esvRef: 'Jonah 3:1-10', pericope: 'Jonah Goes to Nineveh; Nineveh Repents' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-11', esvRef: 'Jonah 4:1-11', pericope: "Jonah's Anger; God's Compassion" },
      ]},
    ]
  },
  {
    id: 'micah',
    name: 'Micah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-16', esvRef: 'Micah 1:1-16', pericope: 'Judgment Against Samaria and Jerusalem' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: 'Micah 2:1-11', pericope: 'Woe to the Oppressors; False Prophets' },
        { ref: '2:12-13', esvRef: 'Micah 2:12-13', pericope: 'Promise of a Remnant' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-12', esvRef: 'Micah 3:1-12', pericope: "Rulers and Prophets Condemned; Zion's Ruin Foretold" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-5', esvRef: 'Micah 4:1-5', pericope: 'The Mountain of the Lord' },
        { ref: '4:6-13', esvRef: 'Micah 4:6-13', pericope: "The Lord's Plan for Zion" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-6', esvRef: 'Micah 5:1-6', pericope: 'The Ruler from Bethlehem' },
        { ref: '5:7-15', esvRef: 'Micah 5:7-15', pericope: 'The Remnant of Jacob' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-8', esvRef: 'Micah 6:1-8', pericope: "What Does the Lord Require?" },
        { ref: '6:9-16', esvRef: 'Micah 6:9-16', pericope: "Israel's Wickedness Condemned" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-7', esvRef: 'Micah 7:1-7', pericope: "Micah's Lament; His Hope in God" },
        { ref: '7:8-20', esvRef: 'Micah 7:8-20', pericope: "Israel's Restoration; God's Unfailing Love" },
      ]},
    ]
  },
  {
    id: 'nahum',
    name: 'Nahum',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-8', esvRef: 'Nahum 1:1-8', pericope: "God's Vengeance and Goodness" },
        { ref: '1:9-15', esvRef: 'Nahum 1:9-15', pericope: "Nineveh's Doom; Judah's Deliverance" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-13', esvRef: 'Nahum 2:1-13', pericope: 'The Fall of Nineveh' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-19', esvRef: 'Nahum 3:1-19', pericope: "Woe to Nineveh; Its Utter Ruin" },
      ]},
    ]
  },
  {
    id: 'habakkuk',
    name: 'Habakkuk',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: 'Habakkuk 1:1-11', pericope: "Habakkuk's Complaint; The Lord's Answer" },
        { ref: '1:12-17', esvRef: 'Habakkuk 1:12-17', pericope: "Habakkuk's Second Complaint" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-5', esvRef: 'Habakkuk 2:1-5', pericope: "The Lord's Second Answer: The Righteous Shall Live by Faith" },
        { ref: '2:6-20', esvRef: 'Habakkuk 2:6-20', pericope: 'Woes to the Wicked' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: 'Habakkuk 3:1-15', pericope: "Habakkuk's Prayer" },
        { ref: '3:16-19', esvRef: 'Habakkuk 3:16-19', pericope: 'Habakkuk Rejoices in the Lord' },
      ]},
    ]
  },
  {
    id: 'zephaniah',
    name: 'Zephaniah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-18', esvRef: 'Zephaniah 1:1-18', pericope: 'The Coming Day of the Lord' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-15', esvRef: 'Zephaniah 2:1-15', pericope: 'A Call to Repentance; Judgment on the Nations' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-8', esvRef: 'Zephaniah 3:1-8', pericope: "Jerusalem's Corruption; The Lord's Judgment" },
        { ref: '3:9-20', esvRef: 'Zephaniah 3:9-20', pericope: "The Lord's Promise of Restoration" },
      ]},
    ]
  },
  {
    id: 'haggai',
    name: 'Haggai',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-15', esvRef: 'Haggai 1:1-15', pericope: 'The Call to Rebuild the Temple' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-9', esvRef: 'Haggai 2:1-9', pericope: 'The Coming Glory of the Temple' },
        { ref: '2:10-19', esvRef: 'Haggai 2:10-19', pericope: 'Blessings for a Defiled People' },
        { ref: '2:20-23', esvRef: 'Haggai 2:20-23', pericope: "Zerubbabel God's Signet Ring" },
      ]},
    ]
  },
  {
    id: 'zechariah',
    name: 'Zechariah',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-6', esvRef: 'Zechariah 1:1-6', pericope: 'A Call to Return to the Lord' },
        { ref: '1:7-17', esvRef: 'Zechariah 1:7-17', pericope: 'The Man Among the Myrtle Trees' },
        { ref: '1:18-21', esvRef: 'Zechariah 1:18-21', pericope: 'The Four Horns and Four Craftsmen' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-13', esvRef: 'Zechariah 2:1-13', pericope: 'The Man with the Measuring Line' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-10', esvRef: 'Zechariah 3:1-10', pericope: 'Joshua the High Priest' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-14', esvRef: 'Zechariah 4:1-14', pericope: 'The Golden Lampstand and the Two Olive Trees' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-4', esvRef: 'Zechariah 5:1-4', pericope: 'The Flying Scroll' },
        { ref: '5:5-11', esvRef: 'Zechariah 5:5-11', pericope: 'A Woman in a Basket' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-8', esvRef: 'Zechariah 6:1-8', pericope: 'Four Chariots' },
        { ref: '6:9-15', esvRef: 'Zechariah 6:9-15', pericope: 'The Crown and the Branch' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-14', esvRef: 'Zechariah 7:1-14', pericope: 'The Question About Fasting; Obedience Better Than Fasting' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-23', esvRef: 'Zechariah 8:1-23', pericope: "The Lord's Promises to Zion; Fasting Turned to Joy" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-8', esvRef: 'Zechariah 9:1-8', pericope: 'Judgment of Surrounding Nations' },
        { ref: '9:9-17', esvRef: 'Zechariah 9:9-17', pericope: 'The Coming King; Victory of the Lord' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-12', esvRef: 'Zechariah 10:1-12', pericope: 'The Lord Will Restore Israel' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-17', esvRef: 'Zechariah 11:1-17', pericope: 'Two Shepherds' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-9', esvRef: 'Zechariah 12:1-9', pericope: 'The Lord Will Give Victory to Judah' },
        { ref: '12:10-14', esvRef: 'Zechariah 12:10-14', pericope: 'Mourning for the One They Have Pierced' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-6', esvRef: 'Zechariah 13:1-6', pericope: 'Cleansing from Sin; False Prophets Eliminated' },
        { ref: '13:7-9', esvRef: 'Zechariah 13:7-9', pericope: 'The Shepherd Struck; the Flock Scattered' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-11', esvRef: 'Zechariah 14:1-11', pericope: 'The Coming Day of the Lord' },
        { ref: '14:12-21', esvRef: 'Zechariah 14:12-21', pericope: 'The Nations Will Worship the King' },
      ]},
    ]
  },
  {
    id: 'malachi',
    name: 'Malachi',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-5', esvRef: 'Malachi 1:1-5', pericope: "Israel Is the Lord's Loved One" },
        { ref: '1:6-14', esvRef: 'Malachi 1:6-14', pericope: "The Priests' Corrupt Offerings" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-9', esvRef: 'Malachi 2:1-9', pericope: 'Warning to the Priests' },
        { ref: '2:10-16', esvRef: 'Malachi 2:10-16', pericope: 'Faithlessness in Marriage' },
        { ref: '2:17', esvRef: 'Malachi 2:17', pericope: 'Wearying the Lord with Words' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-6', esvRef: 'Malachi 3:1-6', pericope: 'The Messenger of the Covenant' },
        { ref: '3:7-12', esvRef: 'Malachi 3:7-12', pericope: 'Robbing God; Test Me in This' },
        { ref: '3:13-18', esvRef: 'Malachi 3:13-18', pericope: 'The Righteous and the Wicked Distinguished' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-3', esvRef: 'Malachi 4:1-3', pericope: 'The Great Day of the Lord' },
        { ref: '4:4-6', esvRef: 'Malachi 4:4-6', pericope: 'Remember the Law; Elijah Will Come' },
      ]},
    ]
  },

  // ── New Testament ──────────────────────────────────────────────────────────

  {
    id: 'matthew',
    name: 'Matthew',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-17', esvRef: 'Matthew 1:1-17', pericope: 'The Genealogy of Jesus Christ' },
        { ref: '1:18-25', esvRef: 'Matthew 1:18-25', pericope: 'The Birth of Jesus Christ' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12', esvRef: 'Matthew 2:1-12', pericope: 'The Visit of the Wise Men' },
        { ref: '2:13-18', esvRef: 'Matthew 2:13-18', pericope: 'The Flight to Egypt' },
        { ref: '2:19-23', esvRef: 'Matthew 2:19-23', pericope: 'The Return to Nazareth' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-12', esvRef: 'Matthew 3:1-12', pericope: 'John the Baptist Prepares the Way' },
        { ref: '3:13-17', esvRef: 'Matthew 3:13-17', pericope: 'The Baptism of Jesus' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-11', esvRef: 'Matthew 4:1-11', pericope: 'The Temptation of Jesus' },
        { ref: '4:12-17', esvRef: 'Matthew 4:12-17', pericope: 'Jesus Begins His Ministry' },
        { ref: '4:18-22', esvRef: 'Matthew 4:18-22', pericope: 'Jesus Calls the First Disciples' },
        { ref: '4:23-25', esvRef: 'Matthew 4:23-25', pericope: 'Jesus Ministers to Great Crowds' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-12', esvRef: 'Matthew 5:1-12', pericope: 'The Beatitudes' },
        { ref: '5:13-16', esvRef: 'Matthew 5:13-16', pericope: 'Salt and Light' },
        { ref: '5:17-20', esvRef: 'Matthew 5:17-20', pericope: 'Christ Came to Fulfill the Law' },
        { ref: '5:21-26', esvRef: 'Matthew 5:21-26', pericope: 'Anger' },
        { ref: '5:27-30', esvRef: 'Matthew 5:27-30', pericope: 'Lust' },
        { ref: '5:31-32', esvRef: 'Matthew 5:31-32', pericope: 'Divorce' },
        { ref: '5:33-37', esvRef: 'Matthew 5:33-37', pericope: 'Oaths' },
        { ref: '5:38-42', esvRef: 'Matthew 5:38-42', pericope: 'Retaliation' },
        { ref: '5:43-48', esvRef: 'Matthew 5:43-48', pericope: 'Love Your Enemies' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-4', esvRef: 'Matthew 6:1-4', pericope: 'Giving to the Needy' },
        { ref: '6:5-15', esvRef: 'Matthew 6:5-15', pericope: "The Lord's Prayer" },
        { ref: '6:16-18', esvRef: 'Matthew 6:16-18', pericope: 'Fasting' },
        { ref: '6:19-24', esvRef: 'Matthew 6:19-24', pericope: 'Lay Up Treasures in Heaven' },
        { ref: '6:25-34', esvRef: 'Matthew 6:25-34', pericope: 'Do Not Be Anxious' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-6', esvRef: 'Matthew 7:1-6', pericope: 'Judging Others' },
        { ref: '7:7-12', esvRef: 'Matthew 7:7-12', pericope: 'Ask, and It Will Be Given' },
        { ref: '7:13-14', esvRef: 'Matthew 7:13-14', pericope: 'The Narrow Gate' },
        { ref: '7:15-20', esvRef: 'Matthew 7:15-20', pericope: 'A Tree and Its Fruit' },
        { ref: '7:21-23', esvRef: 'Matthew 7:21-23', pericope: 'I Never Knew You' },
        { ref: '7:24-29', esvRef: 'Matthew 7:24-29', pericope: 'Build Your House on the Rock' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-4', esvRef: 'Matthew 8:1-4', pericope: 'Jesus Cleanses a Leper' },
        { ref: '8:5-13', esvRef: 'Matthew 8:5-13', pericope: 'The Faith of a Centurion' },
        { ref: '8:14-17', esvRef: 'Matthew 8:14-17', pericope: 'Jesus Heals Many' },
        { ref: '8:18-22', esvRef: 'Matthew 8:18-22', pericope: 'The Cost of Following Jesus' },
        { ref: '8:23-27', esvRef: 'Matthew 8:23-27', pericope: 'Jesus Calms the Storm' },
        { ref: '8:28-34', esvRef: 'Matthew 8:28-34', pericope: 'Jesus Heals Two Demon-Possessed Men' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-8', esvRef: 'Matthew 9:1-8', pericope: 'Jesus Heals a Paralytic' },
        { ref: '9:9-13', esvRef: 'Matthew 9:9-13', pericope: 'The Call of Matthew' },
        { ref: '9:14-17', esvRef: 'Matthew 9:14-17', pericope: 'A Question About Fasting' },
        { ref: '9:18-26', esvRef: 'Matthew 9:18-26', pericope: 'A Girl Restored and a Woman Healed' },
        { ref: '9:27-31', esvRef: 'Matthew 9:27-31', pericope: 'Jesus Heals Two Blind Men' },
        { ref: '9:32-34', esvRef: 'Matthew 9:32-34', pericope: 'A Mute Man Speaks' },
        { ref: '9:35-38', esvRef: 'Matthew 9:35-38', pericope: 'The Harvest Is Plentiful' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-15', esvRef: 'Matthew 10:1-15', pericope: 'The Twelve Apostles Sent Out' },
        { ref: '10:16-25', esvRef: 'Matthew 10:16-25', pericope: 'Persecution Will Come' },
        { ref: '10:26-33', esvRef: 'Matthew 10:26-33', pericope: 'Have No Fear' },
        { ref: '10:34-39', esvRef: 'Matthew 10:34-39', pericope: 'Not Peace, but a Sword' },
        { ref: '10:40-42', esvRef: 'Matthew 10:40-42', pericope: 'Whoever Receives You Receives Me' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-19', esvRef: 'Matthew 11:1-19', pericope: 'Jesus and John the Baptist' },
        { ref: '11:20-24', esvRef: 'Matthew 11:20-24', pericope: 'Woe to Unrepentant Cities' },
        { ref: '11:25-30', esvRef: 'Matthew 11:25-30', pericope: 'Come to Me, and I Will Give You Rest' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-8', esvRef: 'Matthew 12:1-8', pericope: 'Jesus Is Lord of the Sabbath' },
        { ref: '12:9-14', esvRef: 'Matthew 12:9-14', pericope: 'A Man with a Withered Hand' },
        { ref: '12:15-21', esvRef: 'Matthew 12:15-21', pericope: "God's Chosen Servant" },
        { ref: '12:22-32', esvRef: 'Matthew 12:22-32', pericope: 'Blasphemy Against the Holy Spirit' },
        { ref: '12:33-37', esvRef: 'Matthew 12:33-37', pericope: 'A Tree Is Known by Its Fruit' },
        { ref: '12:38-42', esvRef: 'Matthew 12:38-42', pericope: 'The Sign of Jonah' },
        { ref: '12:43-45', esvRef: 'Matthew 12:43-45', pericope: 'The Return of an Unclean Spirit' },
        { ref: '12:46-50', esvRef: 'Matthew 12:46-50', pericope: "Jesus' Mother and Brothers" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-23', esvRef: 'Matthew 13:1-23', pericope: 'The Parable of the Sower' },
        { ref: '13:24-30', esvRef: 'Matthew 13:24-30', pericope: 'The Parable of the Weeds' },
        { ref: '13:31-33', esvRef: 'Matthew 13:31-33', pericope: 'Mustard Seed and Leaven' },
        { ref: '13:34-43', esvRef: 'Matthew 13:34-43', pericope: 'Weeds Among the Wheat Explained' },
        { ref: '13:44-46', esvRef: 'Matthew 13:44-46', pericope: 'Parables of Hidden Treasure and Pearl' },
        { ref: '13:47-52', esvRef: 'Matthew 13:47-52', pericope: 'The Parable of the Net' },
        { ref: '13:53-58', esvRef: 'Matthew 13:53-58', pericope: 'Jesus Rejected at Nazareth' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-12', esvRef: 'Matthew 14:1-12', pericope: 'The Death of John the Baptist' },
        { ref: '14:13-21', esvRef: 'Matthew 14:13-21', pericope: 'Jesus Feeds the Five Thousand' },
        { ref: '14:22-33', esvRef: 'Matthew 14:22-33', pericope: 'Jesus Walks on Water' },
        { ref: '14:34-36', esvRef: 'Matthew 14:34-36', pericope: 'Jesus Heals the Sick at Gennesaret' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-20', esvRef: 'Matthew 15:1-20', pericope: 'What Defiles a Person' },
        { ref: '15:21-28', esvRef: 'Matthew 15:21-28', pericope: 'The Faith of a Canaanite Woman' },
        { ref: '15:29-39', esvRef: 'Matthew 15:29-39', pericope: 'Jesus Heals Many and Feeds Four Thousand' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-12', esvRef: 'Matthew 16:1-12', pericope: 'The Leaven of the Pharisees and Sadducees' },
        { ref: '16:13-20', esvRef: 'Matthew 16:13-20', pericope: "Peter's Confession of Christ" },
        { ref: '16:21-28', esvRef: 'Matthew 16:21-28', pericope: 'Jesus Foretells His Death and Resurrection' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-13', esvRef: 'Matthew 17:1-13', pericope: 'The Transfiguration' },
        { ref: '17:14-21', esvRef: 'Matthew 17:14-21', pericope: 'Jesus Heals a Boy with a Demon' },
        { ref: '17:22-23', esvRef: 'Matthew 17:22-23', pericope: 'Jesus Again Foretells His Death' },
        { ref: '17:24-27', esvRef: 'Matthew 17:24-27', pericope: 'The Temple Tax' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-6', esvRef: 'Matthew 18:1-6', pericope: 'Who Is the Greatest?' },
        { ref: '18:7-9', esvRef: 'Matthew 18:7-9', pericope: 'Temptations to Sin' },
        { ref: '18:10-14', esvRef: 'Matthew 18:10-14', pericope: 'The Parable of the Lost Sheep' },
        { ref: '18:15-20', esvRef: 'Matthew 18:15-20', pericope: 'If Your Brother Sins Against You' },
        { ref: '18:21-35', esvRef: 'Matthew 18:21-35', pericope: 'The Parable of the Unforgiving Servant' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-12', esvRef: 'Matthew 19:1-12', pericope: 'Teaching About Divorce' },
        { ref: '19:13-15', esvRef: 'Matthew 19:13-15', pericope: 'Let the Children Come to Me' },
        { ref: '19:16-30', esvRef: 'Matthew 19:16-30', pericope: 'The Rich Young Man' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-16', esvRef: 'Matthew 20:1-16', pericope: 'The Parable of the Workers in the Vineyard' },
        { ref: '20:17-19', esvRef: 'Matthew 20:17-19', pericope: 'Jesus Foretells His Death a Third Time' },
        { ref: '20:20-28', esvRef: 'Matthew 20:20-28', pericope: 'The Request of James and John' },
        { ref: '20:29-34', esvRef: 'Matthew 20:29-34', pericope: 'Jesus Heals Two Blind Men' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-11', esvRef: 'Matthew 21:1-11', pericope: 'The Triumphal Entry' },
        { ref: '21:12-17', esvRef: 'Matthew 21:12-17', pericope: 'Jesus Clears the Temple' },
        { ref: '21:18-22', esvRef: 'Matthew 21:18-22', pericope: 'The Cursing of the Fig Tree' },
        { ref: '21:23-27', esvRef: 'Matthew 21:23-27', pericope: 'The Authority of Jesus Challenged' },
        { ref: '21:28-32', esvRef: 'Matthew 21:28-32', pericope: 'The Parable of the Two Sons' },
        { ref: '21:33-46', esvRef: 'Matthew 21:33-46', pericope: 'The Parable of the Tenants' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-14', esvRef: 'Matthew 22:1-14', pericope: 'The Parable of the Wedding Feast' },
        { ref: '22:15-22', esvRef: 'Matthew 22:15-22', pericope: 'Paying Taxes to Caesar' },
        { ref: '22:23-33', esvRef: 'Matthew 22:23-33', pericope: 'Sadducees Ask About the Resurrection' },
        { ref: '22:34-40', esvRef: 'Matthew 22:34-40', pericope: 'The Greatest Commandment' },
        { ref: '22:41-46', esvRef: 'Matthew 22:41-46', pericope: 'Whose Son Is the Christ?' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-12', esvRef: 'Matthew 23:1-12', pericope: 'Beware of the Scribes and Pharisees' },
        { ref: '23:13-22', esvRef: 'Matthew 23:13-22', pericope: 'Seven Woes, Part 1' },
        { ref: '23:23-36', esvRef: 'Matthew 23:23-36', pericope: 'Seven Woes, Part 2' },
        { ref: '23:37-39', esvRef: 'Matthew 23:37-39', pericope: 'Lament over Jerusalem' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-14', esvRef: 'Matthew 24:1-14', pericope: 'Signs of the End of the Age' },
        { ref: '24:15-28', esvRef: 'Matthew 24:15-28', pericope: 'The Abomination of Desolation' },
        { ref: '24:29-35', esvRef: 'Matthew 24:29-35', pericope: 'The Coming of the Son of Man' },
        { ref: '24:36-44', esvRef: 'Matthew 24:36-44', pericope: 'No One Knows That Day and Hour' },
        { ref: '24:45-51', esvRef: 'Matthew 24:45-51', pericope: 'The Faithful or Wicked Servant' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-13', esvRef: 'Matthew 25:1-13', pericope: 'The Parable of the Ten Virgins' },
        { ref: '25:14-30', esvRef: 'Matthew 25:14-30', pericope: 'The Parable of the Talents' },
        { ref: '25:31-46', esvRef: 'Matthew 25:31-46', pericope: 'The Judgment of the Nations' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-13', esvRef: 'Matthew 26:1-13', pericope: 'The Plot to Kill Jesus; Jesus Anointed' },
        { ref: '26:14-25', esvRef: 'Matthew 26:14-25', pericope: 'Judas to Betray Jesus; the Passover' },
        { ref: '26:26-35', esvRef: 'Matthew 26:26-35', pericope: "The Lord's Supper" },
        { ref: '26:36-46', esvRef: 'Matthew 26:36-46', pericope: 'Jesus Prays in Gethsemane' },
        { ref: '26:47-56', esvRef: 'Matthew 26:47-56', pericope: 'The Betrayal and Arrest of Jesus' },
        { ref: '26:57-68', esvRef: 'Matthew 26:57-68', pericope: 'Jesus Before Caiaphas' },
        { ref: '26:69-75', esvRef: 'Matthew 26:69-75', pericope: 'Peter Denies Jesus' },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-10', esvRef: 'Matthew 27:1-10', pericope: 'Jesus Delivered to Pilate; Judas Hangs Himself' },
        { ref: '27:11-26', esvRef: 'Matthew 27:11-26', pericope: 'Jesus Before Pilate' },
        { ref: '27:27-31', esvRef: 'Matthew 27:27-31', pericope: 'The Soldiers Mock Jesus' },
        { ref: '27:32-44', esvRef: 'Matthew 27:32-44', pericope: 'The Crucifixion' },
        { ref: '27:45-56', esvRef: 'Matthew 27:45-56', pericope: 'The Death of Jesus' },
        { ref: '27:57-61', esvRef: 'Matthew 27:57-61', pericope: 'Jesus Is Buried' },
        { ref: '27:62-66', esvRef: 'Matthew 27:62-66', pericope: 'The Guard at the Tomb' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-10', esvRef: 'Matthew 28:1-10', pericope: 'The Resurrection' },
        { ref: '28:11-15', esvRef: 'Matthew 28:11-15', pericope: 'The Report of the Guard' },
        { ref: '28:16-20', esvRef: 'Matthew 28:16-20', pericope: 'The Great Commission' },
      ]},
    ]
  },

  {
    id: 'mark',
    name: 'Mark',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-8', esvRef: 'Mark 1:1-8', pericope: 'John the Baptist Prepares the Way' },
        { ref: '1:9-13', esvRef: 'Mark 1:9-13', pericope: 'The Baptism and Temptation of Jesus' },
        { ref: '1:14-20', esvRef: 'Mark 1:14-20', pericope: 'Jesus Calls the First Disciples' },
        { ref: '1:21-28', esvRef: 'Mark 1:21-28', pericope: 'A Man with an Unclean Spirit' },
        { ref: '1:29-34', esvRef: 'Mark 1:29-34', pericope: 'Jesus Heals Many' },
        { ref: '1:35-39', esvRef: 'Mark 1:35-39', pericope: 'Jesus Preaches in Galilee' },
        { ref: '1:40-45', esvRef: 'Mark 1:40-45', pericope: 'Jesus Cleanses a Leper' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12', esvRef: 'Mark 2:1-12', pericope: 'Jesus Heals a Paralytic' },
        { ref: '2:13-17', esvRef: 'Mark 2:13-17', pericope: 'The Call of Levi' },
        { ref: '2:18-22', esvRef: 'Mark 2:18-22', pericope: 'A Question About Fasting' },
        { ref: '2:23-28', esvRef: 'Mark 2:23-28', pericope: 'Lord of the Sabbath' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-6', esvRef: 'Mark 3:1-6', pericope: 'A Man with a Withered Hand' },
        { ref: '3:7-12', esvRef: 'Mark 3:7-12', pericope: 'A Great Crowd Follows Jesus' },
        { ref: '3:13-19', esvRef: 'Mark 3:13-19', pericope: 'The Twelve Apostles' },
        { ref: '3:20-30', esvRef: 'Mark 3:20-30', pericope: 'Jesus and Beelzebul' },
        { ref: '3:31-35', esvRef: 'Mark 3:31-35', pericope: "Jesus' True Family" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-20', esvRef: 'Mark 4:1-20', pericope: 'The Parable of the Sower' },
        { ref: '4:21-25', esvRef: 'Mark 4:21-25', pericope: 'A Lamp Under a Basket' },
        { ref: '4:26-29', esvRef: 'Mark 4:26-29', pericope: 'The Parable of the Growing Seed' },
        { ref: '4:30-34', esvRef: 'Mark 4:30-34', pericope: 'The Parable of the Mustard Seed' },
        { ref: '4:35-41', esvRef: 'Mark 4:35-41', pericope: 'Jesus Calms the Storm' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-20', esvRef: 'Mark 5:1-20', pericope: 'Jesus Heals a Man with a Demon' },
        { ref: '5:21-43', esvRef: 'Mark 5:21-43', pericope: "Jairus's Daughter and the Woman Who Touched Jesus" },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-6', esvRef: 'Mark 6:1-6', pericope: 'Jesus Rejected at Nazareth' },
        { ref: '6:7-13', esvRef: 'Mark 6:7-13', pericope: 'Jesus Sends Out the Twelve' },
        { ref: '6:14-29', esvRef: 'Mark 6:14-29', pericope: 'The Death of John the Baptist' },
        { ref: '6:30-44', esvRef: 'Mark 6:30-44', pericope: 'Jesus Feeds Five Thousand' },
        { ref: '6:45-52', esvRef: 'Mark 6:45-52', pericope: 'Jesus Walks on Water' },
        { ref: '6:53-56', esvRef: 'Mark 6:53-56', pericope: 'Jesus Heals the Sick at Gennesaret' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-23', esvRef: 'Mark 7:1-23', pericope: 'What Defiles a Person' },
        { ref: '7:24-30', esvRef: 'Mark 7:24-30', pericope: "The Syrophoenician Woman's Faith" },
        { ref: '7:31-37', esvRef: 'Mark 7:31-37', pericope: 'Jesus Heals a Deaf Man' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-10', esvRef: 'Mark 8:1-10', pericope: 'Jesus Feeds Four Thousand' },
        { ref: '8:11-21', esvRef: 'Mark 8:11-21', pericope: 'The Leaven of the Pharisees' },
        { ref: '8:22-26', esvRef: 'Mark 8:22-26', pericope: 'Jesus Heals a Blind Man at Bethsaida' },
        { ref: '8:27-30', esvRef: 'Mark 8:27-30', pericope: "Peter's Confession of Christ" },
        { ref: '8:31-38', esvRef: 'Mark 8:31-38', pericope: 'Jesus Foretells His Death and Resurrection' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-13', esvRef: 'Mark 9:1-13', pericope: 'The Transfiguration' },
        { ref: '9:14-29', esvRef: 'Mark 9:14-29', pericope: 'Jesus Heals a Boy with an Unclean Spirit' },
        { ref: '9:30-37', esvRef: 'Mark 9:30-37', pericope: 'Who Is the Greatest?' },
        { ref: '9:38-50', esvRef: 'Mark 9:38-50', pericope: 'Anyone Not Against Us Is for Us' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-12', esvRef: 'Mark 10:1-12', pericope: 'Teaching About Divorce' },
        { ref: '10:13-16', esvRef: 'Mark 10:13-16', pericope: 'Let the Children Come to Me' },
        { ref: '10:17-31', esvRef: 'Mark 10:17-31', pericope: 'The Rich Young Man' },
        { ref: '10:32-45', esvRef: 'Mark 10:32-45', pericope: 'The Request of James and John' },
        { ref: '10:46-52', esvRef: 'Mark 10:46-52', pericope: 'Blind Bartimaeus' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-11', esvRef: 'Mark 11:1-11', pericope: 'The Triumphal Entry' },
        { ref: '11:12-19', esvRef: 'Mark 11:12-19', pericope: 'Jesus Curses the Fig Tree and Clears the Temple' },
        { ref: '11:20-26', esvRef: 'Mark 11:20-26', pericope: 'The Lesson from the Withered Fig Tree' },
        { ref: '11:27-33', esvRef: 'Mark 11:27-33', pericope: 'The Authority of Jesus Challenged' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-12', esvRef: 'Mark 12:1-12', pericope: 'The Parable of the Tenants' },
        { ref: '12:13-17', esvRef: 'Mark 12:13-17', pericope: 'Paying Taxes to Caesar' },
        { ref: '12:18-27', esvRef: 'Mark 12:18-27', pericope: 'The Sadducees Ask About the Resurrection' },
        { ref: '12:28-34', esvRef: 'Mark 12:28-34', pericope: 'The Greatest Commandment' },
        { ref: '12:35-40', esvRef: 'Mark 12:35-40', pericope: 'Whose Son Is the Christ?' },
        { ref: '12:41-44', esvRef: 'Mark 12:41-44', pericope: "The Widow's Offering" },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-13', esvRef: 'Mark 13:1-13', pericope: 'Jesus Foretells Destruction of the Temple' },
        { ref: '13:14-23', esvRef: 'Mark 13:14-23', pericope: 'The Abomination of Desolation' },
        { ref: '13:24-31', esvRef: 'Mark 13:24-31', pericope: 'The Coming of the Son of Man' },
        { ref: '13:32-37', esvRef: 'Mark 13:32-37', pericope: 'No One Knows the Hour' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-11', esvRef: 'Mark 14:1-11', pericope: 'The Plot to Kill Jesus; Jesus Anointed' },
        { ref: '14:12-25', esvRef: 'Mark 14:12-25', pericope: 'The Passover with the Disciples' },
        { ref: '14:26-42', esvRef: 'Mark 14:26-42', pericope: 'Jesus Prays in Gethsemane' },
        { ref: '14:43-52', esvRef: 'Mark 14:43-52', pericope: 'The Betrayal and Arrest' },
        { ref: '14:53-65', esvRef: 'Mark 14:53-65', pericope: 'Jesus Before the Council' },
        { ref: '14:66-72', esvRef: 'Mark 14:66-72', pericope: 'Peter Denies Jesus' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-15', esvRef: 'Mark 15:1-15', pericope: 'Jesus Before Pilate' },
        { ref: '15:16-20', esvRef: 'Mark 15:16-20', pericope: 'The Soldiers Mock Jesus' },
        { ref: '15:21-32', esvRef: 'Mark 15:21-32', pericope: 'The Crucifixion' },
        { ref: '15:33-41', esvRef: 'Mark 15:33-41', pericope: 'The Death of Jesus' },
        { ref: '15:42-47', esvRef: 'Mark 15:42-47', pericope: 'Jesus Is Buried' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-8', esvRef: 'Mark 16:1-8', pericope: 'The Resurrection' },
        { ref: '16:9-20', esvRef: 'Mark 16:9-20', pericope: 'The Great Commission' },
      ]},
    ]
  },

  {
    id: 'luke',
    name: 'Luke',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-4', esvRef: 'Luke 1:1-4', pericope: "Luke's Prologue" },
        { ref: '1:5-25', esvRef: 'Luke 1:5-25', pericope: 'The Birth of John the Baptist Foretold' },
        { ref: '1:26-38', esvRef: 'Luke 1:26-38', pericope: 'The Announcement to Mary' },
        { ref: '1:39-56', esvRef: 'Luke 1:39-56', pericope: 'Mary Visits Elizabeth' },
        { ref: '1:57-66', esvRef: 'Luke 1:57-66', pericope: 'The Birth of John the Baptist' },
        { ref: '1:67-80', esvRef: 'Luke 1:67-80', pericope: "Zechariah's Song" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-7', esvRef: 'Luke 2:1-7', pericope: 'The Birth of Jesus' },
        { ref: '2:8-20', esvRef: 'Luke 2:8-20', pericope: 'The Shepherds and the Angels' },
        { ref: '2:21-24', esvRef: 'Luke 2:21-24', pericope: 'Jesus Presented at the Temple' },
        { ref: '2:25-35', esvRef: 'Luke 2:25-35', pericope: "Simeon's Song" },
        { ref: '2:36-40', esvRef: 'Luke 2:36-40', pericope: 'Anna the Prophetess' },
        { ref: '2:41-52', esvRef: 'Luke 2:41-52', pericope: 'The Boy Jesus in the Temple' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-20', esvRef: 'Luke 3:1-20', pericope: 'John the Baptist Prepares the Way' },
        { ref: '3:21-22', esvRef: 'Luke 3:21-22', pericope: 'The Baptism of Jesus' },
        { ref: '3:23-38', esvRef: 'Luke 3:23-38', pericope: 'The Genealogy of Jesus' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-13', esvRef: 'Luke 4:1-13', pericope: 'The Temptation of Jesus' },
        { ref: '4:14-15', esvRef: 'Luke 4:14-15', pericope: "Jesus' Ministry Begins" },
        { ref: '4:16-30', esvRef: 'Luke 4:16-30', pericope: 'Jesus Rejected at Nazareth' },
        { ref: '4:31-37', esvRef: 'Luke 4:31-37', pericope: 'Jesus Heals a Man with an Unclean Spirit' },
        { ref: '4:38-41', esvRef: 'Luke 4:38-41', pericope: 'Jesus Heals Many' },
        { ref: '4:42-44', esvRef: 'Luke 4:42-44', pericope: 'Jesus Preaches in Synagogues' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-11', esvRef: 'Luke 5:1-11', pericope: 'Jesus Calls the First Disciples' },
        { ref: '5:12-16', esvRef: 'Luke 5:12-16', pericope: 'Jesus Cleanses a Leper' },
        { ref: '5:17-26', esvRef: 'Luke 5:17-26', pericope: 'Jesus Heals a Paralytic' },
        { ref: '5:27-32', esvRef: 'Luke 5:27-32', pericope: 'The Call of Levi' },
        { ref: '5:33-39', esvRef: 'Luke 5:33-39', pericope: 'A Question About Fasting' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-5', esvRef: 'Luke 6:1-5', pericope: 'Lord of the Sabbath' },
        { ref: '6:6-11', esvRef: 'Luke 6:6-11', pericope: 'A Man with a Withered Hand' },
        { ref: '6:12-16', esvRef: 'Luke 6:12-16', pericope: 'Jesus Chooses the Twelve' },
        { ref: '6:17-26', esvRef: 'Luke 6:17-26', pericope: 'Beatitudes and Woes' },
        { ref: '6:27-36', esvRef: 'Luke 6:27-36', pericope: 'Love Your Enemies' },
        { ref: '6:37-45', esvRef: 'Luke 6:37-45', pericope: 'Judge Not' },
        { ref: '6:46-49', esvRef: 'Luke 6:46-49', pericope: 'Build Your House on the Rock' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-10', esvRef: 'Luke 7:1-10', pericope: 'The Faith of a Centurion' },
        { ref: '7:11-17', esvRef: 'Luke 7:11-17', pericope: "Jesus Raises the Widow's Son" },
        { ref: '7:18-35', esvRef: 'Luke 7:18-35', pericope: 'Messengers from John the Baptist' },
        { ref: '7:36-50', esvRef: 'Luke 7:36-50', pericope: 'A Sinful Woman Forgiven' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-3', esvRef: 'Luke 8:1-3', pericope: 'Women Who Accompanied Jesus' },
        { ref: '8:4-15', esvRef: 'Luke 8:4-15', pericope: 'The Parable of the Sower' },
        { ref: '8:16-18', esvRef: 'Luke 8:16-18', pericope: 'A Lamp Under a Jar' },
        { ref: '8:19-21', esvRef: 'Luke 8:19-21', pericope: "Jesus' Mother and Brothers" },
        { ref: '8:22-25', esvRef: 'Luke 8:22-25', pericope: 'Jesus Calms the Storm' },
        { ref: '8:26-39', esvRef: 'Luke 8:26-39', pericope: 'Jesus Heals a Man with a Demon' },
        { ref: '8:40-56', esvRef: 'Luke 8:40-56', pericope: "Jairus's Daughter and the Woman Who Touched Jesus" },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-9', esvRef: 'Luke 9:1-9', pericope: 'Jesus Sends Out the Twelve' },
        { ref: '9:10-17', esvRef: 'Luke 9:10-17', pericope: 'Jesus Feeds the Five Thousand' },
        { ref: '9:18-22', esvRef: 'Luke 9:18-22', pericope: "Peter's Confession of Christ" },
        { ref: '9:23-27', esvRef: 'Luke 9:23-27', pericope: 'Take Up Your Cross and Follow Me' },
        { ref: '9:28-36', esvRef: 'Luke 9:28-36', pericope: 'The Transfiguration' },
        { ref: '9:37-50', esvRef: 'Luke 9:37-50', pericope: 'Jesus Heals a Boy; Who Is the Greatest?' },
        { ref: '9:51-62', esvRef: 'Luke 9:51-62', pericope: 'The Cost of Following Jesus' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-16', esvRef: 'Luke 10:1-16', pericope: 'Jesus Sends Out the Seventy-Two' },
        { ref: '10:17-24', esvRef: 'Luke 10:17-24', pericope: "The Return of the Seventy-Two; Jesus' Joy" },
        { ref: '10:25-37', esvRef: 'Luke 10:25-37', pericope: 'The Good Samaritan' },
        { ref: '10:38-42', esvRef: 'Luke 10:38-42', pericope: 'Mary and Martha' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-13', esvRef: 'Luke 11:1-13', pericope: "The Lord's Prayer; Keep Asking" },
        { ref: '11:14-28', esvRef: 'Luke 11:14-28', pericope: 'Jesus and Beelzebul' },
        { ref: '11:29-32', esvRef: 'Luke 11:29-32', pericope: 'The Sign of Jonah' },
        { ref: '11:33-36', esvRef: 'Luke 11:33-36', pericope: 'The Light in You' },
        { ref: '11:37-54', esvRef: 'Luke 11:37-54', pericope: 'Woes to the Pharisees and Lawyers' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-12', esvRef: 'Luke 12:1-12', pericope: 'Fear God, Not Man' },
        { ref: '12:13-21', esvRef: 'Luke 12:13-21', pericope: 'The Parable of the Rich Fool' },
        { ref: '12:22-34', esvRef: 'Luke 12:22-34', pericope: 'Do Not Be Anxious' },
        { ref: '12:35-48', esvRef: 'Luke 12:35-48', pericope: 'You Must Be Ready' },
        { ref: '12:49-59', esvRef: 'Luke 12:49-59', pericope: 'Not Peace, but Division; Interpreting the Time' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-9', esvRef: 'Luke 13:1-9', pericope: 'Repent or Perish; The Parable of the Fig Tree' },
        { ref: '13:10-17', esvRef: 'Luke 13:10-17', pericope: 'A Woman with a Disabling Spirit' },
        { ref: '13:18-21', esvRef: 'Luke 13:18-21', pericope: 'The Mustard Seed and the Leaven' },
        { ref: '13:22-30', esvRef: 'Luke 13:22-30', pericope: 'The Narrow Door' },
        { ref: '13:31-35', esvRef: 'Luke 13:31-35', pericope: 'Lament over Jerusalem' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-6', esvRef: 'Luke 14:1-6', pericope: 'Jesus Heals on the Sabbath' },
        { ref: '14:7-14', esvRef: 'Luke 14:7-14', pericope: 'The Parable of the Dinner Guests' },
        { ref: '14:15-24', esvRef: 'Luke 14:15-24', pericope: 'The Parable of the Great Banquet' },
        { ref: '14:25-35', esvRef: 'Luke 14:25-35', pericope: 'The Cost of Discipleship' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-7', esvRef: 'Luke 15:1-7', pericope: 'The Parable of the Lost Sheep' },
        { ref: '15:8-10', esvRef: 'Luke 15:8-10', pericope: 'The Parable of the Lost Coin' },
        { ref: '15:11-32', esvRef: 'Luke 15:11-32', pericope: 'The Parable of the Prodigal Son' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-13', esvRef: 'Luke 16:1-13', pericope: 'The Parable of the Dishonest Manager' },
        { ref: '16:14-18', esvRef: 'Luke 16:14-18', pericope: 'The Law and the Kingdom of God' },
        { ref: '16:19-31', esvRef: 'Luke 16:19-31', pericope: 'The Rich Man and Lazarus' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-10', esvRef: 'Luke 17:1-10', pericope: 'Temptations, Forgiveness, and Faith' },
        { ref: '17:11-19', esvRef: 'Luke 17:11-19', pericope: 'Jesus Cleanses Ten Lepers' },
        { ref: '17:20-37', esvRef: 'Luke 17:20-37', pericope: 'The Coming of the Kingdom of God' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-8', esvRef: 'Luke 18:1-8', pericope: 'The Parable of the Persistent Widow' },
        { ref: '18:9-14', esvRef: 'Luke 18:9-14', pericope: 'The Pharisee and the Tax Collector' },
        { ref: '18:15-17', esvRef: 'Luke 18:15-17', pericope: 'Let the Children Come to Me' },
        { ref: '18:18-30', esvRef: 'Luke 18:18-30', pericope: 'The Rich Ruler' },
        { ref: '18:31-43', esvRef: 'Luke 18:31-43', pericope: 'Jesus Heals a Blind Beggar' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-10', esvRef: 'Luke 19:1-10', pericope: 'Zacchaeus the Tax Collector' },
        { ref: '19:11-27', esvRef: 'Luke 19:11-27', pericope: 'The Parable of the Ten Minas' },
        { ref: '19:28-44', esvRef: 'Luke 19:28-44', pericope: 'The Triumphal Entry' },
        { ref: '19:45-48', esvRef: 'Luke 19:45-48', pericope: 'Jesus Clears the Temple' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-8', esvRef: 'Luke 20:1-8', pericope: 'The Authority of Jesus Challenged' },
        { ref: '20:9-19', esvRef: 'Luke 20:9-19', pericope: 'The Parable of the Tenants' },
        { ref: '20:20-26', esvRef: 'Luke 20:20-26', pericope: 'Paying Taxes to Caesar' },
        { ref: '20:27-40', esvRef: 'Luke 20:27-40', pericope: 'The Sadducees Ask About the Resurrection' },
        { ref: '20:41-47', esvRef: 'Luke 20:41-47', pericope: 'Whose Son Is the Christ? Beware of the Scribes' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-4', esvRef: 'Luke 21:1-4', pericope: "The Widow's Offering" },
        { ref: '21:5-19', esvRef: 'Luke 21:5-19', pericope: 'Jesus Foretells Destruction of the Temple' },
        { ref: '21:20-28', esvRef: 'Luke 21:20-28', pericope: 'The Coming Destruction and the Son of Man' },
        { ref: '21:29-38', esvRef: 'Luke 21:29-38', pericope: 'The Lesson of the Fig Tree; Watch Yourselves' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-6', esvRef: 'Luke 22:1-6', pericope: 'The Plot to Kill Jesus' },
        { ref: '22:7-23', esvRef: 'Luke 22:7-23', pericope: 'The Last Supper' },
        { ref: '22:24-38', esvRef: 'Luke 22:24-38', pericope: 'The Greatest Among You' },
        { ref: '22:39-46', esvRef: 'Luke 22:39-46', pericope: 'Jesus Prays on the Mount of Olives' },
        { ref: '22:47-53', esvRef: 'Luke 22:47-53', pericope: 'The Betrayal and Arrest of Jesus' },
        { ref: '22:54-62', esvRef: 'Luke 22:54-62', pericope: 'Peter Denies Jesus' },
        { ref: '22:63-71', esvRef: 'Luke 22:63-71', pericope: 'Jesus Before the Council' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-25', esvRef: 'Luke 23:1-25', pericope: 'Jesus Before Pilate and Herod' },
        { ref: '23:26-31', esvRef: 'Luke 23:26-31', pericope: 'The Way to the Cross' },
        { ref: '23:32-43', esvRef: 'Luke 23:32-43', pericope: 'The Crucifixion' },
        { ref: '23:44-49', esvRef: 'Luke 23:44-49', pericope: 'The Death of Jesus' },
        { ref: '23:50-56', esvRef: 'Luke 23:50-56', pericope: 'Jesus Is Buried' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-12', esvRef: 'Luke 24:1-12', pericope: 'The Resurrection' },
        { ref: '24:13-35', esvRef: 'Luke 24:13-35', pericope: 'On the Road to Emmaus' },
        { ref: '24:36-49', esvRef: 'Luke 24:36-49', pericope: 'Jesus Appears to the Disciples' },
        { ref: '24:50-53', esvRef: 'Luke 24:50-53', pericope: 'The Ascension' },
      ]},
    ]
  },

  {
    id: 'john',
    name: 'John',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-18', esvRef: 'John 1:1-18', pericope: 'The Prologue' },
        { ref: '1:19-28', esvRef: 'John 1:19-28', pericope: 'The Testimony of John the Baptist' },
        { ref: '1:29-34', esvRef: 'John 1:29-34', pericope: 'The Lamb of God' },
        { ref: '1:35-42', esvRef: 'John 1:35-42', pericope: 'The First Disciples' },
        { ref: '1:43-51', esvRef: 'John 1:43-51', pericope: 'Jesus Calls Philip and Nathanael' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12', esvRef: 'John 2:1-12', pericope: 'The Wedding at Cana' },
        { ref: '2:13-22', esvRef: 'John 2:13-22', pericope: 'Jesus Cleanses the Temple' },
        { ref: '2:23-25', esvRef: 'John 2:23-25', pericope: 'Jesus Knows What Is in Man' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: 'John 3:1-15', pericope: 'You Must Be Born Again' },
        { ref: '3:16-21', esvRef: 'John 3:16-21', pericope: 'For God So Loved the World' },
        { ref: '3:22-30', esvRef: 'John 3:22-30', pericope: 'John the Baptist Exalts Christ' },
        { ref: '3:31-36', esvRef: 'John 3:31-36', pericope: 'He Who Comes from Above' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-9', esvRef: 'John 4:1-9', pericope: 'Jesus and the Woman of Samaria' },
        { ref: '4:10-26', esvRef: 'John 4:10-26', pericope: 'Living Water' },
        { ref: '4:27-42', esvRef: 'John 4:27-42', pericope: 'The Harvest Is Plentiful' },
        { ref: '4:43-54', esvRef: 'John 4:43-54', pericope: "Jesus Heals an Official's Son" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-15', esvRef: 'John 5:1-15', pericope: 'The Healing at the Pool' },
        { ref: '5:16-30', esvRef: 'John 5:16-30', pericope: 'The Authority of the Son' },
        { ref: '5:31-47', esvRef: 'John 5:31-47', pericope: 'Witnesses to Jesus' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-15', esvRef: 'John 6:1-15', pericope: 'Jesus Feeds the Five Thousand' },
        { ref: '6:16-21', esvRef: 'John 6:16-21', pericope: 'Jesus Walks on Water' },
        { ref: '6:22-40', esvRef: 'John 6:22-40', pericope: 'I Am the Bread of Life' },
        { ref: '6:41-59', esvRef: 'John 6:41-59', pericope: 'The Bread from Heaven' },
        { ref: '6:60-71', esvRef: 'John 6:60-71', pericope: 'The Words of Eternal Life' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-13', esvRef: 'John 7:1-13', pericope: 'Jesus at the Feast of Booths' },
        { ref: '7:14-24', esvRef: 'John 7:14-24', pericope: 'Jesus Teaches in the Temple' },
        { ref: '7:25-36', esvRef: 'John 7:25-36', pericope: 'Can This Be the Christ?' },
        { ref: '7:37-44', esvRef: 'John 7:37-44', pericope: 'Rivers of Living Water' },
        { ref: '7:45-53', esvRef: 'John 7:45-53', pericope: 'Division Among the People' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-11', esvRef: 'John 8:1-11', pericope: 'The Woman Caught in Adultery' },
        { ref: '8:12-20', esvRef: 'John 8:12-20', pericope: 'I Am the Light of the World' },
        { ref: '8:21-30', esvRef: 'John 8:21-30', pericope: 'Where I Am Going You Cannot Come' },
        { ref: '8:31-47', esvRef: 'John 8:31-47', pericope: 'The Truth Will Set You Free' },
        { ref: '8:48-59', esvRef: 'John 8:48-59', pericope: 'Before Abraham Was, I Am' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-12', esvRef: 'John 9:1-12', pericope: 'Jesus Heals a Man Born Blind' },
        { ref: '9:13-23', esvRef: 'John 9:13-23', pericope: 'The Pharisees Investigate' },
        { ref: '9:24-34', esvRef: 'John 9:24-34', pericope: 'I Was Blind, Now I See' },
        { ref: '9:35-41', esvRef: 'John 9:35-41', pericope: 'Spiritual Blindness' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-10', esvRef: 'John 10:1-10', pericope: 'I Am the Door' },
        { ref: '10:11-21', esvRef: 'John 10:11-21', pericope: 'I Am the Good Shepherd' },
        { ref: '10:22-30', esvRef: 'John 10:22-30', pericope: 'I and the Father Are One' },
        { ref: '10:31-42', esvRef: 'John 10:31-42', pericope: 'The Father Is in Me' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-16', esvRef: 'John 11:1-16', pericope: 'The Death of Lazarus' },
        { ref: '11:17-27', esvRef: 'John 11:17-27', pericope: 'I Am the Resurrection and the Life' },
        { ref: '11:28-37', esvRef: 'John 11:28-37', pericope: 'Jesus Weeps' },
        { ref: '11:38-44', esvRef: 'John 11:38-44', pericope: 'Lazarus Raised from the Dead' },
        { ref: '11:45-57', esvRef: 'John 11:45-57', pericope: 'The Plot to Kill Jesus' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-8', esvRef: 'John 12:1-8', pericope: 'Mary Anoints Jesus' },
        { ref: '12:9-19', esvRef: 'John 12:9-19', pericope: 'The Triumphal Entry' },
        { ref: '12:20-36', esvRef: 'John 12:20-36', pericope: 'The Hour Has Come' },
        { ref: '12:37-50', esvRef: 'John 12:37-50', pericope: 'Unbelief Despite the Signs' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-17', esvRef: 'John 13:1-17', pericope: "Jesus Washes the Disciples' Feet" },
        { ref: '13:18-30', esvRef: 'John 13:18-30', pericope: 'One of You Will Betray Me' },
        { ref: '13:31-38', esvRef: 'John 13:31-38', pericope: 'The New Commandment' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-7', esvRef: 'John 14:1-7', pericope: 'I Am the Way, the Truth, and the Life' },
        { ref: '14:8-14', esvRef: 'John 14:8-14', pericope: 'Whoever Has Seen Me Has Seen the Father' },
        { ref: '14:15-24', esvRef: 'John 14:15-24', pericope: 'The Promise of the Holy Spirit' },
        { ref: '14:25-31', esvRef: 'John 14:25-31', pericope: 'My Peace I Give to You' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-11', esvRef: 'John 15:1-11', pericope: 'I Am the True Vine' },
        { ref: '15:12-17', esvRef: 'John 15:12-17', pericope: 'Love One Another' },
        { ref: '15:18-27', esvRef: 'John 15:18-27', pericope: 'The World Will Hate You' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-15', esvRef: 'John 16:1-15', pericope: 'The Work of the Holy Spirit' },
        { ref: '16:16-24', esvRef: 'John 16:16-24', pericope: 'Your Sorrow Will Turn to Joy' },
        { ref: '16:25-33', esvRef: 'John 16:25-33', pericope: 'I Have Overcome the World' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-5', esvRef: 'John 17:1-5', pericope: 'The Hour Has Come' },
        { ref: '17:6-19', esvRef: 'John 17:6-19', pericope: 'Jesus Prays for His Disciples' },
        { ref: '17:20-26', esvRef: 'John 17:20-26', pericope: 'Jesus Prays for All Believers' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-11', esvRef: 'John 18:1-11', pericope: 'The Betrayal and Arrest' },
        { ref: '18:12-27', esvRef: 'John 18:12-27', pericope: 'Peter Denies Jesus' },
        { ref: '18:28-40', esvRef: 'John 18:28-40', pericope: 'Jesus Before Pilate' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-16', esvRef: 'John 19:1-16', pericope: 'The Crucifixion Sentence' },
        { ref: '19:17-27', esvRef: 'John 19:17-27', pericope: 'The Crucifixion' },
        { ref: '19:28-37', esvRef: 'John 19:28-37', pericope: 'The Death of Jesus' },
        { ref: '19:38-42', esvRef: 'John 19:38-42', pericope: 'Jesus Is Buried' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-10', esvRef: 'John 20:1-10', pericope: 'The Empty Tomb' },
        { ref: '20:11-18', esvRef: 'John 20:11-18', pericope: 'Jesus Appears to Mary Magdalene' },
        { ref: '20:19-23', esvRef: 'John 20:19-23', pericope: 'Jesus Appears to the Disciples' },
        { ref: '20:24-29', esvRef: 'John 20:24-29', pericope: 'My Lord and My God' },
        { ref: '20:30-31', esvRef: 'John 20:30-31', pericope: 'The Purpose of This Book' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-14', esvRef: 'John 21:1-14', pericope: 'Jesus Appears at the Sea of Tiberias' },
        { ref: '21:15-19', esvRef: 'John 21:15-19', pericope: 'Do You Love Me?' },
        { ref: '21:20-25', esvRef: 'John 21:20-25', pericope: 'The Beloved Disciple' },
      ]},
    ]
  },

  {
    id: 'acts',
    name: 'Acts',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: 'Acts 1:1-11', pericope: 'The Ascension' },
        { ref: '1:12-26', esvRef: 'Acts 1:12-26', pericope: 'Matthias Chosen to Replace Judas' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-13', esvRef: 'Acts 2:1-13', pericope: 'The Coming of the Holy Spirit' },
        { ref: '2:14-36', esvRef: 'Acts 2:14-36', pericope: "Peter's Sermon at Pentecost" },
        { ref: '2:37-47', esvRef: 'Acts 2:37-47', pericope: 'Three Thousand Converted' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-10', esvRef: 'Acts 3:1-10', pericope: 'The Lame Beggar Healed' },
        { ref: '3:11-26', esvRef: 'Acts 3:11-26', pericope: "Peter Speaks in Solomon's Portico" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-22', esvRef: 'Acts 4:1-22', pericope: 'Peter and John Before the Council' },
        { ref: '4:23-31', esvRef: 'Acts 4:23-31', pericope: 'The Believers Pray' },
        { ref: '4:32-37', esvRef: 'Acts 4:32-37', pericope: 'All Things in Common' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-11', esvRef: 'Acts 5:1-11', pericope: 'Ananias and Sapphira' },
        { ref: '5:12-16', esvRef: 'Acts 5:12-16', pericope: 'Signs and Wonders Done by the Apostles' },
        { ref: '5:17-42', esvRef: 'Acts 5:17-42', pericope: 'The Apostles Arrested and Flogged' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-7', esvRef: 'Acts 6:1-7', pericope: 'Seven Chosen to Serve' },
        { ref: '6:8-15', esvRef: 'Acts 6:8-15', pericope: 'Stephen Is Seized' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-53', esvRef: 'Acts 7:1-53', pericope: "Stephen's Address to the Council" },
        { ref: '7:54-60', esvRef: 'Acts 7:54-60', pericope: 'The Stoning of Stephen' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-8', esvRef: 'Acts 8:1-8', pericope: 'Saul Ravages the Church; Philip in Samaria' },
        { ref: '8:9-25', esvRef: 'Acts 8:9-25', pericope: 'Simon the Magician' },
        { ref: '8:26-40', esvRef: 'Acts 8:26-40', pericope: 'Philip and the Ethiopian Eunuch' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-19', esvRef: 'Acts 9:1-19', pericope: 'The Conversion of Saul' },
        { ref: '9:20-31', esvRef: 'Acts 9:20-31', pericope: 'Saul Preaches in Damascus and Jerusalem' },
        { ref: '9:32-43', esvRef: 'Acts 9:32-43', pericope: 'Peter Heals Aeneas and Raises Dorcas' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-23', esvRef: 'Acts 10:1-23', pericope: 'Peter and Cornelius' },
        { ref: '10:24-48', esvRef: 'Acts 10:24-48', pericope: "Peter Preaches to Cornelius's Household" },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-18', esvRef: 'Acts 11:1-18', pericope: 'Peter Reports to the Jerusalem Church' },
        { ref: '11:19-30', esvRef: 'Acts 11:19-30', pericope: 'The Church in Antioch' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-19', esvRef: 'Acts 12:1-19', pericope: "Peter's Miraculous Escape from Prison" },
        { ref: '12:20-25', esvRef: 'Acts 12:20-25', pericope: 'The Death of Herod' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-12', esvRef: 'Acts 13:1-12', pericope: 'Barnabas and Saul Sent Off; Elymas the Sorcerer' },
        { ref: '13:13-52', esvRef: 'Acts 13:13-52', pericope: 'Paul Preaches at Antioch in Pisidia' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-7', esvRef: 'Acts 14:1-7', pericope: 'Paul and Barnabas at Iconium' },
        { ref: '14:8-20', esvRef: 'Acts 14:8-20', pericope: 'Paul and Barnabas at Lystra' },
        { ref: '14:21-28', esvRef: 'Acts 14:21-28', pericope: 'The Return to Antioch' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-21', esvRef: 'Acts 15:1-21', pericope: 'The Jerusalem Council' },
        { ref: '15:22-35', esvRef: 'Acts 15:22-35', pericope: "The Council's Letter" },
        { ref: '15:36-41', esvRef: 'Acts 15:36-41', pericope: 'Paul and Barnabas Separate' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-10', esvRef: 'Acts 16:1-10', pericope: 'Timothy Joins Paul; The Macedonian Call' },
        { ref: '16:11-15', esvRef: 'Acts 16:11-15', pericope: 'Lydia Converted at Philippi' },
        { ref: '16:16-24', esvRef: 'Acts 16:16-24', pericope: 'Paul and Silas Imprisoned' },
        { ref: '16:25-40', esvRef: 'Acts 16:25-40', pericope: 'The Philippian Jailer Converted' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-15', esvRef: 'Acts 17:1-15', pericope: 'Paul in Thessalonica and Berea' },
        { ref: '17:16-34', esvRef: 'Acts 17:16-34', pericope: 'Paul in Athens' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-17', esvRef: 'Acts 18:1-17', pericope: 'Paul in Corinth' },
        { ref: '18:18-28', esvRef: 'Acts 18:18-28', pericope: 'Paul Returns to Antioch; Apollos at Ephesus' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-12', esvRef: 'Acts 19:1-12', pericope: 'Paul in Ephesus' },
        { ref: '19:13-22', esvRef: 'Acts 19:13-22', pericope: 'Sons of Sceva; Book Burning' },
        { ref: '19:23-41', esvRef: 'Acts 19:23-41', pericope: 'The Riot in Ephesus' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-12', esvRef: 'Acts 20:1-12', pericope: "Paul's Journey to Greece; Eutychus" },
        { ref: '20:13-38', esvRef: 'Acts 20:13-38', pericope: 'Paul Speaks to the Ephesian Elders' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-16', esvRef: 'Acts 21:1-16', pericope: 'Paul Arrives at Jerusalem' },
        { ref: '21:17-26', esvRef: 'Acts 21:17-26', pericope: 'Paul Meets with James' },
        { ref: '21:27-40', esvRef: 'Acts 21:27-40', pericope: 'Paul Arrested in the Temple' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-21', esvRef: 'Acts 22:1-21', pericope: "Paul's Defense Before the People" },
        { ref: '22:22-30', esvRef: 'Acts 22:22-30', pericope: 'Paul and the Roman Tribune' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-11', esvRef: 'Acts 23:1-11', pericope: 'Paul Before the Council' },
        { ref: '23:12-22', esvRef: 'Acts 23:12-22', pericope: 'The Plot to Kill Paul' },
        { ref: '23:23-35', esvRef: 'Acts 23:23-35', pericope: 'Paul Sent to Felix' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-27', esvRef: 'Acts 24:1-27', pericope: 'Paul Before Felix' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-12', esvRef: 'Acts 25:1-12', pericope: 'Paul Appeals to Caesar' },
        { ref: '25:13-27', esvRef: 'Acts 25:13-27', pericope: 'Paul Before King Agrippa' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-32', esvRef: 'Acts 26:1-32', pericope: "Paul's Defense Before Agrippa" },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-12', esvRef: 'Acts 27:1-12', pericope: 'Paul Sails for Rome' },
        { ref: '27:13-38', esvRef: 'Acts 27:13-38', pericope: 'The Storm at Sea' },
        { ref: '27:39-44', esvRef: 'Acts 27:39-44', pericope: 'The Shipwreck' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-10', esvRef: 'Acts 28:1-10', pericope: 'Paul on Malta' },
        { ref: '28:11-16', esvRef: 'Acts 28:11-16', pericope: 'Paul Arrives at Rome' },
        { ref: '28:17-31', esvRef: 'Acts 28:17-31', pericope: 'Paul Preaches at Rome' },
      ]},
    ]
  },
  {
    id: 'romans',
    name: 'Romans',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-7', esvRef: 'Romans 1:1-7', pericope: 'Greeting' },
        { ref: '1:8-15', esvRef: 'Romans 1:8-15', pericope: 'Longing to Visit Rome' },
        { ref: '1:16-17', esvRef: 'Romans 1:16-17', pericope: 'The Righteous Shall Live by Faith' },
        { ref: '1:18-32', esvRef: 'Romans 1:18-32', pericope: "God's Wrath on Unrighteousness" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-16', esvRef: 'Romans 2:1-16', pericope: "God's Righteous Judgment" },
        { ref: '2:17-29', esvRef: 'Romans 2:17-29', pericope: 'Jews and the Law' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-8', esvRef: 'Romans 3:1-8', pericope: "God's Faithfulness" },
        { ref: '3:9-20', esvRef: 'Romans 3:9-20', pericope: 'No One Is Righteous' },
        { ref: '3:21-31', esvRef: 'Romans 3:21-31', pericope: 'The Righteousness of God Through Faith' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-12', esvRef: 'Romans 4:1-12', pericope: 'Abraham Justified by Faith' },
        { ref: '4:13-25', esvRef: 'Romans 4:13-25', pericope: 'The Promise Realized Through Faith' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-11', esvRef: 'Romans 5:1-11', pericope: 'Peace with God Through Faith' },
        { ref: '5:12-21', esvRef: 'Romans 5:12-21', pericope: 'Death in Adam, Life in Christ' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-14', esvRef: 'Romans 6:1-14', pericope: 'Dead to Sin, Alive to God' },
        { ref: '6:15-23', esvRef: 'Romans 6:15-23', pericope: 'Slaves to Righteousness' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-6', esvRef: 'Romans 7:1-6', pericope: 'Released from the Law' },
        { ref: '7:7-25', esvRef: 'Romans 7:7-25', pericope: 'The Law and Sin' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-11', esvRef: 'Romans 8:1-11', pericope: 'Life in the Spirit' },
        { ref: '8:12-17', esvRef: 'Romans 8:12-17', pericope: 'Heirs with Christ' },
        { ref: '8:18-30', esvRef: 'Romans 8:18-30', pericope: 'Future Glory' },
        { ref: '8:31-39', esvRef: 'Romans 8:31-39', pericope: 'More Than Conquerors' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-13', esvRef: 'Romans 9:1-13', pericope: "God's Sovereign Choice" },
        { ref: '9:14-29', esvRef: 'Romans 9:14-29', pericope: "God's Righteous Judgment" },
        { ref: '9:30-33', esvRef: 'Romans 9:30-33', pericope: "Israel's Unbelief" },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-13', esvRef: 'Romans 10:1-13', pericope: 'Salvation for All Who Call on the Lord' },
        { ref: '10:14-21', esvRef: 'Romans 10:14-21', pericope: 'How Will They Hear?' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-10', esvRef: 'Romans 11:1-10', pericope: 'A Remnant of Israel' },
        { ref: '11:11-24', esvRef: 'Romans 11:11-24', pericope: 'Gentiles Grafted In' },
        { ref: '11:25-36', esvRef: 'Romans 11:25-36', pericope: 'All Israel Will Be Saved' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-2', esvRef: 'Romans 12:1-2', pericope: 'A Living Sacrifice' },
        { ref: '12:3-8', esvRef: 'Romans 12:3-8', pericope: 'Gifts of Grace' },
        { ref: '12:9-21', esvRef: 'Romans 12:9-21', pericope: 'Marks of the True Christian' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-7', esvRef: 'Romans 13:1-7', pericope: 'Submission to Authorities' },
        { ref: '13:8-14', esvRef: 'Romans 13:8-14', pericope: 'Love Your Neighbor; Wake from Sleep' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-12', esvRef: 'Romans 14:1-12', pericope: 'Do Not Pass Judgment on One Another' },
        { ref: '14:13-23', esvRef: 'Romans 14:13-23', pericope: 'Do Not Cause a Brother to Stumble' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-13', esvRef: 'Romans 15:1-13', pericope: 'The Example of Christ' },
        { ref: '15:14-21', esvRef: 'Romans 15:14-21', pericope: "Paul's Reason for Writing" },
        { ref: '15:22-33', esvRef: 'Romans 15:22-33', pericope: "Paul's Travel Plans" },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-16', esvRef: 'Romans 16:1-16', pericope: 'Personal Greetings' },
        { ref: '16:17-27', esvRef: 'Romans 16:17-27', pericope: 'Final Instructions and Doxology' },
      ]},
    ]
  },
  {
    id: '1-corinthians',
    name: '1 Corinthians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-9', esvRef: '1 Corinthians 1:1-9', pericope: 'Greeting and Thanksgiving' },
        { ref: '1:10-17', esvRef: '1 Corinthians 1:10-17', pericope: 'Divisions in the Church' },
        { ref: '1:18-31', esvRef: '1 Corinthians 1:18-31', pericope: 'Christ the Wisdom and Power of God' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-16', esvRef: '1 Corinthians 2:1-16', pericope: 'Wisdom from the Spirit' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-9', esvRef: '1 Corinthians 3:1-9', pericope: "Divisions and God's Fellow Workers" },
        { ref: '3:10-23', esvRef: '1 Corinthians 3:10-23', pericope: 'Warning Against Self-Deception' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-13', esvRef: '1 Corinthians 4:1-13', pericope: 'Servants of Christ' },
        { ref: '4:14-21', esvRef: '1 Corinthians 4:14-21', pericope: "Paul's Fatherly Admonition" },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-13', esvRef: '1 Corinthians 5:1-13', pericope: 'Judgment on Sexual Immorality' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-11', esvRef: '1 Corinthians 6:1-11', pericope: 'Lawsuits Among Believers' },
        { ref: '6:12-20', esvRef: '1 Corinthians 6:12-20', pericope: 'Flee Sexual Immorality' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-24', esvRef: '1 Corinthians 7:1-24', pericope: 'Principles for Marriage' },
        { ref: '7:25-40', esvRef: '1 Corinthians 7:25-40', pericope: 'The Unmarried and the Widowed' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-13', esvRef: '1 Corinthians 8:1-13', pericope: 'Food Offered to Idols' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-18', esvRef: '1 Corinthians 9:1-18', pericope: "Paul's Apostolic Rights" },
        { ref: '9:19-27', esvRef: '1 Corinthians 9:19-27', pericope: 'Running the Race' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-22', esvRef: '1 Corinthians 10:1-22', pericope: 'Warning Against Idolatry' },
        { ref: '10:23-33', esvRef: '1 Corinthians 10:23-33', pericope: 'Do All to the Glory of God' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-16', esvRef: '1 Corinthians 11:1-16', pericope: 'Head Coverings' },
        { ref: '11:17-34', esvRef: '1 Corinthians 11:17-34', pericope: "The Lord's Supper" },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-31', esvRef: '1 Corinthians 12:1-31', pericope: 'Spiritual Gifts and the Body of Christ' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-13', esvRef: '1 Corinthians 13:1-13', pericope: 'The Way of Love' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-25', esvRef: '1 Corinthians 14:1-25', pericope: 'Tongues and Prophecy' },
        { ref: '14:26-40', esvRef: '1 Corinthians 14:26-40', pericope: 'Orderly Worship' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-11', esvRef: '1 Corinthians 15:1-11', pericope: 'The Resurrection of Christ' },
        { ref: '15:12-34', esvRef: '1 Corinthians 15:12-34', pericope: 'The Resurrection of the Dead' },
        { ref: '15:35-58', esvRef: '1 Corinthians 15:35-58', pericope: 'The Resurrection Body' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-24', esvRef: '1 Corinthians 16:1-24', pericope: 'Final Instructions and Greetings' },
      ]},
    ]
  },
  {
    id: '2-corinthians',
    name: '2 Corinthians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: '2 Corinthians 1:1-11', pericope: 'Greeting; God of All Comfort' },
        { ref: '1:12-24', esvRef: '2 Corinthians 1:12-24', pericope: "Paul's Changed Plans" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: '2 Corinthians 2:1-11', pericope: 'Forgive the Offender' },
        { ref: '2:12-17', esvRef: '2 Corinthians 2:12-17', pericope: 'Triumph in Christ' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-18', esvRef: '2 Corinthians 3:1-18', pericope: 'Ministers of a New Covenant' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-15', esvRef: '2 Corinthians 4:1-15', pericope: 'Jars of Clay' },
        { ref: '4:16-18', esvRef: '2 Corinthians 4:16-18', pericope: 'Momentary Affliction, Eternal Glory' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-10', esvRef: '2 Corinthians 5:1-10', pericope: 'A Heavenly Dwelling' },
        { ref: '5:11-21', esvRef: '2 Corinthians 5:11-21', pericope: 'The Ministry of Reconciliation' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-13', esvRef: '2 Corinthians 6:1-13', pericope: "Paul's Ministry" },
        { ref: '6:14-18', esvRef: '2 Corinthians 6:14-18', pericope: 'Do Not Be Unequally Yoked' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-16', esvRef: '2 Corinthians 7:1-16', pericope: 'Godly Grief' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-24', esvRef: '2 Corinthians 8:1-24', pericope: 'Instructions on Giving' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-15', esvRef: '2 Corinthians 9:1-15', pericope: 'The Cheerful Giver' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-18', esvRef: '2 Corinthians 10:1-18', pericope: "Paul's Defense of His Ministry" },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-15', esvRef: '2 Corinthians 11:1-15', pericope: 'Paul and the False Apostles' },
        { ref: '11:16-33', esvRef: '2 Corinthians 11:16-33', pericope: "Paul's Sufferings as an Apostle" },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-10', esvRef: '2 Corinthians 12:1-10', pericope: "Paul's Visions and His Thorn" },
        { ref: '12:11-21', esvRef: '2 Corinthians 12:11-21', pericope: 'Concern for the Corinthians' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-14', esvRef: '2 Corinthians 13:1-14', pericope: 'Final Warnings and Farewell' },
      ]},
    ]
  },
  {
    id: 'galatians',
    name: 'Galatians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-5', esvRef: 'Galatians 1:1-5', pericope: 'Greeting' },
        { ref: '1:6-10', esvRef: 'Galatians 1:6-10', pericope: 'No Other Gospel' },
        { ref: '1:11-24', esvRef: 'Galatians 1:11-24', pericope: 'Paul Called by God' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-10', esvRef: 'Galatians 2:1-10', pericope: 'Paul Accepted by the Apostles' },
        { ref: '2:11-21', esvRef: 'Galatians 2:11-21', pericope: 'Paul Confronts Peter' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-14', esvRef: 'Galatians 3:1-14', pericope: 'Justified by Faith' },
        { ref: '3:15-29', esvRef: 'Galatians 3:15-29', pericope: 'The Law and the Promise' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-11', esvRef: 'Galatians 4:1-11', pericope: 'Sons and Heirs' },
        { ref: '4:12-20', esvRef: 'Galatians 4:12-20', pericope: "Paul's Concern for the Galatians" },
        { ref: '4:21-31', esvRef: 'Galatians 4:21-31', pericope: 'Two Covenants: Hagar and Sarah' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-12', esvRef: 'Galatians 5:1-12', pericope: 'Christ Has Set Us Free' },
        { ref: '5:13-26', esvRef: 'Galatians 5:13-26', pericope: 'Keep in Step with the Spirit' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-10', esvRef: 'Galatians 6:1-10', pericope: "Bear One Another's Burdens" },
        { ref: '6:11-18', esvRef: 'Galatians 6:11-18', pericope: 'Final Warning and Blessing' },
      ]},
    ]
  },
  {
    id: 'ephesians',
    name: 'Ephesians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-2', esvRef: 'Ephesians 1:1-2', pericope: 'Greeting' },
        { ref: '1:3-14', esvRef: 'Ephesians 1:3-14', pericope: 'Spiritual Blessings in Christ' },
        { ref: '1:15-23', esvRef: 'Ephesians 1:15-23', pericope: 'Thanksgiving and Prayer' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-10', esvRef: 'Ephesians 2:1-10', pericope: 'Made Alive in Christ' },
        { ref: '2:11-22', esvRef: 'Ephesians 2:11-22', pericope: 'One in Christ' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-13', esvRef: 'Ephesians 3:1-13', pericope: 'The Mystery of the Gospel' },
        { ref: '3:14-21', esvRef: 'Ephesians 3:14-21', pericope: 'Prayer for Strength' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-16', esvRef: 'Ephesians 4:1-16', pericope: 'Unity in the Body of Christ' },
        { ref: '4:17-32', esvRef: 'Ephesians 4:17-32', pericope: 'The New Self' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-21', esvRef: 'Ephesians 5:1-21', pericope: 'Walk in Love and Light' },
        { ref: '5:22-33', esvRef: 'Ephesians 5:22-33', pericope: 'Wives and Husbands' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-9', esvRef: 'Ephesians 6:1-9', pericope: 'Children, Fathers, and Bondservants' },
        { ref: '6:10-20', esvRef: 'Ephesians 6:10-20', pericope: 'The Armor of God' },
        { ref: '6:21-24', esvRef: 'Ephesians 6:21-24', pericope: 'Final Greetings' },
      ]},
    ]
  },
  {
    id: 'philippians',
    name: 'Philippians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: 'Philippians 1:1-11', pericope: 'Greeting and Thanksgiving' },
        { ref: '1:12-26', esvRef: 'Philippians 1:12-26', pericope: 'The Advance of the Gospel' },
        { ref: '1:27-30', esvRef: 'Philippians 1:27-30', pericope: 'Citizens Worthy of the Gospel' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-11', esvRef: 'Philippians 2:1-11', pericope: "Christ's Example of Humility" },
        { ref: '2:12-18', esvRef: 'Philippians 2:12-18', pericope: 'Shine as Lights in the World' },
        { ref: '2:19-30', esvRef: 'Philippians 2:19-30', pericope: 'Timothy and Epaphroditus' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-11', esvRef: 'Philippians 3:1-11', pericope: 'Righteousness Through Faith in Christ' },
        { ref: '3:12-21', esvRef: 'Philippians 3:12-21', pericope: 'Pressing Toward the Goal' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-9', esvRef: 'Philippians 4:1-9', pericope: 'Rejoice in the Lord Always' },
        { ref: '4:10-23', esvRef: 'Philippians 4:10-23', pericope: "God's Provision and Farewell" },
      ]},
    ]
  },
  {
    id: 'colossians',
    name: 'Colossians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-14', esvRef: 'Colossians 1:1-14', pericope: 'Greeting, Thanksgiving, and Prayer' },
        { ref: '1:15-23', esvRef: 'Colossians 1:15-23', pericope: 'The Supremacy of Christ' },
        { ref: '1:24-29', esvRef: 'Colossians 1:24-29', pericope: "Paul's Labor for the Church" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-15', esvRef: 'Colossians 2:1-15', pericope: 'Fullness in Christ' },
        { ref: '2:16-23', esvRef: 'Colossians 2:16-23', pericope: 'Freedom from Human Rules' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-17', esvRef: 'Colossians 3:1-17', pericope: 'Put On the New Self' },
        { ref: '3:18-25', esvRef: 'Colossians 3:18-25', pericope: 'Rules for Christian Households' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-6', esvRef: 'Colossians 4:1-6', pericope: 'Further Instructions' },
        { ref: '4:7-18', esvRef: 'Colossians 4:7-18', pericope: 'Final Greetings' },
      ]},
    ]
  },
  {
    id: '1-thessalonians',
    name: '1 Thessalonians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-10', esvRef: '1 Thessalonians 1:1-10', pericope: 'Greeting and Thanksgiving' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-16', esvRef: '1 Thessalonians 2:1-16', pericope: "Paul's Ministry in Thessalonica" },
        { ref: '2:17-20', esvRef: '1 Thessalonians 2:17-20', pericope: "Paul's Longing to See the Thessalonians" },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-13', esvRef: '1 Thessalonians 3:1-13', pericope: "Timothy's Mission; Paul's Prayer" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-12', esvRef: '1 Thessalonians 4:1-12', pericope: 'A Life Pleasing to God' },
        { ref: '4:13-18', esvRef: '1 Thessalonians 4:13-18', pericope: 'The Coming of the Lord' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-11', esvRef: '1 Thessalonians 5:1-11', pericope: 'The Day of the Lord' },
        { ref: '5:12-28', esvRef: '1 Thessalonians 5:12-28', pericope: 'Final Instructions' },
      ]},
    ]
  },
  {
    id: '2-thessalonians',
    name: '2 Thessalonians',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-12', esvRef: '2 Thessalonians 1:1-12', pericope: 'Greeting; Thanksgiving and Prayer' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12', esvRef: '2 Thessalonians 2:1-12', pericope: 'The Man of Lawlessness' },
        { ref: '2:13-17', esvRef: '2 Thessalonians 2:13-17', pericope: 'Stand Firm' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15', esvRef: '2 Thessalonians 3:1-15', pericope: 'Warning Against Idleness' },
        { ref: '3:16-18', esvRef: '2 Thessalonians 3:16-18', pericope: 'Benediction' },
      ]},
    ]
  },
  {
    id: '1-timothy',
    name: '1 Timothy',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: '1 Timothy 1:1-11', pericope: 'Greeting; Warning Against False Teachers' },
        { ref: '1:12-20', esvRef: '1 Timothy 1:12-20', pericope: "Gratitude for God's Grace" },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-15', esvRef: '1 Timothy 2:1-15', pericope: 'Instructions on Worship' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-13', esvRef: '1 Timothy 3:1-13', pericope: 'Qualifications for Overseers and Deacons' },
        { ref: '3:14-16', esvRef: '1 Timothy 3:14-16', pericope: 'The Mystery of Godliness' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-10', esvRef: '1 Timothy 4:1-10', pericope: 'Some Will Depart from the Faith' },
        { ref: '4:11-16', esvRef: '1 Timothy 4:11-16', pericope: 'A Good Servant of Christ Jesus' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-16', esvRef: '1 Timothy 5:1-16', pericope: 'Instructions on Widows' },
        { ref: '5:17-25', esvRef: '1 Timothy 5:17-25', pericope: 'Honoring Elders; Avoiding Sin' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-10', esvRef: '1 Timothy 6:1-10', pericope: 'Godliness with Contentment' },
        { ref: '6:11-21', esvRef: '1 Timothy 6:11-21', pericope: 'Fight the Good Fight' },
      ]},
    ]
  },
  {
    id: '2-timothy',
    name: '2 Timothy',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-18', esvRef: '2 Timothy 1:1-18', pericope: 'Guard the Good Deposit' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-13', esvRef: '2 Timothy 2:1-13', pericope: 'A Good Soldier of Christ' },
        { ref: '2:14-26', esvRef: '2 Timothy 2:14-26', pericope: 'A Worker Approved by God' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-9', esvRef: '2 Timothy 3:1-9', pericope: 'Godlessness in the Last Days' },
        { ref: '3:10-17', esvRef: '2 Timothy 3:10-17', pericope: 'All Scripture Is God-Breathed' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-8', esvRef: '2 Timothy 4:1-8', pericope: "Preach the Word; Paul's Farewell" },
        { ref: '4:9-22', esvRef: '2 Timothy 4:9-22', pericope: 'Final Greetings' },
      ]},
    ]
  },
  {
    id: 'titus',
    name: 'Titus',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-4', esvRef: 'Titus 1:1-4', pericope: 'Greeting' },
        { ref: '1:5-16', esvRef: 'Titus 1:5-16', pericope: 'Qualifications for Elders; Rebuking False Teachers' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-15', esvRef: 'Titus 2:1-15', pericope: 'Teach Sound Doctrine' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-11', esvRef: 'Titus 3:1-11', pericope: 'Be Ready for Every Good Work' },
        { ref: '3:12-15', esvRef: 'Titus 3:12-15', pericope: 'Final Instructions and Greetings' },
      ]},
    ]
  },
  {
    id: 'philemon',
    name: 'Philemon',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-7', esvRef: 'Philemon 1:1-7', pericope: 'Greeting and Thanksgiving' },
        { ref: '1:8-22', esvRef: 'Philemon 1:8-22', pericope: "Paul's Appeal for Onesimus" },
        { ref: '1:23-25', esvRef: 'Philemon 1:23-25', pericope: 'Final Greetings' },
      ]},
    ]
  },
  {
    id: 'hebrews',
    name: 'Hebrews',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-4', esvRef: 'Hebrews 1:1-4', pericope: 'God Has Spoken by His Son' },
        { ref: '1:5-14', esvRef: 'Hebrews 1:5-14', pericope: 'The Son Superior to Angels' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-4', esvRef: 'Hebrews 2:1-4', pericope: 'Warning Against Neglecting Salvation' },
        { ref: '2:5-18', esvRef: 'Hebrews 2:5-18', pericope: 'Jesus Made Like His Brothers' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-6', esvRef: 'Hebrews 3:1-6', pericope: 'Jesus Greater Than Moses' },
        { ref: '3:7-19', esvRef: 'Hebrews 3:7-19', pericope: 'Warning Against Unbelief' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-13', esvRef: 'Hebrews 4:1-13', pericope: 'The Promise of Rest' },
        { ref: '4:14-16', esvRef: 'Hebrews 4:14-16', pericope: 'Jesus the Great High Priest' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-10', esvRef: 'Hebrews 5:1-10', pericope: 'The High Priestly Order of Melchizedek' },
        { ref: '5:11-14', esvRef: 'Hebrews 5:11-14', pericope: 'Warning Against Apostasy' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-12', esvRef: 'Hebrews 6:1-12', pericope: 'The Peril of Falling Away' },
        { ref: '6:13-20', esvRef: 'Hebrews 6:13-20', pericope: "The Certainty of God's Promise" },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-10', esvRef: 'Hebrews 7:1-10', pericope: 'The Priestly Order of Melchizedek' },
        { ref: '7:11-28', esvRef: 'Hebrews 7:11-28', pericope: 'Jesus, High Priest Forever' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-13', esvRef: 'Hebrews 8:1-13', pericope: 'Jesus, Mediator of a Better Covenant' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-10', esvRef: 'Hebrews 9:1-10', pericope: 'The Earthly Holy Place' },
        { ref: '9:11-28', esvRef: 'Hebrews 9:11-28', pericope: 'Redemption Through the Blood of Christ' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-18', esvRef: 'Hebrews 10:1-18', pericope: "Christ's Sacrifice Once for All" },
        { ref: '10:19-39', esvRef: 'Hebrews 10:19-39', pericope: 'The Full Assurance of Faith' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-7', esvRef: 'Hebrews 11:1-7', pericope: 'By Faith' },
        { ref: '11:8-22', esvRef: 'Hebrews 11:8-22', pericope: 'Faith of the Patriarchs' },
        { ref: '11:23-40', esvRef: 'Hebrews 11:23-40', pericope: 'Faith of Moses and Others' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-17', esvRef: 'Hebrews 12:1-17', pericope: 'Run the Race with Endurance' },
        { ref: '12:18-29', esvRef: 'Hebrews 12:18-29', pericope: 'A Kingdom That Cannot Be Shaken' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-19', esvRef: 'Hebrews 13:1-19', pericope: 'Sacrifices Pleasing to God' },
        { ref: '13:20-25', esvRef: 'Hebrews 13:20-25', pericope: 'Benediction and Farewell' },
      ]},
    ]
  },
  {
    id: 'james',
    name: 'James',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-18', esvRef: 'James 1:1-18', pericope: 'Testing of Your Faith; The Crown of Life' },
        { ref: '1:19-27', esvRef: 'James 1:19-27', pericope: 'Doers of the Word' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-13', esvRef: 'James 2:1-13', pericope: 'The Sin of Partiality' },
        { ref: '2:14-26', esvRef: 'James 2:14-26', pericope: 'Faith Without Works Is Dead' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-12', esvRef: 'James 3:1-12', pericope: 'Taming the Tongue' },
        { ref: '3:13-18', esvRef: 'James 3:13-18', pericope: 'Wisdom from Above' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-12', esvRef: 'James 4:1-12', pericope: 'Warning Against Worldliness' },
        { ref: '4:13-17', esvRef: 'James 4:13-17', pericope: 'Boasting About Tomorrow' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-6', esvRef: 'James 5:1-6', pericope: 'Warning to the Rich' },
        { ref: '5:7-18', esvRef: 'James 5:7-18', pericope: 'Patience and Prayer' },
        { ref: '5:19-20', esvRef: 'James 5:19-20', pericope: 'Bring Back a Wandering Brother' },
      ]},
    ]
  },
  {
    id: '1-peter',
    name: '1 Peter',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-12', esvRef: '1 Peter 1:1-12', pericope: 'Greeting; Living Hope Through the Resurrection' },
        { ref: '1:13-25', esvRef: '1 Peter 1:13-25', pericope: 'Called to Be Holy' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12', esvRef: '1 Peter 2:1-12', pericope: 'A Living Stone and a Holy People' },
        { ref: '2:13-25', esvRef: '1 Peter 2:13-25', pericope: 'Submission to Authority; The Example of Christ' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-7', esvRef: '1 Peter 3:1-7', pericope: 'Wives and Husbands' },
        { ref: '3:8-22', esvRef: '1 Peter 3:8-22', pericope: "Suffering for Righteousness' Sake" },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-11', esvRef: '1 Peter 4:1-11', pericope: 'Living for God' },
        { ref: '4:12-19', esvRef: '1 Peter 4:12-19', pericope: 'Suffering as a Christian' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-11', esvRef: '1 Peter 5:1-11', pericope: 'Shepherd the Flock; Humble Yourselves' },
        { ref: '5:12-14', esvRef: '1 Peter 5:12-14', pericope: 'Final Greetings' },
      ]},
    ]
  },
  {
    id: '2-peter',
    name: '2 Peter',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-11', esvRef: '2 Peter 1:1-11', pericope: 'Greeting; Confirming Your Calling and Election' },
        { ref: '1:12-21', esvRef: '2 Peter 1:12-21', pericope: 'Prophecy of Scripture' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-22', esvRef: '2 Peter 2:1-22', pericope: 'False Prophets and Teachers' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-13', esvRef: '2 Peter 3:1-13', pericope: 'The Day of the Lord' },
        { ref: '3:14-18', esvRef: '2 Peter 3:14-18', pericope: 'Final Words' },
      ]},
    ]
  },
  {
    id: '1-john',
    name: '1 John',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-4', esvRef: '1 John 1:1-4', pericope: 'The Word of Life' },
        { ref: '1:5-10', esvRef: '1 John 1:5-10', pericope: 'Walking in the Light' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-14', esvRef: '1 John 2:1-14', pericope: 'Christ Our Advocate; The New Commandment' },
        { ref: '2:15-27', esvRef: '1 John 2:15-27', pericope: 'Do Not Love the World; Abide in Christ' },
        { ref: '2:28-29', esvRef: '1 John 2:28-29', pericope: 'Children of God' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-10', esvRef: '1 John 3:1-10', pericope: 'Children of God vs. Children of the Devil' },
        { ref: '3:11-24', esvRef: '1 John 3:11-24', pericope: 'Love One Another' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-6', esvRef: '1 John 4:1-6', pericope: 'Test the Spirits' },
        { ref: '4:7-21', esvRef: '1 John 4:7-21', pericope: 'God Is Love' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-12', esvRef: '1 John 5:1-12', pericope: 'Overcoming the World; Testimony Concerning the Son' },
        { ref: '5:13-21', esvRef: '1 John 5:13-21', pericope: 'Assurance of Eternal Life' },
      ]},
    ]
  },
  {
    id: '2-john',
    name: '2 John',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-6', esvRef: '2 John 1:1-6', pericope: 'Greeting; Walk in Truth and Love' },
        { ref: '1:7-13', esvRef: '2 John 1:7-13', pericope: 'Watch Yourselves; Farewell' },
      ]},
    ]
  },
  {
    id: '3-john',
    name: '3 John',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-8', esvRef: '3 John 1:1-8', pericope: 'Greeting; Support for Workers in Truth' },
        { ref: '1:9-15', esvRef: '3 John 1:9-15', pericope: 'Diotrephes and Demetrius; Farewell' },
      ]},
    ]
  },
  {
    id: 'jude',
    name: 'Jude',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-4', esvRef: 'Jude 1:1-4', pericope: 'Greeting; Contend for the Faith' },
        { ref: '1:5-16', esvRef: 'Jude 1:5-16', pericope: 'Judgment on False Teachers' },
        { ref: '1:17-25', esvRef: 'Jude 1:17-25', pericope: 'A Call to Persevere; Doxology' },
      ]},
    ]
  },
  {
    id: 'revelation',
    name: 'Revelation',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-8', esvRef: 'Revelation 1:1-8', pericope: 'Prologue' },
        { ref: '1:9-20', esvRef: 'Revelation 1:9-20', pericope: 'Vision of the Son of Man' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-7', esvRef: 'Revelation 2:1-7', pericope: 'To the Church in Ephesus' },
        { ref: '2:8-11', esvRef: 'Revelation 2:8-11', pericope: 'To the Church in Smyrna' },
        { ref: '2:12-17', esvRef: 'Revelation 2:12-17', pericope: 'To the Church in Pergamum' },
        { ref: '2:18-29', esvRef: 'Revelation 2:18-29', pericope: 'To the Church in Thyatira' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-6', esvRef: 'Revelation 3:1-6', pericope: 'To the Church in Sardis' },
        { ref: '3:7-13', esvRef: 'Revelation 3:7-13', pericope: 'To the Church in Philadelphia' },
        { ref: '3:14-22', esvRef: 'Revelation 3:14-22', pericope: 'To the Church in Laodicea' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-11', esvRef: 'Revelation 4:1-11', pericope: 'The Throne in Heaven' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-14', esvRef: 'Revelation 5:1-14', pericope: 'The Scroll and the Lamb' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-17', esvRef: 'Revelation 6:1-17', pericope: 'The Seven Seals' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-8', esvRef: 'Revelation 7:1-8', pericope: 'The Sealing of the 144,000' },
        { ref: '7:9-17', esvRef: 'Revelation 7:9-17', pericope: 'A Great Multitude Before the Throne' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-13', esvRef: 'Revelation 8:1-13', pericope: 'The Seventh Seal and the First Four Trumpets' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-12', esvRef: 'Revelation 9:1-12', pericope: 'The Fifth Trumpet' },
        { ref: '9:13-21', esvRef: 'Revelation 9:13-21', pericope: 'The Sixth Trumpet' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-11', esvRef: 'Revelation 10:1-11', pericope: 'The Angel and the Little Scroll' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-14', esvRef: 'Revelation 11:1-14', pericope: 'The Two Witnesses' },
        { ref: '11:15-19', esvRef: 'Revelation 11:15-19', pericope: 'The Seventh Trumpet' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-17', esvRef: 'Revelation 12:1-17', pericope: 'The Woman and the Dragon' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-10', esvRef: 'Revelation 13:1-10', pericope: 'The Beast from the Sea' },
        { ref: '13:11-18', esvRef: 'Revelation 13:11-18', pericope: 'The Beast from the Earth' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-5', esvRef: 'Revelation 14:1-5', pericope: 'The Lamb and the 144,000' },
        { ref: '14:6-13', esvRef: 'Revelation 14:6-13', pericope: 'The Three Angels' },
        { ref: '14:14-20', esvRef: 'Revelation 14:14-20', pericope: 'The Harvest of the Earth' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-8', esvRef: 'Revelation 15:1-8', pericope: 'The Seven Angels with Seven Plagues' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-21', esvRef: 'Revelation 16:1-21', pericope: "The Seven Bowls of God's Wrath" },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-18', esvRef: 'Revelation 17:1-18', pericope: 'The Great Prostitute' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-24', esvRef: 'Revelation 18:1-24', pericope: 'The Fall of Babylon' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-10', esvRef: 'Revelation 19:1-10', pericope: 'Rejoicing in Heaven' },
        { ref: '19:11-21', esvRef: 'Revelation 19:11-21', pericope: 'The Rider on the White Horse' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-10', esvRef: 'Revelation 20:1-10', pericope: 'The Thousand Years; The Final Battle' },
        { ref: '20:11-15', esvRef: 'Revelation 20:11-15', pericope: 'The Great White Throne Judgment' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-8', esvRef: 'Revelation 21:1-8', pericope: 'The New Heaven and the New Earth' },
        { ref: '21:9-27', esvRef: 'Revelation 21:9-27', pericope: 'The New Jerusalem' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-5', esvRef: 'Revelation 22:1-5', pericope: 'The River of Life' },
        { ref: '22:6-21', esvRef: 'Revelation 22:6-21', pericope: 'Epilogue' },
      ]},
    ]
  },
]

export function getBook(id: string): Book | undefined {
  return BOOKS.find(b => b.id === id)
}

export function getChapter(bookId: string, ch: number): Chapter | undefined {
  return getBook(bookId)?.chapters.find(c => c.ch === ch)
}
