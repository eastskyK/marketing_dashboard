import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Global Marketing AI Dashboard - Final View',
  description: 'Analyzing the patterns and trends of marketing traffic'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className={`${inter.className} bg-bg-main text-text-main antialiased min-h-screen relative pb-20`}>
        {children}
      </body>
    </html>
  );
}
