import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { BackToTop } from "./components/BackToTop";
import { Chat } from "./components/Chat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shen Haoming - Software Developer",
  description: "Portfolio and guestbook of Shen Haoming, a software developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2XMBBZJPF4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2XMBBZJPF4');
          `}
        </Script>

        <ThemeProvider
          defaultTheme="system"
          storageKey="portfolio-theme"
        >
          <Navbar/>
          {children}
          <Footer />
          <BackToTop />
          <Chat />
        </ThemeProvider>
      </body>
    </html>
  );
}
