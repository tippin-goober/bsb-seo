import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Link from "next/link";
import Navbar from "../components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
}: {
  children: React.ReactNode;
}) {
  console.log("Rendering RootLayout");
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-900 text-gray-300 mt-16">
          <div className="max-w-6xl mx-auto p-8 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4">BSB Tractor Services</h3>
              <p className="text-gray-300 leading-relaxed">
                Professional land clearing, stump grinding, and junk removal
                serving Volusia County.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-200">Services</Link></li>
                <li><Link href="/locations" className="text-gray-300 hover:text-white transition-colors duration-200">Locations</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-heading font-semibold text-white mb-4">Contact Us</h3>
              <p className="text-gray-300 mb-2">Phone: (321) 283-6902</p>
              <p className="text-gray-300">De Leon Springs, FL</p>
            </div>
          </div>
          <div className="border-t border-gray-800 text-center text-gray-400 py-6">
            © {new Date().getFullYear()} BSB Tractor Services. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
