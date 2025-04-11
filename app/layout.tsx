import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/navbar';

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
    <html lang="en">
      <body className={`${figtree.className} antialiased`}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
