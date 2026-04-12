import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: userBooks } = await supabase
    .from('user_books')
    .select('status')
    .eq('user_id', user.id)

  const counts = {
    total: userBooks?.length || 0,
    reading: userBooks?.filter((b) => b.status === 'reading').length || 0,
    read: userBooks?.filter((b) => b.status === 'read').length || 0,
    want: userBooks?.filter((b) => b.status === 'want_to_read').length || 0,
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Bookshelf</h1>
            <p className="text-gray-400 text-sm">Welcome back, {profile?.display_name || profile?.username || 'reader'}</p>
          </div>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="text-gray-400 hover:text-white text-sm">Sign Out</button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold">{counts.reading}</p>
            <p className="text-gray-400 text-sm">Reading</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold">{counts.read}</p>
            <p className="text-gray-400 text-sm">Read</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 text-center">
            <p className="text-2xl font-bold">{counts.want}</p>
            <p className="text-gray-400 text-sm">Want to Read</p>
          </div>
        </div>

        <div className="space-y-3">
          <a href="/search" className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
            <span className="font-medium">Search Books</span>
            <span className="text-gray-400">→</span>
          </a>
          <a href="/my-books" className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
            <span className="font-medium">My Books</span>
            <span className="text-gray-400 text-sm">{counts.total} books →</span>
          </a>
        </div>
      </div>
    </div>
  )
}