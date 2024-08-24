import React from "react";

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
                href=""
                className="text-gray-400 hover:text-white"
                aria-label="About"
              >
                About
              </a>
            </li>
            {/* <li>
              <a
                href="https://www.lifeatspotify.com/"
                className="text-gray-400 hover:text-white"
                aria-label="Jobs"
              >
                Jobs
              </a>
            </li> */}
            {/* <li>
              <a
                href="https://newsroom.spotify.com/"
                className="text-gray-400 hover:text-white"
                aria-label="For the Record"
              >
                For the Record
              </a>
            </li> */}
          </ul>
        </div>

        {/* Communities Links */}
        {/* <div>
          <p className="text-lg font-bold mb-4">Communities</p>
          <ul className="space-y-2">
            <li>
              <a
                href="https://artists.spotify.com/"
                className="text-gray-400 hover:text-white"
                aria-label="For Artists"
              >
                For Artists
              </a>
            </li>
            <li>
              <a
                href="https://developer.spotify.com/"
                className="text-gray-400 hover:text-white"
                aria-label="Developers"
              >
                Developers
              </a>
            </li>
            <li>
              <a
                href="https://ads.spotify.com/"
                className="text-gray-400 hover:text-white"
                aria-label="Advertising"
              >
                Advertising
              </a>
            </li>
            <li>
              <a
                href="https://investors.spotify.com/"
                className="text-gray-400 hover:text-white"
                aria-label="Investors"
              >
                Investors
              </a>
            </li>
            <li>
              <a
                href="https://spotifyforvendors.com/"
                className="text-gray-400 hover:text-white"
                aria-label="Vendors"
              >
                Vendors
              </a>
            </li>
          </ul>
        </div> */}

        {/* Useful Links */}
        <div>
          <p className="text-lg font-bold mb-4">Download Links</p>
          <ul className="space-y-2">
            <li>
              <a
                href=""
                className="text-gray-400 hover:text-white"
                aria-label="Support"
              >
                Support
              </a>
            </li>
            <li>
              <a
                href=""
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
                href=""
                className="text-gray-400 hover:text-white"
                aria-label="Premium Individual"
              >
                Premium Individual
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-400 hover:text-white"
                aria-label="Premium Duo"
              >
                Premium Duo
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-400 hover:text-white"
                aria-label="Premium Family"
              >
                Premium Family
              </a>
            </li>
            <li>
              <a
                href=""
                className="text-gray-400 hover:text-white"
                aria-label="Premium Student"
              >
                Premium Student
              </a>
            </li>
            <li>
              <a
                href=""
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
          href=""
          className="text-gray-400 hover:text-white"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {/* SVG Path for Instagram */}
            <path d="M12 2.2c3.18 0 3.58.01 4.85.07 1.17.06 1.96.24 2.42.4.66.24 1.13.53 1.63 1.03.5.5.79.97 1.03 1.63.17.46.34 1.25.4 2.42.06 1.27.07 1.67.07 4.85s-.01 3.58-.07 4.85c-.06 1.17-.24 1.96-.4 2.42-.24.66-.53 1.13-1.03 1.63-.5.5-.97.79-1.63 1.03-.46.17-1.25.34-2.42.4-1.27.06-1.67.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.06-1.96-.24-2.42-.4-.66-.24-1.13-.53-1.63-1.03-.5-.5-.79-.97-1.03-1.63-.17-.46-.34-1.25-.4-2.42C2.21 15.58 2.2 15.18 2.2 12s.01-3.58.07-4.85c.06-1.17.24-1.96.4-2.42.24-.66.53-1.13 1.03-1.63.5-.5.97-.79 1.63-1.03.46-.17 1.25-.34 2.42-.4C8.42 2.21 8.82 2.2 12 2.2m0-2.2C8.73 0 8.27.01 7.01.07 5.81.12 4.78.31 3.9.62 3 .94 2.18 1.44 1.44 2.18.94 2.91.31 3.82.07 4.9.01 5.81 0 6.27 0 9.55v4.91c0 3.28.01 3.74.07 4.9.12 1.18.31 2.21.62 3.1.32.9.83 1.73 1.57 2.47.73.73 1.57 1.24 2.47 1.57.89.32 1.92.51 3.1.62 1.16.07 1.62.07 4.9.07s3.74-.01 4.9-.07c1.18-.12 2.21-.31 3.1-.62.9-.32 1.73-.83 2.47-1.57.73-.73 1.24-1.57 1.57-2.47.32-.89.51-1.92.62-3.1.07-1.16.07-1.62.07-4.9s-.01-3.74-.07-4.9c-.12-1.18-.31-2.21-.62-3.1-.32-.9-.83-1.73-1.57-2.47-.73-.73-1.57-1.24-2.47-1.57-.89-.32-1.92-.51-3.1-.62C15.73.01 15.27 0 12 0zM12 5.8c-3.42 0-6.2 2.78-6.2 6.2s2.78 6.2 6.2 6.2 6.2-2.78 6.2-6.2-2.78-6.2-6.2-6.2zm0 10.3c-2.26 0-4.1-1.84-4.1-4.1s1.84-4.1 4.1-4.1 4.1 1.84 4.1 4.1-1.84 4.1-4.1 4.1zm6.36-11.66c-.8 0-1.45.65-1.45 1.45s.65 1.45 1.45 1.45 1.45-.65 1.45-1.45-.65-1.45-1.45-1.45z" />
          </svg>
        </a>
        <a
          href=""
          className="text-gray-400 hover:text-white"
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {/* SVG Path for Twitter */}
            <path d="M24 4.56c-.88.39-1.83.65-2.83.77 1.02-.61 1.8-1.57 2.17-2.71-.95.57-2 1-3.13 1.23-.9-.96-2.18-1.55-3.59-1.55-2.71 0-4.91 2.2-4.91 4.91 0 .39.04.77.13 1.14-4.08-.2-7.69-2.16-10.11-5.14-.42.72-.66 1.55-.66 2.44 0 1.68.86 3.17 2.17 4.04-.8-.03-1.55-.25-2.21-.61v.06c0 2.35 1.67 4.31 3.88 4.75-.41.11-.84.16-1.29.16-.31 0-.62-.03-.92-.08.63 1.94 2.44 3.36 4.6 3.4-1.68 1.32-3.8 2.1-6.1 2.1-.39 0-.77-.02-1.15-.07 2.18 1.4 4.77 2.21 7.56 2.21 9.06 0 14-7.5 14-14 0-.21 0-.42-.01-.63.96-.69 1.8-1.55 2.46-2.54z" />
          </svg>
        </a>
      </div>
    </nav>
  );
};

export default Footer;
