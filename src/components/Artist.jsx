import React, { useState, useEffect } from "react";
import apiHelper from "../utils/apiHelper";
import { Link } from "react-router-dom";

const Artist = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await apiHelper("/api/artist/getAllArtists", "GET");
        setArtists(data.data);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <div className="flex overflow-x-auto gap-4 p-4">
      {artists.slice(0, 6).map((artist) => (
        <div
          key={artist._id}
          className="relative flex flex-col items-center group rounded-full p-2 transition-transform transform hover:scale-105"
        >
          {/* Artist Image Container */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gray-200 rounded-full overflow-hidden relative">
            <img
              src={artist.profilePic || "default-cover-image.jpg"}
              alt={`Artist ${artist.name}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Background card on hover */}
          <Link to={`/aboutArtist/${artist._id}`}>
            <div className="absolute inset-0 bg-gray-500 rounded-full flex flex-col items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button aria-label={`View ${artist.name}`} className="text-white">
                View
              </button>
              <span className="text-white mt-2 text-center">{artist.name}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Artist;
