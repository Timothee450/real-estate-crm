export default function HomePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Real Estate CRM</h1>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeeba',
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: '0 0 15px 0' }}>Welcome!</h2>
        <p>
          This is a simplified version of the application to ensure compatibility with Vercel.
          Please use one of the links below to access the application.
        </p>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <a 
          href="/dashboard" 
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Dashboard
        </a>
        
        <a 
          href="/direct-login" 
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Direct Login
        </a>
        
        <a 
          href="/login-html" 
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            textDecoration: 'none',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          HTML Login
        </a>
        
        <a 
          href="/static" 
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Static Page
        </a>
      </div>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Troubleshooting</h3>
        <p>
          If you're experiencing "page not found" errors, try:
        </p>
        <ul style={{ paddingLeft: '20px' }}>
          <li>Using the static HTML page at <a href="/index.html" style={{ color: '#007bff' }}>/index.html</a></li>
          <li>Checking if any of the above links work</li>
          <li>Verifying your Vercel deployment settings</li>
        </ul>
      </div>
    </div>
  );
}
