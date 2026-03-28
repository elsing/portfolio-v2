import './globals.css';

export const metadata = {
  title:       "Elliot Singer — IT Engineer & Self-Hoster",
  description: "Portfolio, blog and homelab docs for Elliot Singer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
