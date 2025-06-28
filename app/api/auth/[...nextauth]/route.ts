// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import dbConnect from '@/lib/mongoose';
import User from '@/models/user';
import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
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

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
                const customUser = await User.findOne({ email: user.email });

        // Use type assertion to access custom fields
        if (customUser) {
          token.firstName = customUser.firstName || '';
          token.lastName = customUser.lastName || '';
          token.image = customUser.image || '';
          token.role = customUser.role || 'user';
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
        
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

