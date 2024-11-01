import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pengumpulan Tugas",
  description: "Pengumpulan Tugas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
