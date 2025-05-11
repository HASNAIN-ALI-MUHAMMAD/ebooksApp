import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionContext } from "next-auth/react";
import SessionProviderWrapper from "./(componets)/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Personal eBook Collection",
  description: "A personal project for my ebook collection.Contains 100s of books and a pdf and a epub reader as well.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProviderWrapper>
            {children}
        </SessionProviderWrapper>
      </body>
    </html>

  );
}
