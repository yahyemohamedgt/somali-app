import { fetchLesson } from '@/lib/api'
import LessonPlayer from './LessonPlayer'

interface Props {
  params: Promise<{ id: string }>
}

export default async function LessonPage({ params }: Props) {
  const { id } = await params

  let lesson
  try {
    lesson = await fetchLesson(id)
  } catch {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-medium text-gray-600">Lesson not found.</p>
      </div>
    )
  }

  if (lesson.words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium text-gray-600">This lesson has no words yet.</p>
      </div>
    )
  }

  return <LessonPlayer lesson={lesson} />
}
