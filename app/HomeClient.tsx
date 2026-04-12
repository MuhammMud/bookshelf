'use client'

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
  current_page: number | null
  updated_at: string
  books: Book
}

interface Profile {
  username: string
  display_name: string | null
  avatar_url: string | null
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<span key={i} className="text-amber-400">★</span>)
    } else if (i - 0.5 <= rating) {
      stars.push(<span key={i} className="text-amber-400">★</span>)
    } else {
      stars.push(<span key={i} className="text-amber-900/40">★</span>)
    }
  }
  return <span className="text-sm tracking-wide">{stars}</span>
}

export default function HomeClient({ profile, userBooks }: { profile: Profile | null, userBooks: UserBook[] }) {
  const router = useRouter()

  const reading = userBooks.filter((ub) => ub.status === 'reading')
  const read = userBooks.filter((ub) => ub.status === 'read')
  const wantToRead = userBooks.filter((ub) => ub.status === 'want_to_read')
  const recentlyUpdated = userBooks.slice(0, 6)

  const counts = {
    total: userBooks.length,
    reading: reading.length,
    read: read.length,
    want: wantToRead.length,
    dnf: userBooks.filter((ub) => ub.status === 'dnf').length,
  }

  return (
    <div className="min-h-screen bg-[#0a0908] text-[#e8e0d4]">
      <div className="fixed inset-0 bg-gradient-to-br from-amber-950/20 via-transparent to-orange-950/10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-5 py-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <p className="text-amber-600/80 text-sm font-medium tracking-widest uppercase mb-1">
              {getGreeting()}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#f5efe7]">
              {profile?.display_name || profile?.username || 'Reader'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/search')}
              className="px-4 py-2.5 bg-amber-600/90 text-[#0a0908] text-sm font-semibold rounded-xl hover:bg-amber-500 transition-all duration-200"
            >
              + Find a Book
            </button>
            <form action="/auth/signout" method="POST">
              <button type="submit" className="text-[#e8e0d4]/40 hover:text-[#e8e0d4]/80 text-sm transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-3 mb-12">
          {[
            { label: 'Reading', count: counts.reading, color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400' },
            { label: 'Read', count: counts.read, color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
            { label: 'Want to Read', count: counts.want, color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400' },
            { label: 'DNF', count: counts.dnf, color: 'from-red-500/20 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400/70' },
          ].map((stat) => (
            <button
              key={stat.label}
              onClick={() => router.push('/my-books')}
              className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} p-5 text-left hover:scale-[1.02] transition-all duration-200`}
            >
              <p className={`text-3xl font-bold ${stat.text}`}>{stat.count}</p>
              <p className="text-[#e8e0d4]/50 text-sm mt-1">{stat.label}</p>
            </button>
          ))}
        </div>

        {reading.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#f5efe7] tracking-tight">
                Currently Reading
              </h2>
              <button
                onClick={() => router.push('/my-books')}
                className="text-amber-600/70 text-sm hover:text-amber-500 transition-colors"
              >
                View all →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reading.slice(0, 4).map((ub) => {
                const progress = ub.current_page && ub.books.page_count
                  ? Math.round((ub.current_page / ub.books.page_count) * 100)
                  : null

                return (
                  <div
                    key={ub.id}
                    className="flex gap-4 p-4 rounded-2xl bg-[#1a1714] border border-[#2a2520] hover:border-amber-900/40 transition-all duration-200"
                  >
                    {ub.books.primary_cover_url ? (
                      <img
                        src={ub.books.primary_cover_url}
                        alt={ub.books.title}
                        className="w-16 h-24 object-cover rounded-lg shadow-lg shadow-black/40 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-[#2a2520] rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-[#e8e0d4]/20 text-xs text-center">No Cover</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#f5efe7] truncate">{ub.books.title}</h3>
                      <p className="text-[#e8e0d4]/40 text-sm">{ub.books.author_name}</p>
                      {progress !== null && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-[#e8e0d4]/30 mb-1">
                            <span>Page {ub.current_page}</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#2a2520] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {recentlyUpdated.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#f5efe7] tracking-tight">
                Recently Added
              </h2>
              <button
                onClick={() => router.push('/my-books')}
                className="text-amber-600/70 text-sm hover:text-amber-500 transition-colors"
              >
                View library →
              </button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {recentlyUpdated.map((ub) => (
                <div key={ub.id} className="group cursor-pointer">
                  {ub.books.primary_cover_url ? (
                    <div className="relative">
                      <img
                        src={ub.books.primary_cover_url}
                        alt={ub.books.title}
                        className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg shadow-black/30 group-hover:shadow-amber-900/20 group-hover:scale-[1.03] transition-all duration-200"
                      />
                      {ub.rating && (
                        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
                          <StarRating rating={ub.rating} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full aspect-[2/3] bg-[#1a1714] rounded-xl border border-[#2a2520] flex items-center justify-center">
                      <span className="text-[#e8e0d4]/15 text-xs text-center px-2">{ub.books.title}</span>
                    </div>
                  )}
                  <p className="text-sm font-medium text-[#f5efe7] mt-2 truncate">{ub.books.title}</p>
                  <p className="text-xs text-[#e8e0d4]/35 truncate">{ub.books.author_name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {userBooks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-[#f5efe7] mb-3">Your shelf is empty</h2>
            <p className="text-[#e8e0d4]/40 mb-8 max-w-md mx-auto">
              Start building your library by searching for books you love, want to read, or are currently reading.
            </p>
            <button
              onClick={() => router.push('/search')}
              className="px-8 py-3 bg-amber-600/90 text-[#0a0908] font-semibold rounded-xl hover:bg-amber-500 transition-all duration-200"
            >
              Find your first book
            </button>
          </div>
        )}

        {userBooks.length > 0 && (
          <section>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push('/search')}
                className="p-5 rounded-2xl bg-[#1a1714] border border-[#2a2520] hover:border-amber-900/40 text-left transition-all duration-200"
              >
                <span className="text-2xl mb-2 block">🔍</span>
                <span className="font-medium text-[#f5efe7]">Search Books</span>
                <p className="text-[#e8e0d4]/30 text-sm mt-1">Find your next read</p>
              </button>
              <button
                onClick={() => router.push('/my-books')}
                className="p-5 rounded-2xl bg-[#1a1714] border border-[#2a2520] hover:border-amber-900/40 text-left transition-all duration-200"
              >
                <span className="text-2xl mb-2 block">📖</span>
                <span className="font-medium text-[#f5efe7]">My Library</span>
                <p className="text-[#e8e0d4]/30 text-sm mt-1">{counts.total} books shelved</p>
              </button>
            </div>
          </section>
        )}

        <footer className="mt-16 pt-8 border-t border-[#1a1714] text-center">
          <p className="text-[#e8e0d4]/15 text-xs">Bookshelf — Track your reading journey</p>
        </footer>
      </div>
    </div>
  )
}