import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crop Doctor: The Future of Farming is in Your Hands",
  description:
    "Crop Doctor is an AI-powered mobile app for farmers, providing instant crop disease diagnosis and treatment advice. This web portal is the administrative dashboard for managing the AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
