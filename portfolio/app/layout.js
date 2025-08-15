import { Lora } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Elliot Singer's Portfolio",
  description: "Elliot Singer's Portfolio",
};

const lora = Lora({
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lora.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

