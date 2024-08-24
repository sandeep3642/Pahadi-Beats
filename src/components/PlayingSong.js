import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import useSound from "use-sound";

const PlayingSong = () => {
  const { state } = useLocation();
  const { song } = state;
  const [isPlaying, setIsPlaying] = useState(true);
  const [currTime, setCurrTime] = useState({ min: "", sec: "" });
  const [seconds, setSeconds] = useState(0);

  const [play, { pause, duration, sound }] = useSound(song.songUrl);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]));
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({ min, sec });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const totalTime = {
    min: Math.floor(duration / 1000 / 60),
    sec: Math.floor((duration / 1000) % 60),
  };

  return (
    <div>
      <div className="fixed bottom-0 left-0 w-full bg-blue-800 shadow-lg z-50">
        <div className="playing-song flex items-center justify-between p-2 w-full max-w-full mx-auto">
          <div className="flex items-center">
            <img
              src={song.album.coverImage || "default-cover-image.jpg"}
              alt="Now playing cover art"
              className="w-16 h-16 object-cover rounded-lg mr-4"
            />
            <div className="song-details">
              <h3 className="text-lg font-semibold text-white truncate">
                {song.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {song.artists.map((artist) => artist.name).join(", ")}
              </p>
            </div>
          </div>

          <div className="player-controls flex items-center space-x-4">
            <button className="control-button text-white">
              <FaStepBackward className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-purple-500 text-white rounded-full p-3 focus:outline-none hover:bg-purple-600"
            >
              {isPlaying ? (
                <FaPause className="w-6 h-6" />
              ) : (
                <FaPlay className="w-6 h-6" />
              )}
            </button>
            <button className="control-button text-white">
              <FaStepForward className="w-5 h-5" />
            </button>
          </div>

          <div className="time-display text-white flex items-center">
            <span>{`${currTime.min}:${
              currTime.sec < 10 ? `0${currTime.sec}` : currTime.sec
            } / ${totalTime.min}:${
              totalTime.sec < 10 ? `0${totalTime.sec}` : totalTime.sec
            }`}</span>
          </div>
        </div>

        <input
          type="range"
          min="0"
          max={duration / 1000}
          value={seconds}
          className="timeline w-full"
          onChange={(e) => sound.seek([e.target.value])}
        />
      </div>
    </div>
  );
};

export default PlayingSong;
