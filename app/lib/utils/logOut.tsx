'use client';

import { signOut } from 'next-auth/react';
import { logoutRequest } from '../requests/auth';

export default async function logOut(token: string | null) {
  if (!token) return;

  try {
    const response = await logoutRequest(token);

    const result = await response.json();

    if (response.ok) {
      await signOut();
    }

    if (!response.ok) {
      console.log('Logout request error:', result?.message);
    }
  } catch (error) {
    console.error('Error loggin out:', error);
  }
}
