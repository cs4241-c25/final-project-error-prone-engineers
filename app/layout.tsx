import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, Girassol, Cinzel_Decorative } from "next/font/google";
import "./globals.css";
import ClientSessionWrapper from "./clientsessionwrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const garamond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-garamond',
});

const girassol = Girassol({
  variable: "--font-girassol",
  subsets: ["latin"],
  weight: '400',
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: '700',
});

export const metadata: Metadata = {
    title: "Freedoom Trail App",
    description: "Freedom Trail Guide",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <head>
            <title>{metadata.title?.toString() ?? "Default Title"}</title>
            <meta name="description" content={metadata.description?.toString() ?? "Default Description"}/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${garamond.variable} ${geistMono.variable} ${girassol.variable} ${cinzelDecorative.variable} antialiased`}
        >
        <ClientSessionWrapper>{children}</ClientSessionWrapper>
        </body>
        </html>
    );
}