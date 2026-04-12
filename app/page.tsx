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

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bookshelf</h1>
        <p className="text-gray-400 mb-2">
          Welcome, {profile?.display_name || profile?.username || user.email}
        </p>
        <p className="text-gray-500 text-sm mb-8">
          @{profile?.username || 'setting up...'}
        </p>
        <form action="/auth/signout" method="POST">
          <button type="submit" className="px-6 py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-900">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}