import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import apiHelper from "../utils/apiHelper";
import PlayingSong from "./PlayingSong";
import { MdFileDownload, MdLock } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import localforage from "localforage";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import Header from "./Header";
const AllSongs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const location = useLocation();
  const artist = location.state || ""; // Get artist from location state
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const pageSize = 10;
  const [isSubscribed, setIsSubscribed] = useState(false); // Add subscription state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const data = await apiHelper(
          `/api/song/getAllSongs?artist=${artist}`,
          "GET"
        );
        if (data && data.data) {
          // Check if data structure is valid
          setSongs(data.data);
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
          `/api/song/getAllSongs?artist=${artist}`,
          "GET"
        );
        setPlaylist(data.data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchSongs();
    fetchPlaylist();
  }, [currentPage, artist]);

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
    <div className="flex flex-col h-screen ">
      <div className="flex flex-col md:flex-row min-h-screen ">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
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
          <Header />
          {loading ? (
            <Spinner />
          ) : (
            <section className="flex-1 bg-purple-1000 p-4 md:p-6 text-white">
              <h2 className="text-3xl font-bold mb-4 text-left ">All Songs</h2>
              <div className="">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-white">
                    <tr>
                      <th className="py-2 px-2 md:px-4 text-left">#</th>
                      <th className="py-2 px-2 md:px-4 text-center">Title</th>
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
                    {songs.map((song, index) => (
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
                                } // Correctly pass a function reference
                              />
                            </div>
                          ) : (
                            <div className="relative inline-block">
                              <MdFileDownload
                                className="w-4 h-4 md:w-5 md:h-5"
                                onClick={handleLockClick}
                              />
                              <MdLock
                                className="w-3 h-3 md:w-4 md:h-4 absolute top-2 left-2 text-red-600"
                                onClick={handleLockClick}
                              />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          {currentSong && (
            <div className="fixed bottom-0 left-0 right-0">
              <PlayingSong
                song={currentSong}
                playlist={playlist}
                currentSongIndex={currentSongIndex}
                isPlaying={isPlaying}
                onChangeSong={handleChangeSong}
                onPlayPause={handlePlayPause}
              />
            </div>
          )}
        </main>
      </div>
      {loading && <Spinner />} {/* Show spinner when loading */}
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
    </div>
  );
};

export default AllSongs;
