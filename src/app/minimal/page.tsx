export default function MinimalPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Minimal Authentication Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ffd700', backgroundColor: '#fff9e6' }}>
        <p style={{ marginBottom: '10px' }}><strong>Follow these steps in order:</strong></p>
        <ol style={{ marginLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}>
            <a href="/api/minimal-test" style={{ color: 'blue', textDecoration: 'underline' }}>
              Test Database Connection
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/api/create-admin" style={{ color: 'blue', textDecoration: 'underline' }}>
              Create Admin User
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="/simple-login" style={{ color: 'blue', textDecoration: 'underline' }}>
              Go to Simple Login Page
            </a>
            {' '}(use admin@example.com / admin123)
          </li>
        </ol>
      </div>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Troubleshooting</h2>
        <p style={{ marginBottom: '10px' }}>If you're seeing 404 errors:</p>
        <ul style={{ marginLeft: '20px' }}>
          <li>Make sure you've deployed the latest code</li>
          <li>Check Vercel logs for build errors</li>
          <li>Verify DATABASE_URL is set in environment variables</li>
        </ul>
      </div>
      
      <div>
        <a href="/" style={{ color: 'blue', textDecoration: 'underline', marginRight: '20px' }}>Home</a>
        <a href="/dashboard" style={{ color: 'blue', textDecoration: 'underline' }}>Dashboard</a>
      </div>
    </div>
  );
} 