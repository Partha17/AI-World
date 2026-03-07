import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JewelAI — Search Jewelry Across Vendors",
  description:
    "AI-powered jewelry search kiosk for gold buildings. Search across multiple vendors with natural language.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
