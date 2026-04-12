'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Book {
  id: string
  title: string
  author_name: string
  primary_cover_url: string | null
  page_count: number | null
  first_published_year: number | null
}

interface UserBook {
  id: string
  status: string
  rating: number | null
  date_started: string | null
  date_finished: string | null
  current_page: number | null
  dnf_percent: number | null
  dnf_reason: string | null
  created_at: string
  books: Book
}

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'reading', label: 'Reading' },
  { value: 'want_to_read', label: 'Want to Read' },
  { value: 'read', label: 'Read' },
  { value: 'dnf', label: 'DNF' },
]

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 !== 0

  return (
    <span className="text-yellow-500 text-sm">
      {'★'.repeat(fullStars)}
      {hasHalf && '½'}
    </span>
  )
}

export default function MyBooksClient({ userBooks }: { userBooks: UserBook[] }) {
  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()

  const filtered = activeTab === 'all'
    ? userBooks
    : userBooks.filter((ub) => ub.status === activeTab)

  const counts: Record<string, number> = {
    all: userBooks.length,
    reading: userBooks.filter((ub) => ub.status === 'reading').length,
    want_to_read: userBooks.filter((ub) => ub.status === 'want_to_read').length,
    read: userBooks.filter((ub) => ub.status === 'read').length,
    dnf: userBooks.filter((ub) => ub.status === 'dnf').length,
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Books</h1>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/search')}
              className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200"
            >
              + Add Books
            </button>
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white text-sm py-2"
            >
              ← Home
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.value
                  ? 'bg-white text-black'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-60">{counts[tab.value]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">
              {activeTab === 'all'
                ? "You haven't added any books yet."
                : `No books in this shelf.`}
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 hover:border-gray-500"
            >
              Search for books
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ub) => (
              <div
                key={ub.id}
                className="flex gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800"
              >
                {ub.books.primary_cover_url ? (
                  <img
                    src={ub.books.primary_cover_url}
                    alt={`Cover of ${ub.books.title}`}
                    className="w-14 h-20 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-20 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-600 text-xs text-center px-1">No Cover</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold truncate">{ub.books.title}</h2>
                  <p className="text-gray-400 text-sm">
                    {ub.books.author_name}
                    {ub.books.first_published_year && ` · ${ub.books.first_published_year}`}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <StarRating rating={ub.rating} />
                    {ub.status === 'reading' && ub.current_page && ub.books.page_count && (
                      <span className="text-gray-500 text-xs">
                        Page {ub.current_page} of {ub.books.page_count}
                      </span>
                    )}
                    {ub.status === 'dnf' && ub.dnf_percent && (
                      <span className="text-gray-500 text-xs">
                        Stopped at {ub.dnf_percent}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`px-2 py-1 rounded text-xs ${
                    ub.status === 'reading' ? 'bg-blue-900 text-blue-300' :
                    ub.status === 'read' ? 'bg-green-900 text-green-300' :
                    ub.status === 'want_to_read' ? 'bg-purple-900 text-purple-300' :
                    'bg-red-900 text-red-300'
                  }`}>
                    {ub.status === 'want_to_read' ? 'Want to Read' :
                     ub.status === 'reading' ? 'Reading' :
                     ub.status === 'read' ? 'Read' : 'DNF'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}