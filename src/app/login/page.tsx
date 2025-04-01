"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Send login request
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Successful login
        router.push('/dashboard');
      } else {
        // Failed login
        setError(data.error || 'Login failed');
        console.error('Login error:', data);
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login request error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const runDiagnostics = async () => {
    setError('');
    setLoading(true);
    setDebugInfo(null);
    
    try {
      const response = await fetch('/api/auth/diagnose');
      const data = await response.json();
      setDebugInfo(data);
      setShowDebugInfo(true);
    } catch (err) {
      setError('Failed to run diagnostics');
      console.error('Diagnostics error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Login to Your Account</h1>
        
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-blue-600 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            <button
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-blue-600 hover:underline"
            >
              {showDebugInfo ? 'Hide Debug Options' : 'Show Debug Options'}
            </button>
          </p>
        </div>
        
        {showDebugInfo && (
          <div className="mt-4">
            <div className="mb-4 rounded-md bg-gray-50 p-4 text-sm">
              <h3 className="font-bold">Test User Credentials:</h3>
              <p>Email: test@example.com</p>
              <p>Password: password123</p>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="flex-1 rounded-md bg-gray-800 py-2 text-sm text-white hover:bg-gray-900 disabled:bg-gray-500"
              >
                Run Diagnostics
              </button>
              
              <Link href="/api/auth/diagnose" target="_blank" className="flex-1">
                <button
                  type="button"
                  className="w-full rounded-md bg-green-600 py-2 text-sm text-white hover:bg-green-700"
                >
                  View Diagnostics
                </button>
              </Link>
            </div>
            
            {debugInfo && (
              <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm">
                <h3 className="font-bold mb-2">System Status:</h3>
                <p>Database: {debugInfo.database?.status || 'Unknown'}</p>
                <p>Auth System: {debugInfo.auth?.status || 'Unknown'}</p>
                <p>Environment: {debugInfo.environment}</p>
                
                {debugInfo.recommendations?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-bold">Recommendations:</h4>
                    <ul className="list-disc pl-5">
                      {debugInfo.recommendations.map((rec: any, i: number) => (
                        <li key={i}>{rec.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {debugInfo.fixes?.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-bold">Applied Fixes:</h4>
                    <ul className="list-disc pl-5">
                      {debugInfo.fixes.map((fix: any, i: number) => (
                        <li key={i}>{fix.action}: {fix.details}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 