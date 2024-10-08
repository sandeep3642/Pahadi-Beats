import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiHelper from "../utils/apiHelper";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(getResponsivePageSize());
  const navigate = useNavigate();

  // Function to determine page size based on screen width
  function getResponsivePageSize() {
    if (window.innerWidth >= 1280) return 6; // Large screens show 6 items
    if (window.innerWidth >= 1024) return 4; // Medium screens show 4 items
    if (window.innerWidth >= 768) return 4; // Small screens show 2 items
    return 4; // Extra small screens show 2 items
  }

  // Fetch songs whenever currentPage or pageSize changes
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await apiHelper(
          `/api/song/getAllSongs?pageNumber=${currentPage}&pageSize=${pageSize}`,
          "GET"
        );
        setSongs(data.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [currentPage, pageSize]);

  // Update page size on window resize
  useEffect(() => {
    const handleResize = () => {
      setPageSize(getResponsivePageSize());
      setCurrentPage(1); // Reset to page 1 on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePlaySong = (songId) => {
    navigate("/aboutSong",{
      state: { songId }
    });
  };

  return (
    <>
      <div className="flex overflow-x-auto gap-4 p-4">
        {songs.slice(0,6).map((song) => (
          <div
            key={song._id}
            className="relative flex flex-col items-center group p-2 transition-transform transform hover:scale-105"
          >
            {/* Song Image Container */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-gray-200 overflow-hidden relative">
              <img
                src={song.album.coverImage || "default-cover-image.jpg"}
                alt={`Song ${song.title}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Background card on hover */}
            <div className="absolute inset-0 bg-gray-500 bg-opacity-80 flex flex-col items-center justify-center p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                aria-label={`Play ${song.title}`}
                className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
                onClick={() => handlePlaySong(song._id)}
              >
                <FaPlay className="fill-white w-6 h-6" />
              </button>
              <span className="text-white mt-2 text-center">{song.title}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Songs;
