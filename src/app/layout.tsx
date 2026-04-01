import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { getSiteConfig } from "@/lib/data";
import { LayoutShell } from "@/components/layout/LayoutShell";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
});

const siteConfig = getSiteConfig();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  title: {
    default: siteConfig.seo.defaultTitle,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.seo.defaultDescription,
  keywords: siteConfig.seo.keywords,
  openGraph: {
    type: "website",
    siteName: siteConfig.siteName,
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.seo.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${dmSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <LayoutShell>{children}</LayoutShell>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1f1f1f",
              color: "#fff",
              borderRadius: "10px",
            },
          }}
        />
      </body>
    </html>
  );
}
