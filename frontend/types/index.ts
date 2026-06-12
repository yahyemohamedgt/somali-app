export interface Word {
  id: string
  somali: string
  english: string
  category: string
  difficulty: number
  audio_url: string | null
}

export interface Sentence {
  id: string
  somali: string
  english: string
  category: string
  difficulty: number
  word_ids: string[]
}

export interface Lesson {
  id: string
  title: string
  title_somali: string
  category: string
  order: number
  word_ids: string[]
  sentence_ids: string[]
}

export interface LessonDetail {
  id: string
  title: string
  title_somali: string
  category: string
  order: number
  words: Word[]
  sentences: Sentence[]
}
