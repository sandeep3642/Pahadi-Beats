import React from "react";
import { FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <nav className="mt-6 border-2 border-rose-600 bg-purple-1000 text-white p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Company Links */}
        <div>
          <p className="text-lg font-bold mb-4">Company</p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://example.com/about" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="About"
              >
                About
              </a>
            </li>
          </ul>
        </div>


        {/* Useful Links */}
        <div>
          <p className="text-lg font-bold mb-4">Download Links</p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://example.com/support" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Support"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href="https://example.com/free-mobile-app" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Free Mobile App"
              >
                Free Mobile App
              </a>
            </li>
          </ul>
        </div>

        {/* Spotify Plans */}
        <div>
          <p className="text-lg font-bold mb-4">Pahadi Beat Plans</p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://example.com/premium-individual" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Premium Individual"
              >
                Premium Individual
              </a>
            </li>
            <li>
              <a
                href="https://example.com/premium-duo" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Premium Duo"
              >
                Premium Duo
              </a>
            </li>
            <li>
              <a
                href="https://example.com/premium-family" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Premium Family"
              >
                Premium Family
              </a>
            </li>
            <li>
              <a
                href="https://example.com/premium-student" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Premium Student"
              >
                Premium Student
              </a>
            </li>
            <li>
              <a
                href="https://example.com/spotify-free" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Spotify Free"
              >
                Spotify Free
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 flex justify-center space-x-4">
        <a
          href="https://instagram.com" // Replace with actual Instagram URL
          className="text-gray-400 hover:text-white"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="w-6 h-6" />
        </a>
        <a
          href="https://twitter.com" // Replace with actual Twitter URL
          className="text-gray-400 hover:text-white"
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter className="w-6 h-6" />
        </a>
      </div>
    </nav>
  );
};

export default Footer;
