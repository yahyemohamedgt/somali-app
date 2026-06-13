'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { LessonDetail, Word } from '@/types'

type Status = 'idle' | 'correct' | 'wrong'

export default function LessonPlayer({ lesson }: { lesson: LessonDetail }) {
  const { words } = lesson
  const [index, setIndex]     = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [status, setStatus]   = useState<Status>('idle')
  const [score, setScore]     = useState(0)
  const [done, setDone]       = useState(false)

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
    if (!selected || status !== 'idle') return
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

  function optionStyle(opt: Word): string {
    const base = 'w-full py-4 px-4 rounded-2xl border-2 font-semibold text-base text-left transition-all '
    if (status === 'idle') {
      return base + (selected === opt.id
        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
        : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 active:scale-95')
    }
    if (opt.id === current.id) return base + 'border-green-500 bg-green-50 text-green-700'
    if (opt.id === selected)   return base + 'border-red-400 bg-red-50 text-red-600'
    return base + 'border-gray-100 bg-gray-50 text-gray-300'
  }

  // ── Completion screen ──────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col h-screen max-w-[390px] mx-auto bg-white">
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <div className="w-full bg-green-500 h-2.5 rounded-full" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Lesson Complete!</h2>
          <p className="text-gray-400 mb-8">{lesson.title}</p>
          <div className="bg-gray-50 rounded-3xl px-14 py-6 mb-8 w-full">
            <p className="text-5xl font-bold text-indigo-600">
              {score}
              <span className="text-2xl text-gray-300">/{words.length}</span>
            </p>
            <p className="text-gray-400 mt-1 text-sm">correct</p>
          </div>
          <Link
            href="/"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-base text-center hover:bg-indigo-700 transition-colors"
          >
            Back to Lessons
          </Link>
        </div>
      </div>
    )
  }

  const isAnswered = status !== 'idle'
  const isCorrect  = status === 'correct'

  // ── Lesson screen ──────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen max-w-[390px] mx-auto bg-white">

      {/* Fixed header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
        <Link href="/" className="text-gray-400 hover:text-gray-600 shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>
        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-400 font-medium tabular-nums shrink-0">
          {index + 1}/{words.length}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 pt-8 pb-4 overflow-hidden">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
          What does this mean?
        </p>
        <p className="text-3xl font-bold text-gray-800 mb-8 leading-tight">
          {current.somali}
        </p>

        <div className="flex flex-col gap-3">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt)}
              className={optionStyle(opt)}
              disabled={isAnswered}
            >
              {opt.english}
            </button>
          ))}
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className={`shrink-0 px-5 pt-4 pb-6 transition-colors duration-200 ${
        isCorrect  ? 'bg-green-50 border-t-2 border-green-200' :
        status === 'wrong' ? 'bg-red-50 border-t-2 border-red-200' :
        'bg-white border-t border-gray-100'
      }`}>
        {isAnswered && (
          <div className="flex items-start gap-3 mb-4">
            <span className={`text-xl mt-0.5 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? '✓' : '✗'}
            </span>
            <div>
              <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {!isCorrect && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Correct answer: <span className="font-semibold">{current.english}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={isAnswered ? handleContinue : handleCheck}
          disabled={!selected && !isAnswered}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-95 ${
            isCorrect        ? 'bg-green-500 text-white' :
            status === 'wrong' ? 'bg-red-500 text-white' :
            selected           ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
            'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAnswered ? 'Continue' : 'Check'}
        </button>
      </div>

    </div>
  )
}
