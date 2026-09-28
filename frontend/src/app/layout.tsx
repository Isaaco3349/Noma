import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noma — Nigeria corridor payments",
  description:
    "Voice- and text-driven cross-border payment plans for diaspora senders to Nigeria, on Monad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        {children}
      </body>
    </html>
  );
}
