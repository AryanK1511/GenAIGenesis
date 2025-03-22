// frontend/src/app/layout.tsx

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Voyager',
  description: 'A personalized AI chatbot designed to know everything about Aryan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-dark-background">{children}</body>
    </html>
  );
}
