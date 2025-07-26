// app/api/auth/[...nextauth]/route.ts

import dbConnect from '@/lib/mongoose';
import User from '@/models/user';
import { compare } from 'bcrypt';
import { error } from 'console';
import jwt from 'jsonwebtoken';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
          throw new Error('userNotFound');
          
        }

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error('InvalidPassword');
        }
        if (!process.env.ACCESS_TOKEN_SECRET) {
          throw new Error('ACCESS_TOKEN_SECRET is not defined');
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });
    
        
        if (!process.env.REFRESH_TOKEN_SECRET) {
          throw new Error('REFRESH_TOKEN_SECRET is not defined');
        }
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
  
        // Set refresh token in HTTP-only cookie
        (await cookies()).set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7 days
        });
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
          miniDescription: user.miniDescription || undefined,
          createdAt: user.createdAt || undefined,
          accessToken: accessToken,
          refreshToken: refreshToken


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


    async jwt({ token, user, account }) {


      if (account?.provider === 'credentials') {

        if (user?.accessToken) {
          token.accessToken = user.accessToken;
        }

        if (user?.refreshToken) {
          token.refreshToken = user.refreshToken;
        }

      }

      if (account?.provider === 'google') {
        if (account?.access_token) {
          token.accessToken = account.access_token;
        }
        if (account?.refresh_token) {
          token.refreshToken = account.refresh_token;
        }
        if (account?.expires_at) {
          token.accessTokenExpires = account.expires_at * 1000; // convert to ms
        }
      }




      if (user) {
        await dbConnect();
        token.id = user.id;
        token.email = user.email;

        // const customUser = await User.findOne({ email: user.email });

        // Include all user details in the JWT token
  
          token.firstName = user.firstName ?? '';
          token.lastName = user.lastName ?? '';
          token.image = user.image ?? '';
          token.role = user.role ?? 'user';
          token.birthday = user.birthday ?? '';
          token.country = user.country ?? '';
          token.bio = user.bio ?? '';
          token.miniDescription = user.miniDescription ?? '';
          token.createdAt = user.createdAt ?? '';



 

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
        session.user.createdAt = token.createdAt as Date;
        session.user.accessToken = token.accessToken as string;

      
      }
   
      return session;
    },
  },
  secret:process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

