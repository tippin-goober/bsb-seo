"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white sticky top-0 z-50 shadow">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold">
          BSB Tractor Services
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li><Link href="/services" className="hover:underline">Services</Link></li>
          <li><Link href="/locations" className="hover:underline">Locations</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact</Link></li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

        {/* Call Now Button */}
        <a
          href="tel:3212836902"
          className="hidden md:inline-block ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Call Now
        </a>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <ul className="flex flex-col p-4 gap-4">
            <li><Link href="/" onClick={() => setIsOpen(false)}>Home</Link></li>
            <li><Link href="/services" onClick={() => setIsOpen(false)}>Services</Link></li>
            <li><Link href="/locations" onClick={() => setIsOpen(false)}>Locations</Link></li>
            <li><Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
            <li>
              <a
                href="tel:3212836902"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
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
