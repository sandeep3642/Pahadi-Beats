import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";

const Album = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // const response = await fetch("/api/album/getAllAlbums");
        // if (response.ok) {
        //   const data = await response.json();
        //   console.log(data);
        //   setAlbums(data.data);
        // } else {
        //   console.error("Failed to fetch songs:", response.statusText);
        // }
        const data = await apiHelper('/api/album/getAllAlbums',"GET")
          setAlbums(data.data);

      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-4">
        {albums.map((album) => (
          <div
            key={album._id}
            className="ml-5 bg-[#682828] rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
            role="group"
            aria-labelledby={`card-title-${album._id}`}
          >
            <div className="relative p-4">
              <div className="relative w-full pb-[100%] bg-[#f1f1f1]">
                <img
                  src={album.coverImage || "default-cover-image.jpg"}
                  alt="Album Cover"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                 <div className="absolute bottom-2 right-2 hidden group-hover:block">
                  <button
                    aria-label={`Play ${album.title}`}
                    className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
                  >
                    <FaPlay className="fill-black  w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <a
                href="#"
                className="text-white text-lg"
                id={`card-title-${album._id}`}
              >
                {album.title}
              </a>
              <div className="text-gray-400 text-sm">Album</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Album;
