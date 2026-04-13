import { createSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { userBookId, rating } = await request.json()

  if (!userBookId || rating === undefined) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (rating !== null && (rating < 0.5 || rating > 5 || (rating * 2) % 1 !== 0)) {
    return NextResponse.json({ error: 'Rating must be in half-star increments from 0.5 to 5' }, { status: 400 })
  }

  try {
    const { error } = await supabase
      .from('user_books')
      .update({ rating, updated_at: new Date().toISOString() })
      .eq('id', userBookId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save rating' }, { status: 500 })
  }
}