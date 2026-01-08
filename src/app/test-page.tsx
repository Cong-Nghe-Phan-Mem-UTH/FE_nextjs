export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test Page - App is Running!</h1>
      <p>If you can see this, the app is working.</p>
      <h2>Environment Variables:</h2>
      <ul>
        <li>NEXT_PUBLIC_API_ENDPOINT: {process.env.NEXT_PUBLIC_API_ENDPOINT || 'NOT SET'}</li>
        <li>NEXT_PUBLIC_URL: {process.env.NEXT_PUBLIC_URL || 'NOT SET'}</li>
      </ul>
    </div>
  )
}

