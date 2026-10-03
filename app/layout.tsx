import type { Metadata } from "next";
import "@uploadthing/react/styles.css";
import "./globals.css";
import { ThemeProvider, themeInitScript } from "./_components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inter, for the public site only (admin keeps its SF Pro stack). */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Runs before paint to set the "dark" class synchronously,
            avoiding a flash of the wrong theme on first load. See
            app/_components/ThemeProvider.tsx for why this is inlined
            as a script rather than a React effect. */}
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
