import { createSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { userBookId, notes } = await request.json()

  if (!userBookId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('user_books')
      .update({ notes, updated_at: new Date().toISOString() })
      .eq('id', userBookId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save notes' }, { status: 500 })
  }
}