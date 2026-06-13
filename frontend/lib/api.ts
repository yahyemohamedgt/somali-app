import type { Lesson, LessonDetail } from '@/types'

const API = 'http://3.238.143.142:8000'

export async function fetchLessons(): Promise<Lesson[]> {
  const res = await fetch(`${API}/lessons`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch lessons')
  return res.json()
}

export async function fetchLesson(id: string): Promise<LessonDetail> {
  const res = await fetch(`${API}/lessons/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch lesson')
  return res.json()
}
