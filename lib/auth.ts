// lib/auth.ts
import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import { NextRequest } from 'next/server';
import dbConnect from './mongoose';
import User from '@/models/user';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
  image?: string;
  bio?: string;
  country?: string;
  birthday?: string;
  miniDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Extract user data from request headers set by middleware
 * @param request - NextRequest object
 * @returns UserData object or null if user is not authenticated
 */
export function getUserFromRequest(request: NextRequest): UserData | null {
  const userDataHeader = request.headers.get('x-user-data');
  
  if (!userDataHeader) {
    return null;
  }

  try {
    return JSON.parse(userDataHeader) as UserData;
  } catch (error) {
    console.error('Failed to parse user data from headers:', error);
    return null;
  }
}

/**
 * Extract individual user fields from request headers
 * @param request - NextRequest object
 * @returns Object with individual user fields
 */
export function getUserFieldsFromRequest(request: NextRequest) {
  return {
    id: request.headers.get('x-user-id'),
    email: request.headers.get('x-user-email'),
    firstName: request.headers.get('x-user-first-name'),
    lastName: request.headers.get('x-user-last-name'),
    role: request.headers.get('x-user-role'),
    image: request.headers.get('x-user-image'),
    bio: request.headers.get('x-user-bio'),
    country: request.headers.get('x-user-country'),
    birthday: request.headers.get('x-user-birthday'),
    miniDescription: request.headers.get('x-user-mini-description'),
    createdAt: request.headers.get('x-user-created-at'),
    updatedAt: request.headers.get('x-user-updated-at'),
  };
}

/**
 * Check if user is authenticated based on request headers
 * @param request - NextRequest object
 * @returns boolean
 */
export function isAuthenticated(request: NextRequest): boolean {
  return request.headers.get('x-user-id') !== null;
}

/**
 * Check if user has a specific role
 * @param request - NextRequest object
 * @param role - Role to check for
 * @returns boolean
 */
export function hasRole(request: NextRequest, role: string): boolean {
  const userRole = request.headers.get('x-user-role');
  return userRole === role;
}




export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          image: user.image || '',
          role: user.role || 'user',
          birthday: user.birthdate || undefined,
          country: user.country || undefined,
          bio: user.bio || undefined,
          miniDescription: user.miniDescription || undefined
          

        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {


    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await dbConnect();

        console.log('Google user:', user);

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            email: user.email,
            firstName: user.name?.split(' ')[0] || '',
            lastName: user.name?.split(' ')[1] || '',
            image: user.image,
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        await dbConnect();
        token.id = user.id;
        token.email = user.email;
        
        const customUser = await User.findOne({ email: user.email });

        // Include all user details in the JWT token
        if (customUser) {
          token.firstName = customUser.firstName ?? '';
          token.lastName = customUser.lastName ?? '';
          token.image = customUser.image ?? '';
          token.role = customUser.role ?? 'user';
          token.birthday = customUser.birthdate ?? '';
          token.country = customUser.country ?? '';
          token.bio = customUser.bio ?? '';
          token.miniDescription = customUser.miniDescription ?? '';
          token.createdAt = customUser.createdAt ?? '';
          token.updatedAt = customUser.updatedAt ?? '';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.image = token.image as string;
        session.user.role = token.role as string;
        session.user.birthday = token.birthday as string;
        session.user.country = token.country as string;
        session.user.bio = token.bio as string;
        session.user.miniDescription = token.miniDescription as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
