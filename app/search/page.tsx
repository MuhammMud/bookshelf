import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SearchClient from './SearchClient'

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
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

  const name = profile?.display_name || profile?.username || 'Reader'
  const params = await searchParams
  const initialQuery = params.q || ''

  return <SearchClient name={name} initialQuery={initialQuery} />
}