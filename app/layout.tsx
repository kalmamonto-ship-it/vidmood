import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'VidMood - Mood-Based Video Feed',
  description: 'TikTok clone for mood-based video recommendations',
  manifest: '/manifest.json',
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        {/* Essential META tags for PWA */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="VidMood" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        
        {/* Additional tags for Android compatibility */}
        <meta name="application-name" content="VidMood" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-TileImage" content="/icon-192x192.png" />
        
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                  })
                  .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                  });
              });
            }
          `
        }} />
      </head>
      <body className="min-h-screen bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}