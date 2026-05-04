import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/tailwind.css';
import '../styles/global.css';

import { AuthProvider } from '@/context/AuthContext';
import { LangProvider } from '@/context/LangContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4CAF50',
};

export const metadata: Metadata = {
  title: 'RecipeCloud — Your Kitchen, Amplified',
  description:
    'Explore, share and connect with fellow food enthusiasts in a global community.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F1F8F4] dark:bg-[#121A14] transition-colors duration-300">
        <ThemeProvider>
          <LangProvider>
            <AuthProvider>{children}</AuthProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
