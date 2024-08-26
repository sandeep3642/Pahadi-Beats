import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";

const Album = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await apiHelper('/api/album/getAllAlbums', "GET");
        setAlbums(data.data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {albums.map((album) => (
        <div
          key={album._id}
          className="bg-gray-700 rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
        >
          <div className="relative">
            <img
              src={album.coverImage || "default-cover-image.jpg"}
              alt="Album Cover"
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-2 right-2 hidden group-hover:block">
              <button
                aria-label={`Play ${album.title}`}
                className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
              >
                <FaPlay className="fill-black w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-2">
            <button
              onClick={() => console.log(`Clicked on album ${album.title}`)}
              className="text-white text-lg"
            >
              {album.title}
            </button>
            <div className="text-gray-400 text-sm">Album</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Album;
