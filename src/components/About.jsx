import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Pahadi Beats</h1>
        <p className="text-gray-600 mb-6">
          Discover the perfect music for every occasion with Pahadi Beats, available on your phone, computer, tablet, and more. Enjoy a wide variety of Pahadi songs, including Garhwali, Kumaoni, Himachali, and more, all in one app.
        </p>
        <p className="text-gray-600 mb-6">
          With millions of tracks and albums, Pahadi Beats has something for every mood—whether you’re driving, working out, partying, or just relaxing. Choose what you want to listen to, whenever you want.
        </p>
        <p className="text-gray-600 mb-6">
          Explore playlists and collections curated by your friends and discover new music together.
        </p>
        <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 transition duration-300">
        <Link to = "/"> Explore Now</Link> 
        </button>
      </div>
    </div>
  );
};

export default About;
