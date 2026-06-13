'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { LessonDetail, Word } from '@/types'

type Status = 'idle' | 'correct' | 'wrong'

const CELEBRATIONS = [
  { so: 'Aad baad u fiicantahay!', en: "You're amazing!"  },
  { so: 'Waad ku guuleysatay!',    en: 'You succeeded!'   },
  { so: 'Ku sii wad!',             en: 'Keep it up!'      },
]

export default function LessonPlayer({ lesson }: { lesson: LessonDetail }) {
  const { words } = lesson
  const [index, setIndex]       = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus]     = useState<Status>('idle')
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)
  const [msgIndex]              = useState(() => Math.floor(Math.random() * CELEBRATIONS.length))

  const current  = words[index]
  const progress = words.length > 0 ? (index / words.length) * 100 : 0

  const options = useMemo<Word[]>(() => {
    if (!current) return []
    const pool  = words.filter(w => w.id !== current.id)
    const wrong = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(3, pool.length))
    return [...wrong, current].sort(() => Math.random() - 0.5)
  }, [index, words]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(word: Word) {
    if (status !== 'idle') return
    setSelected(word.id)
  }

  function handleCheck() {
    if (!selected) return
    if (selected === current.id) {
      setScore(s => s + 1)
      setStatus('correct')
    } else {
      setStatus('wrong')
    }
  }

  function handleContinue() {
    if (index + 1 >= words.length) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setSelected(null)
      setStatus('idle')
    }
  }

  // ── Completion ─────────────────────────────────────────────────────────────
  if (done) {
    const pct   = words.length > 0 ? score / words.length : 0
    const stars = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : 1
    const xp    = score * 10
    const msg   = CELEBRATIONS[msgIndex]

    return (
      <div style={{
        backgroundColor: '#0F0F1A',
        minHeight: '100vh',
        maxWidth: '390px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '72px', marginBottom: '12px' }}>🎉</div>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>
          {'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
          {msg.so}
        </div>
        <div style={{ fontSize: '14px', color: '#8888aa', marginBottom: '32px' }}>
          {msg.en}
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          borderRadius: '20px',
          padding: '20px 40px',
          marginBottom: '12px',
          width: '100%',
        }}>
          <div style={{ fontSize: '48px', fontWeight: 900, color: '#FFE66D' }}>+{xp}</div>
          <div style={{ fontSize: '13px', color: '#8888aa', marginTop: '4px' }}>XP earned</div>
        </div>

        <div style={{
          backgroundColor: '#1A1A2E',
          borderRadius: '20px',
          padding: '16px 40px',
          marginBottom: '32px',
          width: '100%',
        }}>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#4ECDC4' }}>
            {score}
            <span style={{ fontSize: '18px', color: '#555577' }}>/{words.length}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#8888aa' }}>correct answers</div>
        </div>

        <Link href="/" style={{
          display: 'block',
          width: '100%',
          backgroundColor: '#4ECDC4',
          color: '#0F0F1A',
          padding: '18px',
          borderRadius: '16px',
          fontWeight: 900,
          fontSize: '16px',
          textDecoration: 'none',
          textAlign: 'center',
        }}>
          Back to Lessons
        </Link>
      </div>
    )
  }

  const isAnswered = status !== 'idle'
  const isCorrect  = status === 'correct'

  // ── Lesson ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      backgroundColor: '#0F0F1A',
      height: '100vh',
      maxWidth: '390px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 16px 12px',
        flexShrink: 0,
      }}>
        <Link href="/" style={{ color: '#555577', flexShrink: 0, lineHeight: 0 }}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div style={{
          flex: 1,
          height: '8px',
          borderRadius: '8px',
          backgroundColor: '#1A1A2E',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            borderRadius: '8px',
            backgroundColor: '#4ECDC4',
            width: `${progress}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>

        <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ECDC4', flexShrink: 0 }}>
          {index + 1}/{words.length}
        </span>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px 16px',
        overflow: 'hidden',
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 700,
          color: '#555577',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '20px',
        }}>
          What does this mean?
        </div>

        <div style={{
          fontSize: '48px',
          fontWeight: 900,
          color: '#4ECDC4',
          lineHeight: 1.2,
          marginBottom: '32px',
          textAlign: 'center',
        }}>
          {current.somali}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {options.map(opt => {
            const isThisSelected = selected === opt.id
            const isThisCorrect  = opt.id === current.id
            const isThisWrong    = isAnswered && isThisSelected && !isThisCorrect

            let bg     = '#1A1A2E'
            let border = '2px solid #2A2A3E'
            let color  = '#ffffff'
            let icon   = ''

            if (status === 'idle') {
              if (isThisSelected) {
                border = '2px solid #4ECDC4'
              }
            } else {
              if (isThisCorrect) {
                bg     = '#00C851'
                border = '2px solid #00C851'
                color  = '#ffffff'
                icon   = '✓'
              } else if (isThisSelected) {
                bg     = '#FF4444'
                border = '2px solid #FF4444'
                color  = '#ffffff'
                icon   = '✗'
              } else {
                color  = '#444466'
                border = '2px solid #1A1A2E'
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                disabled={isAnswered}
                style={{
                  backgroundColor: bg,
                  border,
                  borderRadius: '16px',
                  padding: '18px 20px',
                  color,
                  fontWeight: 700,
                  fontSize: '16px',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: isAnswered ? 'default' : 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                  animation: isThisWrong ? 'shake 0.35s ease-in-out' : 'none',
                  width: '100%',
                }}
              >
                <span>{opt.english}</span>
                {icon && <span style={{ fontSize: '20px' }}>{icon}</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        backgroundColor: '#1A1A2E',
        padding: '16px 20px 32px',
        flexShrink: 0,
      }}>
        {isAnswered && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '16px',
          }}>
            <span style={{
              fontSize: '20px',
              color: isCorrect ? '#00C851' : '#FF4444',
              marginTop: '2px',
            }}>
              {isCorrect ? '✓' : '✗'}
            </span>
            <div>
              <div style={{
                fontWeight: 900,
                fontSize: '16px',
                color: isCorrect ? '#00C851' : '#FF4444',
              }}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
              {!isCorrect && (
                <div style={{ fontSize: '14px', color: '#8888aa', marginTop: '4px' }}>
                  Answer:{' '}
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>{current.english}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={isAnswered ? handleContinue : handleCheck}
          disabled={!selected && !isAnswered}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: '16px',
            border: 'none',
            fontWeight: 900,
            fontSize: '16px',
            cursor: (!selected && !isAnswered) ? 'not-allowed' : 'pointer',
            backgroundColor: isCorrect          ? '#00C851'
                           : status === 'wrong' ? '#FF4444'
                           : selected           ? '#FFE66D'
                           : '#2A2A3E',
            color: (isCorrect || status === 'wrong' || selected) ? '#0F0F1A' : '#444466',
            transition: 'background 0.2s',
          }}
        >
          {isAnswered ? 'Continue' : 'Check'}
        </button>
      </div>

    </div>
  )
}
