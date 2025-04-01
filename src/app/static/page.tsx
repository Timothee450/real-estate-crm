export default function StaticPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Real Estate CRM - Static Page</h1>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '15px' }}>⚠️ Emergency Login Solution</h2>
        <p style={{ marginBottom: '15px' }}>
          If you're having trouble with API routes or database connectivity, use our direct login option:
        </p>
        <a 
          href="/direct-login" 
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#4caf50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Go to Direct Login
        </a>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          This login bypasses the database and API routes completely. Use admin@example.com / admin123
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>Other Options</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <a 
            href="/minimal" 
            style={{
              display: 'block',
              padding: '15px',
              backgroundColor: '#2196f3',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            Minimal Diagnostic Page
          </a>
          <a 
            href="/api/status" 
            style={{
              display: 'block',
              padding: '15px',
              backgroundColor: '#ff9800',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            Check API Status
          </a>
        </div>
      </div>

      <div style={{
        padding: '15px',
        backgroundColor: '#e1f5fe',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Troubleshooting Steps</h3>
        <ol style={{ paddingLeft: '20px', margin: 0 }}>
          <li style={{ marginBottom: '8px' }}>Check if API routes are working by visiting <strong>/api/status</strong></li>
          <li style={{ marginBottom: '8px' }}>Try the direct login which uses no API or database</li>
          <li style={{ marginBottom: '8px' }}>Check Vercel logs for build errors</li>
          <li style={{ marginBottom: '8px' }}>Verify environment variables are correctly set</li>
        </ol>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a 
          href="/" 
          style={{
            color: '#1976d2',
            textDecoration: 'none'
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
} 