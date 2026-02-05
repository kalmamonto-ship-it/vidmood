import './globals.css';
import type { ReactNode } from 'react';
export const metadata = {
  title: 'VidMood - Mood-Based Video Feed',
  description: 'TikTok clone for mood-based video recommendations',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}