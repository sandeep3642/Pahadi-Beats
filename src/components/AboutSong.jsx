import React, { useState, useEffect } from "react";
import { FaBars, FaPlay, FaPause } from "react-icons/fa";
import Sidebar from "./Sidebar";
import apiHelper from "../utils/apiHelper";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import Spinner from "./Spinner";
import { MdFileDownload, MdLock } from "react-icons/md";
import localforage from "localforage";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import PlayingSong from "./PlayingSong";
const AboutSong = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { songId } = location.state || {}; // Get songId from location state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendedSong, setRecommendedSong] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(false); // Example subscription state
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        const data = await apiHelper(
          `/api/song/getSong/${songId}?page=${currentPage}`,
          "GET"
        );

        if (data && data.data) {
          setCurrentSong(data.data.song);
          setRecommendedSong(data.data.recommendedSongs); // Update recommended songs
          setTotalPages(data.pagination.totalPages); // Update total pages
          setPlaylist(data.data.recommendedSongs || []); // Update playlist

          // Automatically play the song when fetched
          if (data.data.song) {
            setIsPlaying(true);
            setCurrentSongIndex(
              data.data.recommendedSongs.findIndex(
                (s) => s._id === data.data.song._id
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching song:", error);
      } finally {
        setLoading(false);
      }
    };

    if (songId) {
      fetchSong();
    }
  }, [songId, currentPage]);

  const handlePlaySong = (song) => {
    if (song && currentSong && currentSong._id === song._id) {
      setIsPlaying(!isPlaying);
    } else if (song) {
      setCurrentSong(song);
      setCurrentSongIndex(playlist.findIndex((s) => s._id === song._id));
      setIsPlaying(true);
    }
  };

  // Handler for next and previous pages
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Move to the next page
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Move to the previous page
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

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await apiHelper(
          "/api/subscription/getUserSubscription",
          "GET"
        );
        if (response.status === 200) {
          if (response.data[0].status === "active") {
            setIsSubscribed(true);
          }
        }
      } catch (error) {
        console.error(error.response?.data?.error || "An error occurred.");
      }
    };
    fetchSubscriptions();
  }, []);
  const handleDownload = async (songId, songTitle) => {
    try {
      setLoading(true);
      const response = await apiHelper(
        `/api/song/download/${songId}`,
        "GET",
        null,
        null,
        null,
        true
      );
      if (response.data) {
        console.log(typeof response.data, ">>>>>>>>>>>>>>>>>");
        const blob = new Blob([response.data], { type: "audio/mpeg" });
        await localforage.setItem(`song_${songId}`, {
          blob,
          title: songTitle,
          id: songId,
        });

        console.log("Song downloaded and saved successfully");
        toast.success("Song downloaded and saved successfully");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLockClick = () => {
    navigate("/buy-plans");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        {/* Header for Mobile View */}
        <header className="bg-black text-white p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">Pahadi Beats</h1>
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <FaBars size={24} />
          </button>
        </header>
        {loading ? (
          <Spinner />
        ) : (
          <section className="flex-1 bg-purple-1000 p-4 md:p-6 text-white overflow-y-auto">
            <div className="overflow-x-auto">
                <h1 className="text-white text-left text-3xl">Recommended Songs </h1>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-white">
                  <tr>
                    <th className="py-2 px-2 md:px-4 text-left">#</th>
                    <th className="py-2 px-2 md:px-4 text-left">Title</th>
                    <th className="py-2 px-2 md:px-4 text-center hidden md:table-cell">
                      Album Name
                    </th>
                    <th className="py-2 px-2 md:px-4 text-center hidden md:table-cell">
                      Duration
                    </th>
                    <th className="py-2 px-2 md:px-4 text-center hidden md:table-cell">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recommendedSong &&
                    recommendedSong.map((song, index) => (
                      <tr key={song._id} className="hover:bg-gray-800">
                        <td className="py-2 px-2 md:px-4 text-white text-left">
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
                        <td className="ml-2 md:ml-4 text-purple-400 hover:text-purple-600">
                          {isSubscribed ? (
                            <div className="relative inline-block">
                              <MdFileDownload
                                className="w-4 h-4 md:w-5 md:h-5"
                                onClick={() =>
                                  handleDownload(song._id, song.title)
                                }
                              />
                            </div>
                          ) : (
                            <div className="relative inline-block">
                              <MdFileDownload
                                className="w-4 h-4 md:w-5 md:h-5"
                                onClick={handleLockClick}
                              />
                              <MdLock className="w-3 h-3 md:w-4 md:h-4 text-gray-400 absolute top-0 left-0" />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                <IoMdArrowRoundBack />
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-gray-800 text-white px-4 py-2 rounded disabled:opacity-50"
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
      {loading && <Spinner />} {/* Show spinner when loading */}
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default AboutSong;
