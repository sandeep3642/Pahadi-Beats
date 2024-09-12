import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";

const PlayingSong = ({ song, playlist, currentSongIndex, isPlaying, onChangeSong, onPlayPause }) => {
  const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const handlePrevious = useCallback(() => {
    const newIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    onChangeSong(newIndex);
  }, [currentSongIndex, playlist.length, onChangeSong]);

  const handleNext = useCallback(() => {
    const newIndex = (currentSongIndex + 1) % playlist.length;
    onChangeSong(newIndex);
  }, [currentSongIndex, playlist.length, onChangeSong]);

  useEffect(() => {
    // Initialize or update the audio element when the song URL changes
    if (!audioRef.current) {
      audioRef.current = new Audio(song.songUrl);
    } else if (audioRef.current.src !== song.songUrl) {
      audioRef.current.src = song.songUrl;
    }

    const setAudioData = () => {
      setDuration(audioRef.current.duration);
      setCurrTime({ min: 0, sec: 0 });
    };

    const setAudioTime = () => {
      const currentTime = audioRef.current.currentTime;
      setCurrTime({
        min: Math.floor(currentTime / 60),
        sec: Math.floor(currentTime % 60),
      });
    };

    const handleEnded = () => {
      handleNext();
    };

    // Attach event listeners
    audioRef.current.addEventListener("loadedmetadata", setAudioData);
    audioRef.current.addEventListener("timeupdate", setAudioTime);
    audioRef.current.addEventListener("ended", handleEnded);

    // Handle play/pause functionality
    if (isPlaying) {
      audioRef.current.play().catch((error) => console.error("Playback error:", error));
    } else {
      audioRef.current.pause();
    }

    // Cleanup on unmount or song change
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadedmetadata", setAudioData);
        audioRef.current.removeEventListener("timeupdate", setAudioTime);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [song, handleNext, isPlaying]);

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrTime({ min: Math.floor(time / 60), sec: Math.floor(time % 60) });
    }
  };

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  const totalTime = {
    min: Math.floor(duration / 60),
    sec: Math.floor(duration % 60),
  };

  return (
    <div className="bg-gray-800 shadow-lg">
      <div className="playing-song flex flex-col md:flex-row items-center justify-between p-2 w-full max-w-full mx-auto">
        <div className="flex items-center mb-2 md:mb-0">
          <img
            src={song.album?.coverImage || song?.coverImage}
            alt="Now playing cover art"
            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg mr-2 md:mr-4"
          />
          <div className="song-details">
            <h3 className="text-sm md:text-lg font-semibold text-white truncate">
              {song.title}
            </h3>
          </div>
        </div>

        <div className="player-controls flex items-center space-x-2 md:space-x-4">
          <button onClick={handlePrevious} className="control-button text-white">
            <FaStepBackward className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button
            onClick={() => onPlayPause(!isPlaying)}
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

        <div className="time-display text-white flex items-center text-xs md:text-sm mt-2 md:mt-0">
          <span>{`${formatTime(currTime.min)}:${formatTime(currTime.sec)} / ${formatTime(totalTime.min)}:${formatTime(totalTime.sec)}`}</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={duration}
        value={audioRef.current?.currentTime || 0}
        className="timeline w-full"
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default PlayingSong;
