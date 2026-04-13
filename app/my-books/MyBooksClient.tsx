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
  { value: 'read', label: 'Read' },
  { value: 'want_to_read', label: 'Want to Read' },
  { value: 'dnf', label: 'DNF' },
]

export default function MyBooksClient({ userBooks, name }: { userBooks: UserBook[], name: string }) {
  const [activeTab, setActiveTab] = useState('all')
  const router = useRouter()

  const filtered = activeTab === 'all'
    ? userBooks
    : userBooks.filter((ub) => ub.status === activeTab)

  const counts: Record<string, number> = {
    all: userBooks.length,
    reading: userBooks.filter((ub) => ub.status === 'reading').length,
    read: userBooks.filter((ub) => ub.status === 'read').length,
    want_to_read: userBooks.filter((ub) => ub.status === 'want_to_read').length,
    dnf: userBooks.filter((ub) => ub.status === 'dnf').length,
  }

  function getStatusLabel(status: string) {
    if (status === 'want_to_read') return 'Want to Read'
    if (status === 'reading') return 'Reading'
    if (status === 'read') return 'Read'
    if (status === 'dnf') return 'DNF'
    return status
  }

  function getStatusColor(status: string) {
    if (status === 'reading') return { bg: '#e8f0e8', text: '#5b7a5e' }
    if (status === 'read') return { bg: '#f0ece2', text: '#8b7355' }
    if (status === 'want_to_read') return { bg: '#e8e4f0', text: '#7a6b8a' }
    if (status === 'dnf') return { bg: '#f0e8e4', text: '#a08070' }
    return { bg: '#f4efe6', text: '#3d3529' }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf6f0', color: '#3d3529' }}>

      <nav style={{ maxWidth: '880px', margin: '0 auto', padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => router.push('/')}
          style={{ background: 'none', border: 'none', fontSize: '15px', fontWeight: 600, color: '#2c2418', letterSpacing: '-0.01em', cursor: 'pointer' }}
        >
          {name}&apos;s bookshelf
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => router.push('/search')}
            style={{ background: 'none', border: 'none', color: '#5b7a5e', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }}
          >
            Search
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 24px 80px' }}>

        <section style={{ paddingTop: '48px', paddingBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#2c2418', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Library
          </h1>
          <p style={{ fontSize: '14px', color: '#a08c6e' }}>{userBooks.length} books</p>
        </section>

        <div style={{ display: 'flex', gap: '4px', marginBottom: '32px', borderBottom: '1px solid #ebe5da', paddingBottom: '0' }}>
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: activeTab === tab.value ? 600 : 400,
                color: activeTab === tab.value ? '#2c2418' : '#a08c6e',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.value ? '2px solid #5b7a5e' : '2px solid transparent',
                cursor: 'pointer',
                marginBottom: '-1px',
              }}
            >
              {tab.label}
              <span style={{ marginLeft: '6px', fontSize: '12px', color: '#b5a78d' }}>{counts[tab.value]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <section style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: '#a08c6e', marginBottom: '20px' }}>
              {activeTab === 'all' ? "You haven't added any books yet." : 'No books in this shelf.'}
            </p>
            <button
              onClick={() => router.push('/search')}
              style={{
                padding: '10px 24px',
                backgroundColor: '#5b7a5e',
                color: '#faf6f0',
                border: 'none',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Search for books
            </button>
          </section>
        )}

        {filtered.length > 0 && (
          <section>
            {filtered.map((ub, index) => {
              const statusStyle = getStatusColor(ub.status)

              return (
                <div
                  key={ub.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    padding: '16px 0',
                    borderBottom: index < filtered.length - 1 ? '1px solid #ebe5da' : 'none',
                    alignItems: 'flex-start',
                  }}
                >
                  {ub.books.primary_cover_url ? (
                    <img
                      src={ub.books.primary_cover_url}
                      alt={ub.books.title}
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
                    <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#2c2418', lineHeight: 1.3 }}>{ub.books.title}</h2>
                    <p style={{ fontSize: '14px', color: '#8a7d6b', marginTop: '2px' }}>
                      {ub.books.author_name}
                      {ub.books.first_published_year && ` · ${ub.books.first_published_year}`}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      {ub.rating && (
                        <span style={{ fontSize: '13px', color: '#c47d2a' }}>
                          {'★'.repeat(Math.floor(ub.rating))}{ub.rating % 1 !== 0 ? '½' : ''}
                        </span>
                      )}
                      {ub.status === 'reading' && ub.current_page && ub.books.page_count && (
                        <span style={{ fontSize: '12px', color: '#a09585' }}>
                          Page {ub.current_page} of {ub.books.page_count}
                        </span>
                      )}
                      {ub.status === 'dnf' && ub.dnf_percent && (
                        <span style={{ fontSize: '12px', color: '#a09585' }}>
                          Stopped at {ub.dnf_percent}%
                        </span>
                      )}
                    </div>
                  </div>

                  <span style={{
                    padding: '4px 10px',
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.text,
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '6px',
                    flexShrink: 0,
                  }}>
                    {getStatusLabel(ub.status)}
                  </span>
                </div>
              )
            })}
          </section>
        )}

        <footer style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #ebe5da' }}>
          <p style={{ color: '#c5b9a8', fontSize: '12px', textAlign: 'center' }}>bookshelf</p>
        </footer>
      </div>
    </div>
  )
}