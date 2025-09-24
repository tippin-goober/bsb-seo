"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  console.log("Rendering Navbar");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-heading font-bold">
          BSB Tractor Services
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8">
          <li><Link href="/" className="hover:text-gray-200 transition-colors duration-200 font-medium">Home</Link></li>
          <li><Link href="/services" className="hover:text-gray-200 transition-colors duration-200 font-medium">Services</Link></li>
          <li><Link href="/locations" className="hover:text-gray-200 transition-colors duration-200 font-medium">Locations</Link></li>
          <li><Link href="/contact" className="hover:text-gray-200 transition-colors duration-200 font-medium">Contact</Link></li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span className="block w-6 h-0.5 bg-white transition-transform duration-200"></span>
          <span className="block w-6 h-0.5 bg-white transition-transform duration-200"></span>
          <span className="block w-6 h-0.5 bg-white transition-transform duration-200"></span>
        </button>

        {/* Call Now Button */}
        <a
          href="tel:3212836902"
          className="hidden md:inline-block ml-4 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition"
        >
          Call Now
        </a>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900">
          <ul className="flex flex-col p-6 gap-6">
            <li><Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-gray-200 transition-colors duration-200">Home</Link></li>
            <li><Link href="/services" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-gray-200 transition-colors duration-200">Services</Link></li>
            <li><Link href="/locations" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-gray-200 transition-colors duration-200">Locations</Link></li>
            <li><Link href="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-gray-200 transition-colors duration-200">Contact</Link></li>
            <li>
              <a
                href="tel:3212836902"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition text-center"
                onClick={() => setIsOpen(false)}
              >
                Call Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
