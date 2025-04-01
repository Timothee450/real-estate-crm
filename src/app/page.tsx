"use client";

import Link from "next/link";
import { useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState<{[key: string]: any} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const checkEndpoint = async (endpoint: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError(`Failed to check endpoint: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Real Estate CRM</h1>
        
        <div className="mb-6 bg-amber-100 border border-amber-400 rounded p-4">
          <h2 className="font-bold text-lg mb-2">Extreme Simplification Mode</h2>
          <p className="mb-4">Use these minimal tools to test authentication:</p>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Link href="/api/minimal-test" className="px-3 py-1 bg-blue-500 text-white rounded text-sm">
              Test Database
            </Link>
            <Link href="/api/create-admin" className="px-3 py-1 bg-green-500 text-white rounded text-sm">
              Create Admin
            </Link>
            <Link href="/simple-login" className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
              Simple Login
            </Link>
          </div>
          
          <div className="text-sm">
            <p><strong>Step 1:</strong> Visit "Test Database" to check connection</p>
            <p><strong>Step 2:</strong> Visit "Create Admin" to set up a user</p>
            <p><strong>Step 3:</strong> Go to "Simple Login" and use admin@example.com / admin123</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => checkEndpoint('/api/test')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={loading}
            >
              Test API Connection
            </button>
            
            <button
              onClick={() => checkEndpoint('/api/setup')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={loading}
            >
              Check System Setup
            </button>
            
            <button
              onClick={() => checkEndpoint('/api/auth/addtestuser')}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              disabled={loading}
            >
              Create Test User
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {loading && (
            <div className="mb-4 p-4 bg-gray-100 rounded-md">
              Loading...
            </div>
          )}
          
          {status && (
            <div className="mb-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-semibold mb-2">API Response:</h3>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-96">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/login" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-semibold mb-2">Login</h2>
              <p className="text-gray-600">Access your account</p>
            </div>
          </Link>
          
          <Link href="/dashboard" className="block">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
              <p className="text-gray-600">View your dashboard</p>
            </div>
          </Link>
        </div>
        
        <div className="mt-8 text-center text-gray-500">
          <p>
            Test User Credentials: <strong>test@example.com</strong> / <strong>password123</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
