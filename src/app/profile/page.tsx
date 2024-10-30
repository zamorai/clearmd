// app/profile/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const currentSession = supabase.auth.session();
    setSession(currentSession);

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    if (!currentSession) {
      router.push('/signin');
    }
  }, []);

  // Fetch user's submissions and display them

  return (
    <div>
      {/* User's profile and submissions */}
    </div>
  );
}
