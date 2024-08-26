import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import apiHelper from "../utils/apiHelper";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(getResponsivePageSize());
  const navigate = useNavigate();

  // Function to determine page size based on screen width
  function getResponsivePageSize() {
    if (window.innerWidth >= 1280) return 8; // For large screens
    if (window.innerWidth >= 1024) return 6; // For medium screens
    if (window.innerWidth >= 768) return 4; // For small screens
    return 2; // For extra small screens
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
        setTotalPages(Math.ceil(data.pagination.totalSongs / pageSize));
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

  const handlePlaySong = (song) => {
    navigate("/playing-song", { state: { song } });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="bg-[#682828] rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
          >
            <div className="relative">
              <img
                src={song.album.coverImage || "default-cover-image.jpg"}
                alt="Album Cover"
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-2 right-2 hidden group-hover:block">
                <button
                  aria-label={`Play ${song.title}`}
                  className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
                  onClick={() => handlePlaySong(song)}
                >
                  <FaPlay className="fill-black w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <button
                className="text-white text-lg"
                onClick={() => handlePlaySong(song)}
              >
                {song.title}
              </button>
              <div className="text-gray-400 text-sm">Song</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-purple-700 text-white py-2 px-4 rounded-l-lg hover:bg-purple-900"
        >
          <IoMdArrowRoundBack />
        </button>
        <span className="bg-purple-1000 text-white py-2 px-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-purple-700 text-white py-2 px-4 rounded-r-lg hover:bg-purple-900"
        >
          <IoMdArrowRoundForward />
        </button>
      </div>
    </>
  );
};

export default Songs;
