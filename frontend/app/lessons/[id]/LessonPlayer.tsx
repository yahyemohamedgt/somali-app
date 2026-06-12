'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { LessonDetail, Word } from '@/types'

interface Props {
  lesson: LessonDetail
}

type Phase = 'flashcard' | 'quiz'

export default function LessonPlayer({ lesson }: Props) {
  const { words } = lesson
  const [wordIndex, setWordIndex]       = useState(0)
  const [phase, setPhase]               = useState<Phase>('flashcard')
  const [selectedAnswer, setSelected]   = useState<string | null>(null)
  const [score, setScore]               = useState(0)
  const [complete, setComplete]         = useState(false)

  const current = words[wordIndex]

  // Stable per-word quiz options — only reshuffles when word changes
  const quizOptions = useMemo<Word[]>(() => {
    if (!current) return []
    const pool    = words.filter(w => w.id !== current.id)
    const wrong   = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(3, pool.length))
    return [...wrong, current].sort(() => Math.random() - 0.5)
  }, [wordIndex, words]) // eslint-disable-line react-hooks/exhaustive-deps

  const progress = words.length > 0 ? (wordIndex / words.length) * 100 : 0

  function handleContinue() {
    setPhase('quiz')
  }

  function handleAnswer(word: Word) {
    if (selectedAnswer !== null) return
    setSelected(word.id)
    if (word.id === current.id) setScore(s => s + 1)
  }

  function handleNext() {
    setSelected(null)
    if (wordIndex + 1 >= words.length) {
      setComplete(true)
    } else {
      setWordIndex(i => i + 1)
      setPhase('flashcard')
    }
  }

  function playAudio() {
    if (current?.audio_url) new Audio(current.audio_url).play().catch(() => {})
  }

  // --- Completion screen ---
  if (complete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
        <div className="text-7xl mb-5">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Lesson Complete!</h2>
        <p className="text-gray-400 mb-6">{lesson.title}</p>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-12 py-6 mb-8">
          <p className="text-5xl font-bold text-indigo-600">
            {score}
            <span className="text-2xl text-gray-300">/{words.length}</span>
          </p>
          <p className="text-gray-400 mt-1 text-sm">words correct</p>
        </div>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors"
        >
          Back to Lessons
        </Link>
      </div>
    )
  }

  if (!current) return null

  const isAnswered = selectedAnswer !== null
  const isRight    = selectedAnswer === current.id

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with progress */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <Link href="/" className="p-1 text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-400 font-medium tabular-nums">
          {wordIndex + 1}/{words.length}
        </span>
      </div>

      {phase === 'flashcard' ? (
        /* ---- Flashcard ---- */
        <div className="flex flex-col flex-1 p-5">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest text-center mb-5">
            Word {wordIndex + 1} of {words.length}
          </p>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 w-full p-10 text-center">
              <p className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
                {current.somali}
              </p>
              <p className="text-xl text-gray-400 mb-6">{current.english}</p>

              {current.audio_url && (
                <button
                  onClick={playAudio}
                  className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06z" />
                  </svg>
                  Listen
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="mt-5 w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Continue →
          </button>
        </div>
      ) : (
        /* ---- Quiz ---- */
        <div className="flex flex-col flex-1 p-5">
          <div className="mb-7">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-2">
              What does this mean?
            </p>
            <p className="text-3xl font-bold text-gray-800">{current.somali}</p>
          </div>

          <div className="flex flex-col gap-3">
            {quizOptions.map(option => {
              const isSelected = selectedAnswer === option.id
              const isCorrectOption = option.id === current.id

              let cls = 'w-full py-4 px-5 rounded-2xl border-2 font-semibold text-left text-base transition-all '
              if (!isAnswered) {
                cls += 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
              } else if (isCorrectOption) {
                cls += 'border-green-400 bg-green-50 text-green-700'
              } else if (isSelected) {
                cls += 'border-red-400 bg-red-50 text-red-700'
              } else {
                cls += 'border-gray-100 bg-gray-50 text-gray-300'
              }

              return (
                <button key={option.id} onClick={() => handleAnswer(option)} className={cls}>
                  <span className="flex items-center justify-between">
                    {option.english}
                    {isAnswered && isCorrectOption && <span className="text-green-500 text-lg">✓</span>}
                    {isSelected && !isCorrectOption && <span className="text-red-400 text-lg">✗</span>}
                  </span>
                </button>
              )
            })}
          </div>

          {isAnswered && (
            <div className="mt-5">
              <div className={`text-center py-3 rounded-xl mb-3 text-sm font-semibold ${isRight ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {isRight ? 'Correct! Well done! 🎉' : `Correct answer: ${current.english}`}
              </div>
              <button
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all"
              >
                {wordIndex + 1 >= words.length ? 'Finish Lesson' : 'Next Word →'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
