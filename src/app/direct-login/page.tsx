'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DirectLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Hardcoded admin credentials - this will 100% work since we're not using any DB
  const ADMIN_EMAIL = 'admin@example.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    setLoading(true);
    setError('');
    
    // Direct comparison with hardcoded credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a cookie directly from the client
      document.cookie = `token=${btoa(`admin:${Date.now()}`)};path=/;max-age=${60*60*24*7}`;
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Use admin@example.com / admin123');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '500px', 
      margin: '40px auto', 
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      backgroundColor: 'white'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Direct Login</h1>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '10px', 
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <p style={{ margin: '0', fontWeight: 'bold' }}>Hardcoded Credentials:</p>
        <p style={{ margin: '5px 0 0' }}>Email: admin@example.com</p>
        <p style={{ margin: '5px 0 0' }}>Password: admin123</p>
      </div>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input 
            type="email" 
            name="email"
            defaultValue="admin@example.com"
            style={{ 
              width: '100%', 
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
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
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '10px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a 
          href="/"
          style={{ color: '#1976d2', textDecoration: 'none' }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
} 