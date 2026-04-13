'use client'

import { useState, useEffect } from 'react'
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

const STATUS_OPTIONS = [
  { value: 'want_to_read', label: 'Want to Read' },
  { value: 'reading', label: 'Reading' },
  { value: 'read', label: 'Read' },
  { value: 'dnf', label: 'DNF' },
]

export default function SearchClient({ name, initialQuery }: { name: string, initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<BookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [shelving, setShelving] = useState<string | null>(null)
  const [shelved, setShelved] = useState<Record<string, string>>({})
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const router = useRouter()
  useEffect(() => {
    if (initialQuery) {
      doSearch(initialQuery)
    }
  }, [])

  async function doSearch(searchQuery: string) {
    if (searchQuery.length < 2) return
    setLoading(true)
    setSearched(true)
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    }
    setLoading(false)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    doSearch(query)
  }

  async function handleShelve(book: BookResult, status: string) {
    setShelving(book.openLibraryKey)
    setOpenMenu(null)
    try {
      const response = await fetch('/api/books/shelve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          openLibraryKey: book.openLibraryKey,
          coverUrl: book.coverUrl,
          pageCount: book.pageCount,
          firstPublishYear: book.firstPublishYear,
          status,
        }),
      })
      if (response.ok) {
        setShelved((prev) => ({ ...prev, [book.openLibraryKey]: status }))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to shelve book')
      }
    } catch (error) {
      alert('Something went wrong. Please try again.')
    }
    setShelving(null)
  }

  function getStatusLabel(status: string) {
    return STATUS_OPTIONS.find((s) => s.value === status)?.label || status
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf6f0', color: '#3d3529' }}>

      {/* Navigation */}
      <nav style={{ maxWidth: '880px', margin: '0 auto', padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, color: '#2c2418', letterSpacing: '-0.01em', cursor: 'pointer' }}
        >
          {name}&apos;s bookshelf
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => router.push('/my-books')}
            style={{ background: 'none', border: 'none', color: '#3d3529', fontSize: '14px', cursor: 'pointer' }}
          >
            Library
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Search header */}
        <section style={{ paddingTop: '48px', paddingBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#2c2418', letterSpacing: '-0.02em', marginBottom: '24px' }}>
            Search
          </h1>
          <form onSubmit={handleSearch}>
            <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  paddingRight: '100px',
                  backgroundColor: '#f4efe6',
                  border: '1px solid #e8dfd2',
                  borderRadius: '12px',
                  fontSize: '15px',
                  color: '#3d3529',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
              />
              <button
                type="submit"
                disabled={loading || query.length < 2}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  padding: '0 16px',
                  backgroundColor: loading || query.length < 2 ? '#b5c4b7' : '#5b7a5e',
                  color: '#faf6f0',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: loading || query.length < 2 ? 'default' : 'pointer',
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </section>

        {/* Loading */}
        {loading && (
          <p style={{ textAlign: 'center', color: '#a08c6e', padding: '40px 0' }}>Searching Open Library...</p>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && (
          <p style={{ textAlign: 'center', color: '#a08c6e', padding: '40px 0' }}>No books found. Try a different search term.</p>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <section>
            <p style={{ fontSize: '13px', color: '#a08c6e', marginBottom: '16px' }}>{results.length} results</p>
            {results.map((book, index) => (
              <div
                key={book.openLibraryKey}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px 0',
                  borderBottom: index < results.length - 1 ? '1px solid #ebe5da' : 'none',
                  alignItems: 'flex-start',
                }}
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{
                      width: '56px',
                      height: '84px',
                      objectFit: 'cover',
                      borderRadius: '6px',
                      boxShadow: '0 1px 4px rgba(60,45,30,0.1)',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: '56px',
                    height: '84px',
                    backgroundColor: '#ebe5da',
                    borderRadius: '6px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: '#b5a78d', fontSize: '10px', textAlign: 'center' }}>No Cover</span>
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#2c2418', lineHeight: 1.3 }}>{book.title}</h2>
                  <p style={{ fontSize: '14px', color: '#8a7d6b', marginTop: '2px' }}>
                    {book.author}
                    {book.firstPublishYear && ` · ${book.firstPublishYear}`}
                  </p>
                  {book.pageCount && (
                    <p style={{ fontSize: '12px', color: '#a09585', marginTop: '4px' }}>{book.pageCount} pages</p>
                  )}
                  {book.subjects.length > 0 && (
                    <p style={{ fontSize: '12px', color: '#b5a78d', marginTop: '6px' }}>
                      {book.subjects.slice(0, 3).join(' · ')}
                    </p>
                  )}
                </div>

                <div style={{ flexShrink: 0, position: 'relative' }}>
                  {shelved[book.openLibraryKey] ? (
                    <button
                      onClick={() => setOpenMenu(openMenu === book.openLibraryKey ? null : book.openLibraryKey)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#e8f0e8',
                        color: '#5b7a5e',
                        fontSize: '13px',
                        fontWeight: 500,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      ✓ {getStatusLabel(shelved[book.openLibraryKey])}
                    </button>
                  ) : (
                    <button
                      onClick={() => setOpenMenu(openMenu === book.openLibraryKey ? null : book.openLibraryKey)}
                      disabled={shelving === book.openLibraryKey}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: 'transparent',
                        color: '#5b7a5e',
                        fontSize: '13px',
                        fontWeight: 500,
                        border: '1px solid #5b7a5e',
                        borderRadius: '8px',
                        cursor: shelving === book.openLibraryKey ? 'default' : 'pointer',
                        opacity: shelving === book.openLibraryKey ? 0.5 : 1,
                      }}
                    >
                      {shelving === book.openLibraryKey ? '...' : '+ Shelve'}
                    </button>
                  )}
                  {openMenu === book.openLibraryKey && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '4px',
                      backgroundColor: '#faf6f0',
                      border: '1px solid #e8dfd2',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      zIndex: 10,
                      width: '160px',
                      boxShadow: '0 4px 12px rgba(60,45,30,0.1)',
                    }}>
                      {STATUS_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleShelve(book, option.value)}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '10px 16px',
                            fontSize: '13px',
                            color: '#3d3529',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f4efe6')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Footer */}
        <footer style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #ebe5da' }}>
          <p style={{ color: '#c5b9a8', fontSize: '12px', textAlign: 'center' }}>bookshelf</p>
        </footer>
      </div>
    </div>
  )
}