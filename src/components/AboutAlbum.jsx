import React, { useState, useEffect } from "react";
import { FaPlay, FaPause, FaBars, FaDownload } from "react-icons/fa";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import PlayingSong from "./PlayingSong"; // Include the PlayingSong component for song playback
import apiHelper from "../utils/apiHelper";
import { useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer from react-toastify
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";

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
  }, []);

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

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main content area */}
        <main className="flex-1 flex flex-col">
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
                      {album?.title}
                    </h2>
                    <p className="text-md text-gray-400 mt-2">
                      {album.artist.name}
                    </p>
                    <p className="text-md text-gray-400">{album.releaseDate}</p>
                  </div>
                </div>
              </div>
              <div className="song-list">
                {songs.map((song, index) => (
                  <div
                    key={song._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => handlePlaySong(song, index)}
                        className="text-white mr-4"
                      >
                        {isPlaying && currentSong?._id === song._id ? (
                          <FaPause />
                        ) : (
                          <FaPlay />
                        )}
                      </button>
                      <span>{song.title}</span>
                    </div>
                    <button
                      onClick={() => handleDownload(song._id, song.title)}
                      className="text-white"
                    >
                      <FaDownload />
                    </button>
                  </div>
                ))}
              </div>

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
            </section>
          )}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AboutAlbum;
