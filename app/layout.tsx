import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/navbar';
import Footer from '@/components/footer';

const figtree = Figtree({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.className}>
      <body className={`antialiased flex flex-col h-screen`}>
        <NavBar />
        <div className="flex flex-1 justify-center items-center">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
