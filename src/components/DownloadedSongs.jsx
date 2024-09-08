import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from 'react-player';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import localforage from "localforage";
const track = process.env.PUBLIC_URL + "/track.gif";

const DownloadedSongs = () => {
  const [downloadedSongs, setDownloadedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currTime, setCurrTime] = useState(0); // Changed to seconds for easier handling
  const [error, setError] = useState(null);
  const [currentSongUrl, setCurrentSongUrl] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchDownloadedSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const keys = await localforage.keys();
        const songs = [];

        for (let key of keys) {
          if (key.startsWith("song_")) {
            const song = await localforage.getItem(key);
            if (song && song.blob) {
              songs.push(song);
            } else {
              console.warn(`Song ${key} is missing blob data`);
            }
          }
        }

        if (songs.length === 0) {
          setError("No valid downloaded songs found.");
        }

        setDownloadedSongs(songs);
      } catch (error) {
        console.error("Error fetching downloaded songs:", error);
        setError("Failed to load downloaded songs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDownloadedSongs();
  }, []);

  useEffect(() => {
    if (downloadedSongs.length > 0 && downloadedSongs[currentSongIndex]?.blob) {
      const songBlobUrl = URL.createObjectURL(downloadedSongs[currentSongIndex].blob);
      setCurrentSongUrl(songBlobUrl);
      return () => {
        URL.revokeObjectURL(songBlobUrl);
      };
    }
  }, [currentSongIndex, downloadedSongs]);

  const handlePlayPause = () => {
    if (downloadedSongs.length > 0) {
      setIsPlaying(!isPlaying);
    } else {
      setError("No songs available to play.");
    }
  };

  const handlePrevious = () => {
    if (downloadedSongs.length > 0) {
      setCurrentSongIndex((prevIndex) => (prevIndex - 1 + downloadedSongs.length) % downloadedSongs.length);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (downloadedSongs.length > 0) {
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % downloadedSongs.length);
      setIsPlaying(true);
    }
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  const currentSong = downloadedSongs[currentSongIndex];

  const handlePlayerError = (e) => {
    console.error("Error playing song:", e);
    setError(`Failed to play song: ${currentSong?.title}. The file may be corrupted or missing.`);
    handleNext(); // Try playing the next song
  };

  const handlePlayerReady = () => {
    console.log(`Song ready to play: ${currentSong?.title}`);
    setError(null);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(newProgress);
    }
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
              {error && (
                <div className="bg-red-500 text-white p-2 rounded mb-4">
                  {error}
                </div>
              )}
              {downloadedSongs.length === 0 ? (
                <p>No downloaded songs available.</p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="text-white">
                    <tr>
                    <th className="py-2 px-4 text-left">#</th>
                      <th className="py-2 px-4 text-left">Title</th>
                      <th className="py-2 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {downloadedSongs.map((song, index) => (
                      <tr key={song.id} className={`hover:bg-gray-800 ${index === currentSongIndex ? 'bg-gray-700' : ''}`}>
                         <td className="py-2 px-4 text-white text-left">{index+1}</td>
                        <td className="py-2 px-4 text-white text-left">{song.title}</td>
                        <td className="py-2 px-4 text-white text-left">
                          <button
                            onClick={() => handleSongSelect(index)}
                            className="ml-2 text-purple-400 hover:text-purple-600"
                          >
                            {isPlaying && currentSongIndex === index ? (
                              <FaPause />
                            ) : (
                              <FaPlay />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}
          {currentSong && currentSongUrl && (
            <div className="bg-gray-800 shadow-lg p-4">
              <div className="playing-song flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <img
                    src={currentSong.album?.coverImage || track}
                    alt="Now playing cover art"
                    className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg mr-2 md:mr-4"
                  />
                  <div className="song-details">
                    <h3 className="text-sm md:text-lg font-semibold text-white truncate">
                      {currentSong.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 truncate">
                      {currentSong.album?.artist || "Unknown Artist"}
                    </p>
                  </div>
                </div>

                <div className="player-controls flex items-center space-x-2 md:space-x-4">
                  <button onClick={handlePrevious} className="control-button text-white">
                    <FaStepBackward className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="bg-purple-500 text-white rounded-full p-2 md:p-3 focus:outline-none hover:bg-purple-600"
                  >
                    {isPlaying ? (
                      <FaPause className="w-4 h-4 md:w-6 md:h-6" />
                    ) : (
                      <FaPlay className="w-4 h-4 md:w-6 md:h-6" />
                    )}
                  </button>
                  <button onClick={handleNext} className="control-button text-white">
                    <FaStepForward className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                <div className="flex flex-col items-center mt-2 md:mt-4">
                  <ReactPlayer
                    ref={playerRef}
                    url={currentSongUrl}
                    playing={isPlaying}
                    controls={false}
                    width="0"
                    height="0"
                    onReady={handlePlayerReady}
                    onError={handlePlayerError}
                    onDuration={(duration) => setDuration(duration)}
                    onProgress={({ playedSeconds }) => {
                      setCurrTime(playedSeconds);
                    }}
                    onEnded={handleNext}
                  />
                  <div className="w-full mt-2">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currTime}
                      onChange={handleProgressChange}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{formatTime(Math.floor(currTime / 60))}:{formatTime(Math.floor(currTime % 60))}</span>
                      <span>{formatTime(Math.floor(duration / 60))}:{formatTime(Math.floor(duration % 60))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DownloadedSongs;
