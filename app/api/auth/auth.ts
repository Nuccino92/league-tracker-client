import { authRequest, loginRequest } from '@/app/lib/requests/auth';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signOut } from 'next-auth/react';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
  updated_at?: any;
  iat: number;
  exp: number;
  jti: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password, token } = credentials as {
          email: string;
          password: string;
          token?: string;
        };

        if (token) {
          const response = await authRequest(token);
          const result = await response.json();

          if (response.ok && result.data) {
            result.token = token;
            return result as any;
          }
        } else {
          const response = await loginRequest({ email, password });

          if (!response.ok) {
            if (response.status === 422) {
              return Promise.reject(new Error('Invalid email or password'));
            }
            return Promise.reject(new Error('Failed to log in'));
          }

          const result = await response.json();

          if (response.ok && result) {
            result.user.token = result.token;

            return result.user;
          }
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const sessionData = token.user as {
        id: string;
        name: string;
        email: string;
        email_verified_at: string | null;
        token: string;
        trial_ends_at: string;
      };

      const response = await authRequest(sessionData.token);

      if (!response.ok) {
        await signOut();
      }
      const result = await response.json();

      if (response.ok && result) {
        sessionData.id = result.id as any;
        sessionData.name = result.name as any;
        sessionData.email = result.email as any;
        sessionData.email_verified_at = result.email_verified_at as any;
        sessionData.trial_ends_at = result.trial_ends_at as any;
      }

      session.user = sessionData as any;

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    // async redirect({ url, baseUrl }) {
    //   return url.startsWith(baseUrl) ? url : baseUrl;
    // },
  },
};
