import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMdArrowRoundForward } from "react-icons/io";
import apiHelper from "../utils/apiHelper";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(0); // Total pages
  const navigate = useNavigate();
  const pageSize = 6; // Number of songs per page

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        console.log(currentPage, pageSize);
        const data = await apiHelper(
          `/api/song/getAllSongs?pageNumber=${currentPage}&pageSize=${pageSize}`,
          "GET"
        );
        console.log(data.data, "All songs");
        setSongs(data.data);
        setTotalPages(Math.ceil(data.pagination.totalSongs / pageSize));         
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, [currentPage]);

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
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="ml-5 bg-[#682828] rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
            role="group"
            aria-labelledby={`card-title-${song._id}`}
          >
            <div className="relative p-4">
              <div className="relative w-full pb-[100%] bg-[#f1f1f1]">
                <img
                  src={song.album.coverImage || "default-cover-image.jpg"}
                  alt="Album Cover"
                  className="absolute top-0 left-0 w-full h-full object-cover"
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
            </div>
            <div className="p-4">
              <button
                className="text-white text-lg"
                id={`card-title-${song._id}`}
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
