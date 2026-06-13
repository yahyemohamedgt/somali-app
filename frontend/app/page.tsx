import Link from 'next/link'
import { fetchLessons } from '@/lib/api'
import type { Lesson } from '@/types'

const CATEGORY_COLORS: Record<string, string> = {
  greetings: 'bg-blue-100 text-blue-700',
  food:      'bg-orange-100 text-orange-700',
  family:    'bg-pink-100 text-pink-700',
  numbers:   'bg-purple-100 text-purple-700',
  colors:    'bg-green-100 text-green-700',
  animals:   'bg-yellow-100 text-yellow-700',
  body:      'bg-red-100 text-red-700',
  time:      'bg-teal-100 text-teal-700',
  travel:    'bg-sky-100 text-sky-700',
  weather:   'bg-cyan-100 text-cyan-700',
}

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat.toLowerCase()] ?? 'bg-gray-100 text-gray-600'
}

export default async function HomePage() {
  let lessons: Lesson[] = []
  let error = false

  try {
    lessons = await fetchLessons()
  } catch {
    error = true
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 pt-14 pb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl">🇸🇴</span>
          <h1 className="text-2xl font-bold tracking-tight">SomaliNimo</h1>
        </div>
        <p className="text-indigo-200 text-sm pl-1">
          {error ? 'Could not load lessons' : `Learn Somali • ${lessons.length} lessons`}
        </p>
      </div>

      {error ? (
        <div className="p-10 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-medium text-gray-600">Could not connect to the API.</p>
          <p className="text-sm mt-1 text-gray-400">Make sure the backend is running on localhost:8000.</p>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-3 max-w-lg mx-auto">
          {lessons.map((lesson: Lesson) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              {/* Order badge */}
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                {lesson.order}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">{lesson.title}</p>
                <p className="text-sm text-gray-400 truncate">{lesson.title_somali}</p>
              </div>

              {/* Category + arrow */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${categoryColor(lesson.category)}`}>
                  {lesson.category}
                </span>
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
