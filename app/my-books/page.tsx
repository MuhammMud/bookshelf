import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MyBooksClient from './MyBooksClient'

export default async function MyBooksPage() {
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
    .select(`
      id,
      status,
      rating,
      notes,
      date_started,
      date_finished,
      current_page,
      dnf_percent,
      dnf_reason,
      created_at,
      books (
        id,
        title,
        author_name,
        primary_cover_url,
        page_count,
        first_published_year
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const name = profile?.display_name || profile?.username || 'Reader'

  return <MyBooksClient userBooks={(userBooks || []) as any} name={name} />
}