import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Providers from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'My App',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}>
      <body className="antialiased overflow-x-hidden ">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
                <Providers>
        <Header />
        <div className='pt-[80px]'>
   {children}
        </div>

       
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
