'use client';

import { RegistrationFormType } from '@/lib/validations/auth';
import { IUser } from '@/models/user';
import { useSession } from 'next-auth/react';
async function fetchUserDetails(email: string): Promise<Partial<IUser> | null> {
  try {
    const response = await fetch(`/api/user/${email}`, {
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<Partial<IUser> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        const userData = await fetchUserDetails(session.user.email);
        console.log("Fetched user data:", userData);
        setUser(userData);
      } else {
        setUser(null);
      }
    };
    fetchData();
  }, [session?.user?.email]);

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isUnauthenticated: status === 'unauthenticated',
  };
};

