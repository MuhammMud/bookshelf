import { createSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { title, author, openLibraryKey, coverUrl, pageCount, firstPublishYear, status } = body

  if (!title || !author || !openLibraryKey || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Check if book already exists in our database
    let { data: existingBook } = await supabase
      .from('books')
      .select('id')
      .eq('open_library_key', openLibraryKey)
      .single()

    let bookId: string

    if (existingBook) {
      bookId = existingBook.id
    } else {
      // Create the book
      const { data: newBook, error: bookError } = await supabase
        .from('books')
        .insert({
          title,
          author_name: author,
          open_library_key: openLibraryKey,
          primary_cover_url: coverUrl,
          page_count: pageCount,
          first_published_year: firstPublishYear,
        })
        .select('id')
        .single()

      if (bookError) throw bookError
      bookId = newBook.id
    }

    // Check if user already has this book
    const { data: existingUserBook } = await supabase
      .from('user_books')
      .select('id')
      .eq('user_id', user.id)
      .eq('book_id', bookId)
      .single()

    if (existingUserBook) {
      // Update the status
      const { error: updateError } = await supabase
        .from('user_books')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', existingUserBook.id)

      if (updateError) throw updateError
    } else {
      // Create new user-book relationship
      const { error: insertError } = await supabase
        .from('user_books')
        .insert({
          user_id: user.id,
          book_id: bookId,
          status,
        })

      if (insertError) throw insertError
    }

    return NextResponse.json({ success: true, bookId })
  } catch (error: any) {
    console.error('Shelve error:', error)
    return NextResponse.json({ error: error.message || 'Failed to shelve book' }, { status: 500 })
  }
}