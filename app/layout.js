import './globals.css';
import DecryptLoader           from '@/components/DecryptLoader';
import KonamiCode              from '@/components/KonamiCode';
import CursorTrail             from '@/components/CursorTrail';
import PageTransition          from '@/components/PageTransition';
import { TerminalProvider }    from '@/components/TerminalContext';

export const metadata = {
  title:       'Elliot Singer — IT Engineer & Self-Hoster',
  description: 'Portfolio, blog and homelab docs for Elliot Singer.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TerminalProvider>
          <DecryptLoader />
          <PageTransition>
            {children}
          </PageTransition>
          <KonamiCode />
          <CursorTrail />
        </TerminalProvider>
      </body>
    </html>
  );
}