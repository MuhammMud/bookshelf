import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('books').select('count')

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bookshelf</h1>
        <p className="text-gray-400">
          {error ? `Connection error: ${error.message}` : 'Connected to Supabase ✓'}
        </p>
      </div>
    </div>
  )
}