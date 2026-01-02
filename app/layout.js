// app/layout

import { DM_Sans } from "next/font/google";
import {
  BASE_URL,
  SEO_TITLE,
  SEO_DESCRIPTION
} from "@/constants";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-dm-sans",
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
      <body className={`${dmSans.variable} antialiased`}>
        {children}
        {modal}
      </body>
    </html>
  );
}
