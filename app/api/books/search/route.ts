import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,number_of_pages_median,subject,isbn`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) {
      throw new Error('Open Library API error')
    }

    const data = await response.json()

    const results = data.docs.map((book: any) => ({
      openLibraryKey: book.key?.replace('/works/', ''),
      title: book.title,
      author: book.author_name?.[0] || 'Unknown Author',
      authors: book.author_name || [],
      firstPublishYear: book.first_publish_year,
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      pageCount: book.number_of_pages_median,
      subjects: book.subject?.slice(0, 5) || [],
      isbn: book.isbn?.[0] || null,
    }))

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 })
  }
}