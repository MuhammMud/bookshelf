'use client'

import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()

  const supabase = createSupabaseBrowser()

  useEffect(() => {
    if (searchParams.get('message') === 'verify') {
      setMessage('Please check your email and click the confirmation link before signing in.')
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, display_name: username },
        },
      })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Check your email for a confirmation link!')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage(error.message)
      } else {
        window.location.href = '/'
      }
    }

    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf6f0', color: '#3d3529', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#2c2418', textAlign: 'center', marginBottom: '4px' }}>
          bookshelf
        </h1>
        <p style={{ fontSize: '15px', color: '#a08c6e', textAlign: 'center', marginBottom: '36px' }}>
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="username" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3d3529', marginBottom: '6px' }}>
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={30}
                pattern="^[a-zA-Z0-9_]+$"
                title="Letters, numbers, and underscores only"
                placeholder="Choose a username"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#f4efe6',
                  border: '1px solid #e8dfd2',
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: '#3d3529',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3d3529', marginBottom: '6px' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#f4efe6',
                border: '1px solid #e8dfd2',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#3d3529',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#3d3529', marginBottom: '6px' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#f4efe6',
                border: '1px solid #e8dfd2',
                borderRadius: '10px',
                fontSize: '15px',
                color: '#3d3529',
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#5b7a5e',
              color: '#faf6f0',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '14px',
            color: message.includes('Check your email') || message.includes('confirmation') ? '#5b7a5e' : '#b05050',
            lineHeight: 1.5,
          }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: '24px', textAlign: 'center', color: '#a08c6e', fontSize: '14px' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}
            style={{ background: 'none', border: 'none', color: '#5b7a5e', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}