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
                href="/about" // Replace with actual URL
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

        {/* Plans */}
        <div>
          <p className="text-lg font-bold mb-4">Pahadi Beat Plans</p>
          <ul className="space-y-2">
            <li>
              <a
                href="buy-plans" // Replace with actual URL
                className="text-gray-400 hover:text-white"
                aria-label="Premium Individual"
              >
                Premium Individual
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
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
        {/* Corrected Footer Text */}
        <p className="text-gray-400">© 2024 Pahadi Beats. All rights reserved.</p>
      </div>
    </nav>
  );
};

export default Footer;
