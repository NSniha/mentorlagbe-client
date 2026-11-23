import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

import { Providers } from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'MentorLagbe — Find your mentor. Unlock your potential.',
    template: '%s | MentorLagbe',
  },
  description:
    'Explore personalized tuition and mentorship in Bangladesh. Find approved tutors, apply online, and grow with guidance that fits your goals.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'MentorLagbe',
    description: 'Your next learning breakthrough begins here.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Fraunces:opsz,wght,SOFT,WONK@9..144,400,20,1;9..144,500,20,1&display=swap"
        />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}