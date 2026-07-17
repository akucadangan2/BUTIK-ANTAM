import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from '@/hooks/useCart'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Butik Antam",
  description: "Jual Beli Emas dan Perak Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" style={{ minHeight: '100vh' }}>
        <CartProvider>
          <Navbar />
          <div style={{ flex: 1 }}>{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}