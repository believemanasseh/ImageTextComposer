import type { Metadata } from "next";
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import "toastr/build/toastr.min.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
