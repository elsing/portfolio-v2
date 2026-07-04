import './globals.css';
import Script                  from 'next/script';
import ClickTracker            from '@/components/ClickTracker';
import DecryptLoader           from '@/components/DecryptLoader';
import KonamiCode              from '@/components/KonamiCode';
import PageTransition          from '@/components/PageTransition';
import { TerminalProvider }    from '@/components/TerminalContext';

export const metadata = {
  title:       'Elliot Singer — IT Engineer & Self-Hosting Enthusiast',
  description: 'Portfolio, blog and homelab docs for Elliot Singer.',
};

const ANALYTICS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' &&
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL &&
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {ANALYTICS_ENABLED && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <TerminalProvider>
          <ClickTracker />
          <DecryptLoader />
          <PageTransition>
            {children}
          </PageTransition>
          <KonamiCode />
        </TerminalProvider>
      </body>
    </html>
  );
}