import React, { useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import apiHelper from "../utils/apiHelper";
import PlayingSong from "./PlayingSong";

const AllSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const data = await apiHelper(
          `/api/song/getAllSongs?pageNumber=${currentPage}&pageSize=${pageSize}`,
          "GET"
        );
        if (data && data.data && data.pagination) {
          // Check if data structure is valid
          setSongs(data.data);
          setTotalPages(Math.ceil(data.pagination.totalSongs / pageSize));
        } else {
          console.error("Unexpected response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlaylist = async () => {
      try {
        const data = await apiHelper(
          `/api/song/getAllSongs?pageNumber=${currentPage}&pageSize=${pageSize}`,
          "GET"
        );
        setPlaylist(data.data);
        setTotalPages(Math.ceil(data.pagination.totalSongs / pageSize));
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchSongs();
    fetchPlaylist();
  }, [currentPage]);

  const handlePlaySong = (song) => {
    if (song && currentSong && currentSong._id === song._id) {
      // Ensure song is defined
      setIsPlaying(!isPlaying);
    } else if (song) {
      // Ensure song is defined
      setCurrentSong(song);
      setCurrentSongIndex(songs.findIndex((s) => s._id === song._id));
      setIsPlaying(true);
    }
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

  const handleChangeSong = (newIndex) => {
    setCurrentSong(playlist[newIndex]);
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <Spinner />
          ) : (
            <section className="flex-1 bg-purple-1000 p-4 md:p-6 text-white overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-white">
                    <tr>
                      <th className="py-2 px-2 md:px-4 text-left"></th>
                      <th className="py-2 px-2 md:px-4 text-left">Title</th>
                      <th className="py-2 px-2 md:px-4 text-center hidden md:table-cell">
                        Album Name
                      </th>
                      <th className="py-2 px-2 md:px-4 text-center hidden md:table-cell">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {songs.map((song, index) => (
                      <tr key={song._id} className="hover:bg-gray-800">
                        <td className="py-2 px-2 md:px-4 text-white">
                          {index + 1}
                        </td>
                        <td className="py-2 px-2 md:px-4 text-white flex items-center">
                          <img
                            src={
                              song.album.coverImage || "default-cover-image.jpg"
                            }
                            alt="Album Cover"
                            className="w-8 h-8 md:w-12 md:h-12 object-cover rounded-lg mr-2 md:mr-4"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{song.title}</p>
                            <p className="text-xs text-gray-400 truncate md:hidden">
                              {song.album.title}
                            </p>
                          </div>
                          <button
                            aria-label={`${
                              isPlaying && currentSong?._id === song._id
                                ? "Pause"
                                : "Play"
                            } ${song.title}`}
                            className="ml-2 md:ml-4 text-purple-400 hover:text-purple-600"
                            onClick={() => handlePlaySong(song)}
                          >
                            {isPlaying && currentSong?._id === song._id ? (
                              <FaPause className="w-4 h-4 md:w-5 md:h-5" />
                            ) : (
                              <FaPlay className="w-4 h-4 md:w-5 md:h-5" />
                            )}
                          </button>
                        </td>
                        <td className="py-2 px-2 md:px-4 text-gray-400 hidden md:table-cell">
                          {song?.album?.title}
                        </td>
                        <td className="py-2 px-2 md:px-4 text-gray-400 hidden md:table-cell">
                          {song.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-900 disabled:opacity-50"
                >
                  <IoMdArrowRoundBack />
                </button>
                <span className="bg-purple-1000 text-white py-2 px-4 rounded-lg">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-900 disabled:opacity-50"
                >
                  <IoMdArrowRoundForward />
                </button>
              </div>
            </section>
          )}
          {currentSong && (
            <PlayingSong
              song={currentSong}
              playlist={playlist}
              currentSongIndex={currentSongIndex}
              isPlaying={isPlaying}
              onChangeSong={handleChangeSong}
              onPlayPause={handlePlayPause}
            />
          )}  
        </main>
      </div>
    </div>
  );
};

export default AllSongs;
