// app/layout

import { Inter } from "next/font/google";
import {
  BASE_URL,
  SEO_TITLE,
  SEO_DESCRIPTION
} from "@/constants";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'sans-serif']
});

export const metadata = {
  title: {
    template: `%s | Formoteka`,
    default: SEO_TITLE,
  },
  description: SEO_DESCRIPTION,

  openGraph: {
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    url: BASE_URL,
    siteName: "Formoteka",
    images: [
      {
        url: "/social.jpg",
        width: 1200,
        height: 630,
        alt: "Formoteka — онлайн форма замовлення",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ["/social.jpg"],
  }
}

export default function RootLayout({ children, modal }) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} antialiased`}>
        {children}
        {modal}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
