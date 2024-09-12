import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import PlayingSong from "./PlayingSong";
import apiHelper from "../utils/apiHelper";
import { useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import { MdFileDownload, MdLock } from "react-icons/md";

const AboutAlbum = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [playlist, setPlaylist] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Add subscription state
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchAlbum = async () => {
      setLoading(true);
      try {
        const albumData = await apiHelper(`/api/album/getAlbum/${id}`, "GET");
        setAlbum(albumData.data.album);
        setSongs(albumData.data.allSongInAlbum); // Assuming the API returns songs with the album details
        setPlaylist(albumData.data.allSongInAlbum); // Set the playlist
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  const handlePlaySong = (song, index) => {
    if (song && currentSong && currentSong._id === song._id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setCurrentSongIndex(index);
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
        toast.success("Song downloaded and saved successfully");
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
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

  const handleLockClick = () => {
    navigate("/buy-plans");
  };
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <header className="bg-black text-white p-4 flex justify-between items-center md:hidden">
            <h1 className="text-xl font-bold">
              {album?.title || "Album Title"}
            </h1>
            <button
              className="text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              <FaBars size={24} />
            </button>
          </header>
          <Header />
          {loading ? (
            <Spinner />
          ) : (
            <section className="flex-1 bg-purple-1000 p-4 md:p-6 text-white overflow-y-auto">
              <div className="p-4 md:p-8 text-white">
                {/* Album Details */}
                <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8">
                  <img
                    src={album?.coverImage || "default-album-cover.jpg"}
                    alt="Album Cover"
                    className="w-48 h-48 object-cover rounded-lg shadow-lg mb-4 md:mb-0"
                  />
                  <div>
                    <h2 className="text-2xl md:text-4xl font-bold">
                      {album?.title.toUpperCase()}
                    </h2>
                    <p className="text-md text-gray-400 mt-2">
                      by{" "}
                      {album.artist?.map((artist) => artist.name).join(", ") ||
                        "Unknown Artist"}
                    </p>
                    <p className="text-md text-gray-400">Year {new Date(album.releaseDate).toISOString().slice(0, 4)}</p>
                    </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-white">
                    <tr>
                      <th className="py-2 px-2 md:px-4 text-left"></th>
                      <th className="py-2 px-2 md:px-4 text-left">Title</th>
                      <th className="py-2 px-2 md:px-4 text-center hidden md:table-cell">
                        Artist Name
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
                        {song.artists
                            ?.map((artist) => artist.name)
                            .join(", ") || "Unknown Artist"}
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
          {/* PlayingSong component */}
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
          <ToastContainer />
        </main>
      </div>
    </div>
  );
};

export default AboutAlbum;
