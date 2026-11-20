'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ru">
      <body>
        <main style={{ fontFamily: 'system-ui, sans-serif', margin: '4rem auto', maxWidth: '32rem', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '1.25rem' }}>Please try again.</p>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  )
}
