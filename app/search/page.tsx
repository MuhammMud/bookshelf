'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BookResult {
  openLibraryKey: string
  title: string
  author: string
  authors: string[]
  firstPublishYear: number | null
  coverUrl: string | null
  pageCount: number | null
  subjects: string[]
  isbn: string | null
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const router = useRouter()

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.length < 2) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Search Books</h1>
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading || query.length < 2}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-400">Searching Open Library...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No books found. Try a different search term.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm">{results.length} results</p>
            {results.map((book) => (
              <div
                key={book.openLibraryKey}
                className="flex gap-4 p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors"
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    className="w-16 h-24 object-cover rounded flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-24 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-gray-600 text-xs text-center px-1">No Cover</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg truncate">{book.title}</h2>
                  <p className="text-gray-400 text-sm">
                    {book.author}
                    {book.firstPublishYear && ` · ${book.firstPublishYear}`}
                  </p>
                  {book.pageCount && (
                    <p className="text-gray-500 text-xs mt-1">{book.pageCount} pages</p>
                  )}
                  {book.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {book.subjects.slice(0, 3).map((subject) => (
                        <span
                          key={subject}
                          className="px-2 py-0.5 bg-gray-800 rounded text-gray-400 text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}