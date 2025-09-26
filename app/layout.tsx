import type { Metadata } from "next";
import { Geist, Geist_Mono, Kavivanar } from "next/font/google";
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import "toastr/build/toastr.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kavivanar = Kavivanar({
  variable: "--font-kavivanar",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Image Text Composer",
  description:
    "Image editing tool that enables users to upload a PNG image and overlay it with fully customisable text.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kavivanar.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
