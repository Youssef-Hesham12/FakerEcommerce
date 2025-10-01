import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components';
import { Toaster } from 'react-hot-toast';
import ProviderContainer from '@/components/layout/ProviderContainer';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FAKHR',
  description: 'eCommerce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProviderContainer>
          {/* <NavbarDemo /> */}
          <Navbar />
          <div className="mt-16">{children}</div>
          <Toaster />
          {/* <Footer /> */}
        </ProviderContainer>
      </body>
    </html>
  );
}
