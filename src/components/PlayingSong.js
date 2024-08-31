import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";
import useSound from "use-sound";

const PlayingSong = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { song, playlist, currentSongIndex } = state;
  const [isPlaying, setIsPlaying] = useState(true);
  const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
  const [seconds, setSeconds] = useState(0);

  const [play, { pause, duration, sound }] = useSound(song.songUrl, {
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      handleNext();
    },
    onpause: () => setIsPlaying(false),
    format: ['mp3']
  });

  useEffect(() => {
    if (isPlaying) {
      play();
    } else {
      pause();
    }
  }, [isPlaying, play, pause]);

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

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (currentSongIndex > 0) {
      navigate("/playing-song", { 
        state: { 
          song: playlist[currentSongIndex - 1], 
          playlist, 
          currentSongIndex: currentSongIndex - 1 
        } 
      });
    }
  };

  const handleNext = () => {
    if (currentSongIndex < playlist.length - 1) {
      navigate("/playing-song", { 
        state: { 
          song: playlist[currentSongIndex + 1], 
          playlist, 
          currentSongIndex: currentSongIndex + 1 
        } 
      });
    }
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  const totalTime = {
    min: Math.floor(duration / 1000 / 60),
    sec: Math.floor((duration / 1000) % 60),
  };

  return (
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
          <button onClick={handlePrevious} className="control-button text-white">
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
          <button onClick={handleNext} className="control-button text-white">
            <FaStepForward className="w-5 h-5" />
          </button>
        </div>

        <div className="time-display text-white flex items-center">
          <span>{`${formatTime(currTime.min)}:${formatTime(currTime.sec)} / ${formatTime(totalTime.min)}:${formatTime(totalTime.sec)}`}</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={duration / 1000}
        value={seconds}
        className="timeline w-full"
        onChange={(e) => {
          sound.seek([e.target.value]);
        }}
      />
    </div>
  );
};

export default PlayingSong;