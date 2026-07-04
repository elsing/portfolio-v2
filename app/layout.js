import './globals.css';
import Script                  from 'next/script';
import DecryptLoader           from '@/components/DecryptLoader';
import KonamiCode              from '@/components/KonamiCode';
import PageTransition          from '@/components/PageTransition';
import { TerminalProvider }    from '@/components/TerminalContext';

export const metadata = {
  title:       'Elliot Singer — IT Engineer & Self-Hosting Enthusiast',
  description: 'Portfolio, blog and homelab docs for Elliot Singer.',
};

// Umami's script + collect endpoint both live on the instance's base URL, so
// only the base needs declaring (script.js / recorder.js are derived).
const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL?.replace(/\/$/, '');

const ANALYTICS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true' &&
  UMAMI_URL &&
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

// Umami session replay + heatmaps (recorder.js) — on by default whenever
// analytics is on; set NEXT_PUBLIC_ENABLE_REPLAY=false to opt out (it's a
// heavier script than the tracker).
const REPLAY_ENABLED =
  ANALYTICS_ENABLED && process.env.NEXT_PUBLIC_ENABLE_REPLAY !== 'false';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {ANALYTICS_ENABLED && (
          <Script
            src={`${UMAMI_URL}/script.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            data-performance="true"
            strategy="afterInteractive"
          />
        )}
        {REPLAY_ENABLED && (
          <Script
            src={`${UMAMI_URL}/recorder.js`}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
        <TerminalProvider>
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
