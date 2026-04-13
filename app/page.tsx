import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import HomeClient from './HomeClient'

export default async function Home() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

 if (!user) {
    redirect('/login')
  }

  if (!user.email_confirmed_at) {
    redirect('/login?message=verify')
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
      current_page,
      updated_at,
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

  return <HomeClient profile={profile} userBooks={(userBooks || []) as any} />
}