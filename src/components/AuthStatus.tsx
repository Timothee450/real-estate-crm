"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthStatusProps = {
  onError?: () => void;
};

export default function AuthStatus({ onError }: AuthStatusProps) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token cookie
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
          if (onError) onError();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setStatus('unauthenticated');
        if (onError) onError();
      }
    };

    checkAuth();
  }, [onError, router]);

  return null;
} 