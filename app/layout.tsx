import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Accessible Learning Platform",
  description:
    "Convert educational content into personalized, accessible formats for every learner.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
          Built for accessibility &middot; PS-06 Accessible Learning
        </footer>
      </body>
    </html>
  );
}
