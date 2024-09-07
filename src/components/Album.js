import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";

const Album = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await apiHelper("/api/album/getAllAlbums", "GET");
        setAlbums(data.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="flex overflow-x-auto gap-4 p-4">
      {albums.map((album) => (
        <div
          key={album._id}
          className="relative flex flex-col items-center group p-2 transition-transform transform hover:scale-105"
        >
          {/* Album Image Container */}
          <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gray-200 overflow-hidden relative">
            <img
              src={album.coverImage || "default-cover-image.jpg"}
              alt={`Album ${album.title}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Background card on hover */}
          <div className="absolute inset-0 bg-gray-500 flex flex-col items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              aria-label={`Play ${album.title}`}
              className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
            >
              <FaPlay className="fill-white w-6 h-6" />
            </button>
            <span className="text-white mt-2 text-center">{album.title}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Album;
