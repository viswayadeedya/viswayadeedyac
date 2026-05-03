import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Viswa Yadeedya — Full Stack Software Engineer",
  description:
    "Portfolio of Viswa Yadeedya — Full Stack Software Engineer building systems that scale.",
  openGraph: {
    title: "Viswa Yadeedya",
    description: "Full Stack Software Engineer",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0a0a] text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
