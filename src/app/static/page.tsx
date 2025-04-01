export default function StaticPage() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Static Page</h1>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        marginBottom: '30px' 
      }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Success! This is a simple static page.
        </p>
        <p>If you can see this page but not others, it suggests that there might be issues with dynamic routes or server components.</p>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '8px',
        marginBottom: '30px' 
      }}>
        <h3 style={{ marginTop: 0 }}>Troubleshooting Next.js on Vercel</h3>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Check your Vercel deployment logs</li>
          <li style={{ marginBottom: '8px' }}>Verify environment variables are correctly set</li>
          <li style={{ marginBottom: '8px' }}>Consider simplifying your codebase if needed</li>
          <li style={{ marginBottom: '8px' }}>If using database connections, ensure they're correctly configured</li>
        </ul>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <a 
          href="/" 
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Back to Home
        </a>
        <a 
          href="/api/hello" 
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Test API
        </a>
      </div>
    </div>
  );
} 