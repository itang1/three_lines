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

// Passage text is fetched at runtime via /api/passage and is not stored here.
// esvRef is the string sent to both the ESV API and API.Bible (e.g. "John 1:1-18")
// pericope is the standard section name shown in the sidebar and passage header

export const BOOKS: Book[] = [
  {
    id: 'john',
    name: 'John',
    testament: 'NT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-18',  esvRef: 'John 1:1-18',  pericope: 'The Prologue' },
        { ref: '1:19-28', esvRef: 'John 1:19-28', pericope: 'The Testimony of John the Baptist' },
        { ref: '1:29-34', esvRef: 'John 1:29-34', pericope: 'The Lamb of God' },
        { ref: '1:35-42', esvRef: 'John 1:35-42', pericope: 'The First Disciples' },
        { ref: '1:43-51', esvRef: 'John 1:43-51', pericope: 'Jesus Calls Philip and Nathanael' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12',  esvRef: 'John 2:1-12',  pericope: 'The Wedding at Cana' },
        { ref: '2:13-22', esvRef: 'John 2:13-22', pericope: 'Jesus Cleanses the Temple' },
        { ref: '2:23-25', esvRef: 'John 2:23-25', pericope: 'Jesus Knows What Is in Man' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-15',  esvRef: 'John 3:1-15',  pericope: 'You Must Be Born Again' },
        { ref: '3:16-21', esvRef: 'John 3:16-21', pericope: 'For God So Loved the World' },
        { ref: '3:22-30', esvRef: 'John 3:22-30', pericope: 'John the Baptist Exalts Christ' },
        { ref: '3:31-36', esvRef: 'John 3:31-36', pericope: 'He Who Comes from Above' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-9',   esvRef: 'John 4:1-9',   pericope: 'Jesus and the Woman of Samaria' },
        { ref: '4:10-26', esvRef: 'John 4:10-26', pericope: 'Living Water' },
        { ref: '4:27-42', esvRef: 'John 4:27-42', pericope: 'The Harvest Is Plentiful' },
        { ref: '4:43-54', esvRef: 'John 4:43-54', pericope: 'Jesus Heals an Official\'s Son' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-15',  esvRef: 'John 5:1-15',  pericope: 'The Healing at the Pool' },
        { ref: '5:16-30', esvRef: 'John 5:16-30', pericope: 'The Authority of the Son' },
        { ref: '5:31-47', esvRef: 'John 5:31-47', pericope: 'Witnesses to Jesus' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-15',  esvRef: 'John 6:1-15',  pericope: 'Jesus Feeds the Five Thousand' },
        { ref: '6:16-21', esvRef: 'John 6:16-21', pericope: 'Jesus Walks on Water' },
        { ref: '6:22-40', esvRef: 'John 6:22-40', pericope: 'I Am the Bread of Life' },
        { ref: '6:41-59', esvRef: 'John 6:41-59', pericope: 'The Bread from Heaven' },
        { ref: '6:60-71', esvRef: 'John 6:60-71', pericope: 'The Words of Eternal Life' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-13',  esvRef: 'John 7:1-13',  pericope: 'Jesus at the Feast of Booths' },
        { ref: '7:14-24', esvRef: 'John 7:14-24', pericope: 'Jesus Teaches in the Temple' },
        { ref: '7:25-36', esvRef: 'John 7:25-36', pericope: 'Can This Be the Christ?' },
        { ref: '7:37-44', esvRef: 'John 7:37-44', pericope: 'Rivers of Living Water' },
        { ref: '7:45-53', esvRef: 'John 7:45-53', pericope: 'Division Among the People' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-11',  esvRef: 'John 8:1-11',  pericope: 'The Woman Caught in Adultery' },
        { ref: '8:12-20', esvRef: 'John 8:12-20', pericope: 'I Am the Light of the World' },
        { ref: '8:21-30', esvRef: 'John 8:21-30', pericope: 'Where I Am Going You Cannot Come' },
        { ref: '8:31-47', esvRef: 'John 8:31-47', pericope: 'The Truth Will Set You Free' },
        { ref: '8:48-59', esvRef: 'John 8:48-59', pericope: 'Before Abraham Was, I Am' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-12',  esvRef: 'John 9:1-12',  pericope: 'Jesus Heals a Man Born Blind' },
        { ref: '9:13-23', esvRef: 'John 9:13-23', pericope: 'The Pharisees Investigate' },
        { ref: '9:24-34', esvRef: 'John 9:24-34', pericope: 'I Was Blind, Now I See' },
        { ref: '9:35-41', esvRef: 'John 9:35-41', pericope: 'Spiritual Blindness' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-10', esvRef: 'John 10:1-10', pericope: 'I Am the Door' },
        { ref: '10:11-21',esvRef: 'John 10:11-21',pericope: 'I Am the Good Shepherd' },
        { ref: '10:22-30',esvRef: 'John 10:22-30',pericope: 'I and the Father Are One' },
        { ref: '10:31-42',esvRef: 'John 10:31-42',pericope: 'The Father Is in Me' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-16', esvRef: 'John 11:1-16', pericope: 'The Death of Lazarus' },
        { ref: '11:17-27',esvRef: 'John 11:17-27',pericope: 'I Am the Resurrection and the Life' },
        { ref: '11:28-37',esvRef: 'John 11:28-37',pericope: 'Jesus Weeps' },
        { ref: '11:38-44',esvRef: 'John 11:38-44',pericope: 'Lazarus Raised from the Dead' },
        { ref: '11:45-57',esvRef: 'John 11:45-57',pericope: 'The Plot to Kill Jesus' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-8',  esvRef: 'John 12:1-8',  pericope: 'Mary Anoints Jesus' },
        { ref: '12:9-19', esvRef: 'John 12:9-19', pericope: 'The Triumphal Entry' },
        { ref: '12:20-36',esvRef: 'John 12:20-36',pericope: 'The Hour Has Come' },
        { ref: '12:37-50',esvRef: 'John 12:37-50',pericope: 'Unbelief Despite the Signs' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-17', esvRef: 'John 13:1-17', pericope: 'Jesus Washes the Disciples\' Feet' },
        { ref: '13:18-30',esvRef: 'John 13:18-30',pericope: 'One of You Will Betray Me' },
        { ref: '13:31-38',esvRef: 'John 13:31-38',pericope: 'The New Commandment' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-7',  esvRef: 'John 14:1-7',  pericope: 'I Am the Way, the Truth, and the Life' },
        { ref: '14:8-14', esvRef: 'John 14:8-14', pericope: 'Whoever Has Seen Me Has Seen the Father' },
        { ref: '14:15-24',esvRef: 'John 14:15-24',pericope: 'The Promise of the Holy Spirit' },
        { ref: '14:25-31',esvRef: 'John 14:25-31',pericope: 'My Peace I Give to You' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-11', esvRef: 'John 15:1-11', pericope: 'I Am the True Vine' },
        { ref: '15:12-17',esvRef: 'John 15:12-17',pericope: 'Love One Another' },
        { ref: '15:18-27',esvRef: 'John 15:18-27',pericope: 'The World Will Hate You' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-15', esvRef: 'John 16:1-15', pericope: 'The Work of the Holy Spirit' },
        { ref: '16:16-24',esvRef: 'John 16:16-24',pericope: 'Your Sorrow Will Turn to Joy' },
        { ref: '16:25-33',esvRef: 'John 16:25-33',pericope: 'I Have Overcome the World' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-5',  esvRef: 'John 17:1-5',  pericope: 'The Hour Has Come' },
        { ref: '17:6-19', esvRef: 'John 17:6-19', pericope: 'Jesus Prays for His Disciples' },
        { ref: '17:20-26',esvRef: 'John 17:20-26',pericope: 'Jesus Prays for All Believers' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-11', esvRef: 'John 18:1-11', pericope: 'The Betrayal and Arrest' },
        { ref: '18:12-27',esvRef: 'John 18:12-27',pericope: 'Peter Denies Jesus' },
        { ref: '18:28-40',esvRef: 'John 18:28-40',pericope: 'Jesus Before Pilate' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-16', esvRef: 'John 19:1-16', pericope: 'The Crucifixion Sentence' },
        { ref: '19:17-27',esvRef: 'John 19:17-27',pericope: 'The Crucifixion' },
        { ref: '19:28-37',esvRef: 'John 19:28-37',pericope: 'The Death of Jesus' },
        { ref: '19:38-42',esvRef: 'John 19:38-42',pericope: 'Jesus Is Buried' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-10', esvRef: 'John 20:1-10', pericope: 'The Empty Tomb' },
        { ref: '20:11-18',esvRef: 'John 20:11-18',pericope: 'Jesus Appears to Mary Magdalene' },
        { ref: '20:19-23',esvRef: 'John 20:19-23',pericope: 'Jesus Appears to the Disciples' },
        { ref: '20:24-29',esvRef: 'John 20:24-29',pericope: 'My Lord and My God' },
        { ref: '20:30-31',esvRef: 'John 20:30-31',pericope: 'The Purpose of This Book' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-14', esvRef: 'John 21:1-14', pericope: 'Jesus Appears at the Sea of Tiberias' },
        { ref: '21:15-19',esvRef: 'John 21:15-19',pericope: 'Do You Love Me?' },
        { ref: '21:20-25',esvRef: 'John 21:20-25',pericope: 'The Beloved Disciple' },
      ]},
    ]
  },
  {
    id: 'genesis',
    name: 'Genesis',
    testament: 'OT',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-2',   esvRef: 'Genesis 1:1-2',   pericope: 'In the Beginning' },
        { ref: '1:3-13',  esvRef: 'Genesis 1:3-13',  pericope: 'Days One Through Three' },
        { ref: '1:14-25', esvRef: 'Genesis 1:14-25', pericope: 'Days Four Through Six' },
        { ref: '1:26-31', esvRef: 'Genesis 1:26-31', pericope: 'Humanity in God\'s Image' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-3',   esvRef: 'Genesis 2:1-3',   pericope: 'The Seventh Day' },
        { ref: '2:4-17',  esvRef: 'Genesis 2:4-17',  pericope: 'The Garden of Eden' },
        { ref: '2:18-25', esvRef: 'Genesis 2:18-25', pericope: 'The First Woman' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-7',   esvRef: 'Genesis 3:1-7',   pericope: 'The Fall' },
        { ref: '3:8-13',  esvRef: 'Genesis 3:8-13',  pericope: 'Where Are You?' },
        { ref: '3:14-19', esvRef: 'Genesis 3:14-19', pericope: 'The Curse' },
        { ref: '3:20-24', esvRef: 'Genesis 3:20-24', pericope: 'Banished from the Garden' },
      ]},
      { ch: 4, chunks: [
        { ref: '4:1-16',  esvRef: 'Genesis 4:1-16',  pericope: 'Cain and Abel' },
        { ref: '4:17-26', esvRef: 'Genesis 4:17-26', pericope: 'The Line of Cain' },
      ]},
      { ch: 5, chunks: [
        { ref: '5:1-32',  esvRef: 'Genesis 5:1-32',  pericope: 'Generations from Adam to Noah' },
      ]},
      { ch: 6, chunks: [
        { ref: '6:1-8',   esvRef: 'Genesis 6:1-8',   pericope: 'Increasing Corruption' },
        { ref: '6:9-22',  esvRef: 'Genesis 6:9-22',  pericope: 'Noah Builds the Ark' },
      ]},
      { ch: 7, chunks: [
        { ref: '7:1-10',  esvRef: 'Genesis 7:1-10',  pericope: 'Entering the Ark' },
        { ref: '7:11-24', esvRef: 'Genesis 7:11-24', pericope: 'The Flood' },
      ]},
      { ch: 8, chunks: [
        { ref: '8:1-14',  esvRef: 'Genesis 8:1-14',  pericope: 'The Waters Recede' },
        { ref: '8:15-22', esvRef: 'Genesis 8:15-22', pericope: 'Leaving the Ark' },
      ]},
      { ch: 9, chunks: [
        { ref: '9:1-17',  esvRef: 'Genesis 9:1-17',  pericope: 'God\'s Covenant with Noah' },
        { ref: '9:18-29', esvRef: 'Genesis 9:18-29', pericope: 'Noah and His Sons' },
      ]},
      { ch: 10, chunks: [
        { ref: '10:1-32', esvRef: 'Genesis 10:1-32', pericope: 'The Table of Nations' },
      ]},
      { ch: 11, chunks: [
        { ref: '11:1-9',  esvRef: 'Genesis 11:1-9',  pericope: 'The Tower of Babel' },
        { ref: '11:10-32',esvRef: 'Genesis 11:10-32',pericope: 'From Shem to Abram' },
      ]},
      { ch: 12, chunks: [
        { ref: '12:1-9',  esvRef: 'Genesis 12:1-9',  pericope: 'The Call of Abram' },
        { ref: '12:10-20',esvRef: 'Genesis 12:10-20',pericope: 'Abram and Sarai in Egypt' },
      ]},
      { ch: 13, chunks: [
        { ref: '13:1-13', esvRef: 'Genesis 13:1-13', pericope: 'Abram and Lot Separate' },
        { ref: '13:14-18',esvRef: 'Genesis 13:14-18',pericope: 'God\'s Promise to Abram' },
      ]},
      { ch: 14, chunks: [
        { ref: '14:1-16', esvRef: 'Genesis 14:1-16', pericope: 'The Battle of the Kings' },
        { ref: '14:17-24',esvRef: 'Genesis 14:17-24',pericope: 'Melchizedek Blesses Abram' },
      ]},
      { ch: 15, chunks: [
        { ref: '15:1-11', esvRef: 'Genesis 15:1-11', pericope: 'God\'s Covenant with Abram' },
        { ref: '15:12-21',esvRef: 'Genesis 15:12-21',pericope: 'The Covenant Confirmed' },
      ]},
      { ch: 16, chunks: [
        { ref: '16:1-6',  esvRef: 'Genesis 16:1-6',  pericope: 'Sarai and Hagar' },
        { ref: '16:7-16', esvRef: 'Genesis 16:7-16', pericope: 'Hagar and the Angel' },
      ]},
      { ch: 17, chunks: [
        { ref: '17:1-8',  esvRef: 'Genesis 17:1-8',  pericope: 'Abram Renamed Abraham' },
        { ref: '17:9-14', esvRef: 'Genesis 17:9-14', pericope: 'The Sign of Circumcision' },
        { ref: '17:15-27',esvRef: 'Genesis 17:15-27',pericope: 'Sarai Renamed Sarah' },
      ]},
      { ch: 18, chunks: [
        { ref: '18:1-15', esvRef: 'Genesis 18:1-15', pericope: 'Three Visitors' },
        { ref: '18:16-33',esvRef: 'Genesis 18:16-33',pericope: 'Abraham Pleads for Sodom' },
      ]},
      { ch: 19, chunks: [
        { ref: '19:1-11', esvRef: 'Genesis 19:1-11', pericope: 'The Angels Come to Sodom' },
        { ref: '19:12-29',esvRef: 'Genesis 19:12-29',pericope: 'The Destruction of Sodom' },
        { ref: '19:30-38',esvRef: 'Genesis 19:30-38',pericope: 'Lot and His Daughters' },
      ]},
      { ch: 20, chunks: [
        { ref: '20:1-18', esvRef: 'Genesis 20:1-18', pericope: 'Abraham and Abimelech' },
      ]},
      { ch: 21, chunks: [
        { ref: '21:1-7',  esvRef: 'Genesis 21:1-7',  pericope: 'The Birth of Isaac' },
        { ref: '21:8-21', esvRef: 'Genesis 21:8-21', pericope: 'Hagar and Ishmael Sent Away' },
        { ref: '21:22-34',esvRef: 'Genesis 21:22-34',pericope: 'Abraham and Abimelech\'s Covenant' },
      ]},
      { ch: 22, chunks: [
        { ref: '22:1-14', esvRef: 'Genesis 22:1-14', pericope: 'The Testing of Abraham' },
        { ref: '22:15-24',esvRef: 'Genesis 22:15-24',pericope: 'God\'s Promise Renewed' },
      ]},
      { ch: 23, chunks: [
        { ref: '23:1-20', esvRef: 'Genesis 23:1-20', pericope: 'The Death and Burial of Sarah' },
      ]},
      { ch: 24, chunks: [
        { ref: '24:1-28', esvRef: 'Genesis 24:1-28', pericope: 'A Wife for Isaac' },
        { ref: '24:29-67',esvRef: 'Genesis 24:29-67',pericope: 'Rebekah Meets Isaac' },
      ]},
      { ch: 25, chunks: [
        { ref: '25:1-11', esvRef: 'Genesis 25:1-11', pericope: 'The Death of Abraham' },
        { ref: '25:12-18',esvRef: 'Genesis 25:12-18',pericope: 'Ishmael\'s Descendants' },
        { ref: '25:19-34',esvRef: 'Genesis 25:19-34',pericope: 'Jacob and Esau' },
      ]},
      { ch: 26, chunks: [
        { ref: '26:1-16', esvRef: 'Genesis 26:1-16', pericope: 'Isaac and Abimelech' },
        { ref: '26:17-33',esvRef: 'Genesis 26:17-33',pericope: 'Isaac\'s Wells' },
        { ref: '26:34-35',esvRef: 'Genesis 26:34-35',pericope: 'Esau\'s Wives' },
      ]},
      { ch: 27, chunks: [
        { ref: '27:1-29', esvRef: 'Genesis 27:1-29', pericope: 'Jacob Steals the Blessing' },
        { ref: '27:30-46',esvRef: 'Genesis 27:30-46',pericope: 'Esau\'s Grief' },
      ]},
      { ch: 28, chunks: [
        { ref: '28:1-9',  esvRef: 'Genesis 28:1-9',  pericope: 'Jacob Sent to Laban' },
        { ref: '28:10-22',esvRef: 'Genesis 28:10-22',pericope: 'Jacob\'s Dream at Bethel' },
      ]},
      { ch: 29, chunks: [
        { ref: '29:1-14', esvRef: 'Genesis 29:1-14', pericope: 'Jacob Meets Rachel' },
        { ref: '29:15-30',esvRef: 'Genesis 29:15-30',pericope: 'Jacob Marries Leah and Rachel' },
        { ref: '29:31-35',esvRef: 'Genesis 29:31-35',pericope: 'Leah\'s Sons' },
      ]},
      { ch: 30, chunks: [
        { ref: '30:1-24', esvRef: 'Genesis 30:1-24', pericope: 'Jacob\'s Children' },
        { ref: '30:25-43',esvRef: 'Genesis 30:25-43',pericope: 'Jacob\'s Flocks Increase' },
      ]},
      { ch: 31, chunks: [
        { ref: '31:1-21', esvRef: 'Genesis 31:1-21', pericope: 'Jacob Flees from Laban' },
        { ref: '31:22-55',esvRef: 'Genesis 31:22-55',pericope: 'Laban Pursues Jacob' },
      ]},
      { ch: 32, chunks: [
        { ref: '32:1-21', esvRef: 'Genesis 32:1-21', pericope: 'Jacob Prepares to Meet Esau' },
        { ref: '32:22-32',esvRef: 'Genesis 32:22-32',pericope: 'Jacob Wrestles with God' },
      ]},
      { ch: 33, chunks: [
        { ref: '33:1-17', esvRef: 'Genesis 33:1-17', pericope: 'Jacob and Esau Reconcile' },
        { ref: '33:18-20',esvRef: 'Genesis 33:18-20',pericope: 'Jacob Settles in Shechem' },
      ]},
      { ch: 34, chunks: [
        { ref: '34:1-24', esvRef: 'Genesis 34:1-24', pericope: 'The Defiling of Dinah' },
        { ref: '34:25-31',esvRef: 'Genesis 34:25-31',pericope: 'Simeon and Levi\'s Revenge' },
      ]},
      { ch: 35, chunks: [
        { ref: '35:1-15', esvRef: 'Genesis 35:1-15', pericope: 'God Blesses Jacob at Bethel' },
        { ref: '35:16-29',esvRef: 'Genesis 35:16-29',pericope: 'Deaths of Rachel and Isaac' },
      ]},
      { ch: 36, chunks: [
        { ref: '36:1-43', esvRef: 'Genesis 36:1-43', pericope: 'Esau\'s Descendants' },
      ]},
      { ch: 37, chunks: [
        { ref: '37:1-11', esvRef: 'Genesis 37:1-11', pericope: 'Joseph\'s Dreams' },
        { ref: '37:12-36',esvRef: 'Genesis 37:12-36',pericope: 'Joseph Sold into Egypt' },
      ]},
      { ch: 38, chunks: [
        { ref: '38:1-30', esvRef: 'Genesis 38:1-30', pericope: 'Judah and Tamar' },
      ]},
      { ch: 39, chunks: [
        { ref: '39:1-18', esvRef: 'Genesis 39:1-18', pericope: 'Joseph and Potiphar\'s Wife' },
        { ref: '39:19-23',esvRef: 'Genesis 39:19-23',pericope: 'Joseph in Prison' },
      ]},
      { ch: 40, chunks: [
        { ref: '40:1-23', esvRef: 'Genesis 40:1-23', pericope: 'Joseph Interprets Dreams' },
      ]},
      { ch: 41, chunks: [
        { ref: '41:1-36', esvRef: 'Genesis 41:1-36', pericope: 'Pharaoh\'s Dreams' },
        { ref: '41:37-57',esvRef: 'Genesis 41:37-57',pericope: 'Joseph Rises to Power' },
      ]},
      { ch: 42, chunks: [
        { ref: '42:1-25', esvRef: 'Genesis 42:1-25', pericope: 'Joseph\'s Brothers Go to Egypt' },
        { ref: '42:26-38',esvRef: 'Genesis 42:26-38',pericope: 'The Brothers Return to Jacob' },
      ]},
      { ch: 43, chunks: [
        { ref: '43:1-15', esvRef: 'Genesis 43:1-15', pericope: 'The Second Journey to Egypt' },
        { ref: '43:16-34',esvRef: 'Genesis 43:16-34',pericope: 'Joseph Receives His Brothers' },
      ]},
      { ch: 44, chunks: [
        { ref: '44:1-17', esvRef: 'Genesis 44:1-17', pericope: 'The Silver Cup' },
        { ref: '44:18-34',esvRef: 'Genesis 44:18-34',pericope: 'Judah Pleads for Benjamin' },
      ]},
      { ch: 45, chunks: [
        { ref: '45:1-15', esvRef: 'Genesis 45:1-15', pericope: 'Joseph Makes Himself Known' },
        { ref: '45:16-28',esvRef: 'Genesis 45:16-28',pericope: 'Jacob Learns Joseph Is Alive' },
      ]},
      { ch: 46, chunks: [
        { ref: '46:1-7',  esvRef: 'Genesis 46:1-7',  pericope: 'God Speaks to Jacob' },
        { ref: '46:8-27', esvRef: 'Genesis 46:8-27', pericope: 'Jacob\'s Family Goes to Egypt' },
        { ref: '46:28-34',esvRef: 'Genesis 46:28-34',pericope: 'Jacob and Joseph Reunited' },
      ]},
      { ch: 47, chunks: [
        { ref: '47:1-12', esvRef: 'Genesis 47:1-12', pericope: 'Jacob Before Pharaoh' },
        { ref: '47:13-26',esvRef: 'Genesis 47:13-26',pericope: 'Joseph and the Famine' },
        { ref: '47:27-31',esvRef: 'Genesis 47:27-31',pericope: 'Jacob\'s Final Years' },
      ]},
      { ch: 48, chunks: [
        { ref: '48:1-22', esvRef: 'Genesis 48:1-22', pericope: 'Jacob Blesses Ephraim and Manasseh' },
      ]},
      { ch: 49, chunks: [
        { ref: '49:1-28', esvRef: 'Genesis 49:1-28', pericope: 'Jacob Blesses His Sons' },
        { ref: '49:29-33',esvRef: 'Genesis 49:29-33',pericope: 'The Death of Jacob' },
      ]},
      { ch: 50, chunks: [
        { ref: '50:1-14', esvRef: 'Genesis 50:1-14', pericope: 'Jacob Is Buried in Canaan' },
        { ref: '50:15-21',esvRef: 'Genesis 50:15-21',pericope: 'Joseph Forgives His Brothers' },
        { ref: '50:22-26',esvRef: 'Genesis 50:22-26',pericope: 'The Death of Joseph' },
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
