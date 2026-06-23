export type Chunk = { ref: string; text: string }
export type Chapter = { ch: number; chunks: Chunk[] }
export type Book = { id: string; name: string; testament: 'OT' | 'NT'; version: string; chapters: Chapter[] }

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
    core: false,
    placeholder: 'What do we know about the time, place, author, or audience?',
    description: "The world behind the text. What were the historical circumstances, political climate, or authorial background that shaped this passage? What was the original audience likely to have understood or assumed? Why it was written, for whom, and under what conditions.",
  },
  {
    id: 'literary',
    label: 'Literary observation',
    dot: '#BA7517',
    core: false,
    placeholder: 'What kind of writing is this? Note tone, structure, imagery, genre.',
    description: "The world within the text. What type of writing is this: narrative, poetry, letter, parable, apocalypse? How does the author use structure, repetition, imagery, or tone to shape meaning? What literary patterns or themes emerge?",
  },
  {
    id: 'comparative',
    label: 'Connections to other texts',
    dot: '#993556',
    core: false,
    placeholder: 'How does this compare to other texts, versions, or traditions?',
    description: "The world around the text. How does this passage compare to parallel accounts in other Gospels, earlier Scripture, or contemporary texts from the same era? Are there signs of editing or reshaping from an earlier source? What cross-cultural motifs appear?",
  },
]

export const BOOKS: Book[] = [
  {
    id: 'john',
    name: 'John',
    testament: 'NT',
    version: 'NIV',
    chapters: [
      { ch: 1, chunks: [
        { ref: '1:1-5',   text: 'In the beginning was the Word, and the Word was with God, and the Word was God. He was with God in the beginning. Through him all things were made; without him nothing was made that has been made. In him was life, and that life was the light of all mankind. The light shines in the darkness, and the darkness has not overcome it.' },
        { ref: '1:6-13',  text: 'There was a man sent from God whose name was John. He came as a witness to testify concerning that light, so that through him all might believe. He himself was not the light; he came only as a witness to the light. The true light that gives light to everyone was coming into the world. He was in the world, and though the world was made through him, the world did not recognize him. He came to that which was his own, but his own did not receive him. Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God.' },
        { ref: '1:14-18', text: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth. Out of his fullness we have all received grace in place of grace already given. For the law was given through Moses; grace and truth came through Jesus Christ. No one has ever seen God, but the one and only Son, who is himself God and is in closest relationship with the Father, has made him known.' },
        { ref: '1:19-28', text: 'Now this was John\'s testimony when the Jewish leaders in Jerusalem sent priests and Levites to ask him who he was. He did not fail to confess, but confessed freely, "I am not the Messiah." They asked him, "Then who are you? Are you Elijah?" He said, "I am not." "Are you the Prophet?" He answered, "No." John replied, "I am the voice of one calling in the wilderness, make straight the way for the Lord."' },
        { ref: '1:29-34', text: 'The next day John saw Jesus coming toward him and said, "Look, the Lamb of God, who takes away the sin of the world! This is the one I meant when I said, a man who comes after me has surpassed me because he was before me." Then John gave this testimony: "I saw the Spirit come down from heaven as a dove and remain on him. I have seen and I testify that this is God\'s Chosen One."' },
        { ref: '1:35-42', text: 'The next day John was there again with two of his disciples. When he saw Jesus passing by, he said, "Look, the Lamb of God!" When the two disciples heard him say this, they followed Jesus. Turning around, Jesus saw them following and asked, "What do you want?" They said, "Rabbi, where are you staying?" "Come," he replied, "and you will see." Andrew, Simon Peter\'s brother, was one of the two. The first thing Andrew did was to find his brother Simon and tell him, "We have found the Messiah."' },
        { ref: '1:43-51', text: 'The next day Jesus decided to leave for Galilee. Finding Philip, he said to him, "Follow me." Philip found Nathanael and told him, "We have found the one Moses wrote about in the Law -- Jesus of Nazareth, the son of Joseph." "Nazareth! Can anything good come from there?" Nathanael asked. When Jesus saw Nathanael approaching, he said, "Here truly is an Israelite in whom there is no deceit." Nathanael declared, "Rabbi, you are the Son of God; you are the king of Israel."' },
      ]},
      { ch: 2, chunks: [
        { ref: '2:1-12',  text: 'On the third day a wedding took place at Cana in Galilee. When the wine was gone, Jesus\'s mother said to him, "They have no more wine." "Woman, why do you involve me?" Jesus replied. "My hour has not yet come." His mother said to the servants, "Do whatever he tells you." Jesus said, "Fill the jars with water." What Jesus did here in Cana of Galilee was the first of the signs through which he revealed his glory; and his disciples believed in him.' },
        { ref: '2:13-22', text: 'When it was almost time for the Jewish Passover, Jesus went up to Jerusalem. In the temple courts he found people selling cattle, sheep and doves. So he made a whip out of cords, and drove all from the temple courts. "What sign can you show us to prove your authority to do all this?" The Jews asked. Jesus answered them, "Destroy this temple, and I will raise it again in three days."' },
        { ref: '2:23-25', text: 'Now while he was in Jerusalem at the Passover Festival, many people saw the signs he was performing and believed in his name. But Jesus would not entrust himself to them, for he knew all people. He did not need any testimony about mankind, for he knew what was in each person.' },
      ]},
      { ch: 3, chunks: [
        { ref: '3:1-8',   text: 'Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council. He came to Jesus at night and said, "Rabbi, we know that you are a teacher who has come from God." Jesus replied, "Very truly I tell you, no one can see the kingdom of God unless they are born again." "How can someone be born when they are old?" Nicodemus asked.' },
        { ref: '3:9-21',  text: '"How can this be?" Nicodemus asked. Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up, that everyone who believes may have eternal life in him. For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. For God did not send his Son into the world to condemn the world, but to save the world through him.' },
        { ref: '3:22-36', text: 'To this John replied, "A person can receive only what is given them from heaven. The bride belongs to the bridegroom. The friend who attends the bridegroom waits and listens for him, and is full of joy when he hears the bridegroom\'s voice. That joy is mine, and it is now complete. He must become greater; I must become less."' },
      ]},
      // Chapters 4-21: add following the same pattern
    ]
  },
  // Additional books: add following the same pattern
  // {
  //   id: 'genesis',
  //   name: 'Genesis',
  //   testament: 'OT',
  //   version: 'NIV',
  //   chapters: [ ... ]
  // },
]

export function getBook(id: string): Book | undefined {
  return BOOKS.find(b => b.id === id)
}

export function getChapter(bookId: string, ch: number): Chapter | undefined {
  return getBook(bookId)?.chapters.find(c => c.ch === ch)
}
