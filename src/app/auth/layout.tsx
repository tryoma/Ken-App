'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../../../firebase';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isStatus, setIsStatus] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user && user.emailVerified) {
        router.push('/private/general/dashboard');
      }
      setIsStatus(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return isStatus && <section>{children}</section>;
}
