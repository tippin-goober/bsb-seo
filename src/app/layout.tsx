import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BSB Tractor Services",
    template: "%s | BSB Tractor Services",
  },
  description:
    "Professional land clearing, stump grinding, junk removal, and more in Volusia County.",
  keywords: [
    "land clearing",
    "stump grinding",
    "junk removal",
    "Volusia County",
    "BSB Tractor Services",
  ],
  openGraph: {
    title: "BSB Tractor Services",
    description:
      "Trusted land clearing, stump grinding, and junk removal services in Volusia County.",
    url: "https://www.bsbtractorservices.com",
    siteName: "BSB Tractor Services",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BSB Tractor Services working on a land clearing project",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BSB Tractor Services",
    description:
      "Land clearing, stump grinding, and junk removal services across Volusia County.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-100 border-t mt-8">
          <div className="max-w-6xl mx-auto p-6 grid gap-6 md:grid-cols-3 text-gray-600">
            <div>
              <h3 className="font-semibold mb-2">BSB Tractor Services</h3>
              <p className="text-sm">
                Professional land clearing, stump grinding, and junk removal
                serving Volusia County.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-sm">
                <li><a href="/services" className="hover:underline">Services</a></li>
                <li><a href="/locations" className="hover:underline">Locations</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-sm">Phone: (321) 283-6902</p>
              <p className="text-sm">De Leon Springs, FL</p>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm pb-4">
            © {new Date().getFullYear()} BSB Tractor Services. All rights
            reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
