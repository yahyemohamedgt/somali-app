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
      <div style={{
        background: '#0F0F1A', color: '#8888aa',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '32px', textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
        <div style={{ fontWeight: 600 }}>Lesson not found.</div>
      </div>
    )
  }

  if (lesson.words.length === 0) {
    return (
      <div style={{
        background: '#0F0F1A', color: '#8888aa',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '32px', textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
        <div style={{ fontWeight: 600 }}>This lesson has no words yet.</div>
      </div>
    )
  }

  return <LessonPlayer lesson={lesson} />
}
