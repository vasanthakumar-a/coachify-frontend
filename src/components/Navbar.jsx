'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Sample data

  return (
    <nav className="bg-blue-500 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          MyApp
        </Link>

        {/* Menu Items */}
        <div className="mx-auto flex gap-4 items-center">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/profile" className="hover:underline">
                Profile
              </Link>
              <Link href="/appointments" className="hover:underline">
                My Sessions
              </Link>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-xl">☰</button>
      </div>
    </nav>
  );
};

export default Navbar;
