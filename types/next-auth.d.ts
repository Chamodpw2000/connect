import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string;
      image: string;
      id: string;
      email: string;
      firstName: string;
      lastName?: string;
      image?: string;
      role: string;
      bio?: string;
      country?: string;
      birthday?: string;
      miniDescription?: string;
      createdAt?: Date;
    };



  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    image?: string;
    role: string;
    bio?: string;
    country?: string;
    birthday?: string;
    miniDescription?: string;
    createdAt?: Date;
  }
}
