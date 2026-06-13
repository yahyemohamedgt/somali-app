import Link from 'next/link'
import { fetchLessons } from '@/lib/api'
import type { Lesson } from '@/types'

const CATEGORY_EMOJI: Record<string, string> = {
  greetings:  '👋',
  family:     '👨‍👩‍👧',
  numbers:    '🔢',
  animals:    '🐪',
  food:       '🍽️',
  school:     '📚',
  home:       '🏠',
  body:       '💪',
  feelings:   '❤️',
  nature:     '🌿',
  colors:     '🎨',
  days:       '📅',
  adjectives: '✨',
}

const CATEGORY_COLOR: Record<string, string> = {
  greetings:  '#4ECDC4',
  family:     '#FF6B6B',
  numbers:    '#FFE66D',
  animals:    '#FF9F43',
  food:       '#FF6B6B',
  school:     '#4ECDC4',
  home:       '#A29BFE',
  body:       '#FF6B6B',
  feelings:   '#FF6B6B',
  nature:     '#55efc4',
  colors:     '#FFE66D',
  days:       '#74b9ff',
  adjectives: '#FFE66D',
}

export default async function HomePage() {
  let lessons: Lesson[] = []
  let error = false
  try { lessons = await fetchLessons() } catch { error = true }

  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* Hero */}
      <div style={{ backgroundColor: '#1A1A2E', padding: '56px 20px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '52px', lineHeight: 1, marginBottom: '8px' }}>🇸🇴</div>
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#ffffff', lineHeight: 1, marginBottom: '10px' }}>
              SomaliNimo
            </div>
            <div style={{ fontSize: '16px', color: '#4ECDC4', fontWeight: 600 }}>
              Speak your roots
            </div>
          </div>

          {/* Streak badge */}
          <div style={{
            backgroundColor: '#0F0F1A',
            border: '2px solid #FFE66D',
            borderRadius: '16px',
            padding: '14px 16px',
            textAlign: 'center',
            flexShrink: 0,
            marginLeft: '16px',
          }}>
            <div style={{ fontSize: '28px', lineHeight: 1, marginBottom: '4px' }}>🔥</div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>5</div>
            <div style={{ fontSize: '11px', color: '#FFE66D', fontWeight: 700, marginTop: '4px' }}>day streak</div>
          </div>

        </div>
      </div>

      {/* Lesson grid */}
      <div style={{ padding: '28px 16px 48px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#555577',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '16px',
        }}>
          Lessons
        </div>

        {error ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#8888aa' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
            <div>Could not connect to the API.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {lessons.map((lesson, i) => {
              const unlocked = i < 6
              const emoji = CATEGORY_EMOJI[lesson.category] ?? '📖'
              const color = CATEGORY_COLOR[lesson.category] ?? '#4ECDC4'

              return (
                <Link
                  key={lesson.id}
                  href={unlocked ? `/lessons/${lesson.id}` : '#'}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    backgroundColor: '#1A1A2E',
                    borderRadius: '16px',
                    borderTop: `4px solid ${color}`,
                    padding: '16px',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: unlocked ? 1 : 0.4,
                  }}
                >
                  {!unlocked && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      borderRadius: '16px',
                    }}>
                      🔒
                    </div>
                  )}
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>{emoji}</div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginBottom: '4px',
                    lineHeight: 1.3,
                  }}>
                    {lesson.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666688', marginBottom: '12px' }}>
                    {lesson.title_somali}
                  </div>
                  <div style={{ fontSize: '14px', color: '#FFE66D' }}>☆☆☆</div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
