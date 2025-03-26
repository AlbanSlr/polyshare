'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/lib/useUser';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user?.isLoggedIn) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
}