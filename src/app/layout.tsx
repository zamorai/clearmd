// app/layout.tsx

import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from './NavBar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Medical Levels',
  description: 'Bringing transparency to medical salaries.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>

          <NavBar />
          <main className="container mx-auto px-4 max-w-6xl"> {children} </main>
          <Footer />
      </body>
    </html>
  );
}
