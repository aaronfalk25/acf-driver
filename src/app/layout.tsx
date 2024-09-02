import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/providers/LayoutProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACF Driver Portal",
  description: "Driving solutions for all events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutProvider>
            <Navbar />
            {children}
        </LayoutProvider>  
      </body>
    </html>
  );
}
