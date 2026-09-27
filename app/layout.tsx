import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vincent Omolo — Creative Designer & Digital Craftsman",
  description:
    "Creative designer and digital craftsman portfolio, with a self-managed admin panel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
