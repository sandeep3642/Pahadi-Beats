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
    // Clean up the previous audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    // Create a new audio element
    audioRef.current = new Audio(song.songUrl);
    
    const setAudioData = () => {
      setDuration(audioRef.current.duration);
      setCurrTime({ min: 0, sec: 0 });
    };

    const setAudioTime = () => {
      const min = Math.floor(audioRef.current.currentTime / 60);
      const sec = Math.floor(audioRef.current.currentTime % 60);
      setCurrTime({ min, sec });
    };

    const handleEnded = () => {
      handleNext();
    };

    audioRef.current.addEventListener('loadeddata', setAudioData);
    audioRef.current.addEventListener('timeupdate', setAudioTime);
    audioRef.current.addEventListener('ended', handleEnded);

    // Start playing if isPlaying is true
    if (isPlaying) {
      audioRef.current.play().catch(error => console.error("Playback failed:", error));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadeddata', setAudioData);
        audioRef.current.removeEventListener('timeupdate', setAudioTime);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [song, handleNext, isPlaying]);  // Include handleNext and isPlaying in dependencies

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => console.error("Playback failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  const totalTime = {
    min: Math.floor(duration / 60),
    sec: Math.floor(duration % 60),
  };

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrTime({ min: Math.floor(time / 60), sec: Math.floor(time % 60) });
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg">
      <div className="playing-song flex flex-col md:flex-row items-center justify-between p-2 w-full max-w-full mx-auto">
        <div className="flex items-center mb-2 md:mb-0">
          <img
            src={song.album?.coverImage || "default-cover-image.jpg"}
            alt="Now playing cover art"
            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg mr-2 md:mr-4"
          />
          <div className="song-details">
            <h3 className="text-sm md:text-lg font-semibold text-white truncate">
              {song.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-400 truncate">
            </p>
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
        value={currTime.min * 60 + currTime.sec}
        className="timeline w-full"
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default PlayingSong;
