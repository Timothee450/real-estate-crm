export default function DashboardPage() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard</h1>
      
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        marginBottom: '30px' 
      }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
          Success! You have successfully accessed the dashboard.
        </p>
        <p>This is a stripped down version of the dashboard for testing purposes.</p>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e8f4f8', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>Clients</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
          <p>Active Clients</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#e8f8ea', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>Properties</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
          <p>Listed Properties</p>
        </div>
        
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f0e8', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginTop: 0 }}>Tasks</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>0</p>
          <p>Pending Tasks</p>
        </div>
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
          href="/static" 
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Static Page
        </a>
      </div>
    </div>
  );
} 