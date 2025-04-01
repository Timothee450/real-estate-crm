export default function HtmlLoginPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '40px auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>HTML-Only Login</h1>
      
      {/* This is an HTML-only form without any JavaScript */}
      <form 
        action="/dashboard" 
        method="get" 
        style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e3f2fd', 
          marginBottom: '20px',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>HTML-Only Login</p>
          <p style={{ margin: '5px 0 0' }}>This form will redirect to dashboard without any authentication.</p>
          <p style={{ margin: '5px 0 0' }}>Use when nothing else works.</p>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input 
            type="email" 
            name="email" 
            defaultValue="admin@example.com"
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input 
            type="password" 
            name="password"
            defaultValue="admin123"
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <button 
          type="submit"
          style={{ 
            width: '100%',
            padding: '10px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Log In (Direct to Dashboard)
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a 
          href="/static"
          style={{ 
            color: '#1976d2', 
            textDecoration: 'none', 
            marginRight: '20px' 
          }}
        >
          Back to Static Page
        </a>
        
        <a 
          href="/"
          style={{ color: '#1976d2', textDecoration: 'none' }}
        >
          Home
        </a>
      </div>
    </div>
  );
} 