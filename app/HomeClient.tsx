'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
  current_page: number | null
  updated_at: string
  books: Book
}

interface Profile {
  username: string
  display_name: string | null
  avatar_url: string | null
}

export default function HomeClient({ profile, userBooks }: { profile: Profile | null, userBooks: UserBook[] }) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const reading = userBooks.filter((ub) => ub.status === 'reading')
  const read = userBooks.filter((ub) => ub.status === 'read')
  const name = profile?.display_name || profile?.username || 'Reader'

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf6f0', color: '#3d3529' }}>

      {/* Navigation */}
      <nav style={{ maxWidth: '880px', margin: '0 auto', padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#2c2418', letterSpacing: '-0.01em' }}>{name}&apos;s bookshelf</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => router.push('/my-books')}
            style={{ background: 'none', border: 'none', color: '#3d3529', fontSize: '14px', cursor: 'pointer' }}
          >
            Library
          </button>
          <form action="/auth/signout" method="POST">
            <button type="submit" style={{ background: 'none', border: 'none', color: '#b5a78d', fontSize: '14px', cursor: 'pointer' }}>
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Hero: Search */}
        <section style={{ paddingTop: '72px', paddingBottom: '56px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#2c2418', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '28px' }}>
            What are you reading next?
          </h1>
          <form onSubmit={handleSearch}>
            <div style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  bottom: '6px',
                  padding: '0 16px',
                  backgroundColor: '#5b7a5e',
                  color: '#faf6f0',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Search
              </button>
            </div>
          </form>
        </section>

        {/* Reading stats */}
        {userBooks.length > 0 && (
          <section style={{ marginBottom: '56px', display: 'flex', gap: '40px', borderTop: '1px solid #ebe5da', paddingTop: '24px', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#5b7a5e', lineHeight: 1 }}>{read.length}</p>
              <p style={{ fontSize: '13px', color: '#a08c6e', marginTop: '4px' }}>books finished</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#2c2418', lineHeight: 1 }}>{reading.length}</p>
              <p style={{ fontSize: '13px', color: '#a08c6e', marginTop: '4px' }}>in progress</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '28px', fontWeight: 700, color: '#2c2418', lineHeight: 1 }}>{userBooks.length}</p>
              <p style={{ fontSize: '13px', color: '#a08c6e', marginTop: '4px' }}>in your library</p>
            </div>
          </section>
        )}

        {/* Currently Reading */}
        {reading.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '13px', color: '#a08c6e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px', textAlign: 'center' }}>
              Picking up where you left off
            </h2>
            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {reading.slice(0, 4).map((ub) => (
                <div key={ub.id} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {ub.books.primary_cover_url ? (
                    <img
                      src={ub.books.primary_cover_url}
                      alt={ub.books.title}
                      style={{
                        width: '48px',
                        height: '72px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        boxShadow: '0 1px 6px rgba(60,45,30,0.1)',
                      }}
                    />
                  ) : (
                    <div style={{ width: '48px', height: '72px', backgroundColor: '#ebe5da', borderRadius: '6px' }} />
                  )}
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#2c2418', lineHeight: 1.3 }}>{ub.books.title}</p>
                    <p style={{ fontSize: '12px', color: '#a09585' }}>{ub.books.author_name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent activity */}
        {userBooks.length > 0 && (
          <section style={{ marginBottom: '56px' }}>
            <h2 style={{ fontSize: '13px', color: '#a08c6e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
              Recent activity
            </h2>
            {userBooks.slice(0, 5).map((ub, index) => {
              const action = ub.status === 'reading' ? 'started reading'
                : ub.status === 'read' ? 'finished'
                : ub.status === 'want_to_read' ? 'wants to read'
                : 'shelved'

              const timeAgo = getTimeAgo(ub.updated_at)

              return (
                <div key={ub.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: index < 4 ? '1px solid #ebe5da' : 'none',
                }}>
                  {ub.books.primary_cover_url ? (
                    <img
                      src={ub.books.primary_cover_url}
                      alt={ub.books.title}
                      style={{ width: '32px', height: '48px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: '32px', height: '48px', backgroundColor: '#ebe5da', borderRadius: '4px', flexShrink: 0 }} />
                  )}
                  <p style={{ fontSize: '14px', color: '#3d3529', flex: 1 }}>
                    You {action} <span style={{ fontWeight: 600 }}>{ub.books.title}</span>
                    <span style={{ color: '#a09585' }}> by {ub.books.author_name}</span>
                  </p>
                  <span style={{ fontSize: '12px', color: '#b5a78d', flexShrink: 0 }}>{timeAgo}</span>
                </div>
              )
            })}
          </section>
        )}

        {/* Empty state */}
        {userBooks.length === 0 && (
          <section style={{ textAlign: 'center', padding: '40px 0 60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#2c2418', marginBottom: '12px' }}>
              Start your library
            </h2>
            <p style={{ color: '#8a7d6b', maxWidth: '380px', margin: '0 auto', lineHeight: 1.6 }}>
              Search for a book above to begin tracking your reading journey.
            </p>
          </section>
        )}

        {/* Footer */}
        <footer style={{ paddingTop: '32px', borderTop: '1px solid #ebe5da' }}>
          <p style={{ color: '#c5b9a8', fontSize: '12px', textAlign: 'center' }}>bookshelf</p>
        </footer>
      </div>
    </div>
  )
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}