import React, { useState, useEffect, useCallback } from "react";
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from "react-icons/fa";

let globalAudio = new Audio(); // Persist audio instance globally

const PlayingSong = ({ currentSong, songIndex, playlist, isPlaying, onChangeSong, onPlayPause }) => {
  const [currTime, setCurrTime] = useState({ min: 0, sec: 0 });
  const [duration, setDuration] = useState(0);

  console.log("playlist",playlist,songIndex);
  

  const handlePrevious = useCallback(() => {
    if (songIndex===null || songIndex===undefined) return;
    const newIndex = (songIndex - 1 + playlist.length) % playlist.length;
    onChangeSong(newIndex);
  }, [songIndex, playlist.length, onChangeSong]);

  const handleNext = useCallback(() => {
    if (songIndex===null || songIndex===undefined) return;
    const newIndex = (songIndex + 1) % playlist.length;
    onChangeSong(newIndex);
  }, [songIndex, playlist.length, onChangeSong]);

  useEffect(() => {
    if (!currentSong) return;

    console.log("currentSong",currentSong);
    

    // If a new song is selected, update the source
    if (globalAudio.src !== currentSong?.songUrl) {
      globalAudio.pause();
      globalAudio.src = currentSong?.songUrl;
      globalAudio.load(); // Reload new source
    }

    const setAudioData = () => {
      setDuration(globalAudio.duration);
      setCurrTime({ min: 0, sec: 0 });
    };

    const setAudioTime = () => {
      setCurrTime({
        min: Math.floor(globalAudio.currentTime / 60),
        sec: Math.floor(globalAudio.currentTime % 60),
      });
    };

    const handleEnded = () => {
      handleNext();
    };

    globalAudio.addEventListener("loadedmetadata", setAudioData);
    globalAudio.addEventListener("timeupdate", setAudioTime);
    globalAudio.addEventListener("ended", handleEnded);

    if (isPlaying) {
      globalAudio.play().catch((error) => console.error("Playback error:", error));
    } else {
      globalAudio.pause();
    }

    return () => {
      globalAudio.removeEventListener("loadedmetadata", setAudioData);
      globalAudio.removeEventListener("timeupdate", setAudioTime);
      globalAudio.removeEventListener("ended", handleEnded);
    };
  }, [currentSong, handleNext, isPlaying]);

  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    globalAudio.currentTime = time;
    setCurrTime({ min: Math.floor(time / 60), sec: Math.floor(time % 60) });
  };

  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div className="bg-gray-800 shadow-lg">
      <div className="playing-song flex flex-col md:flex-row items-center justify-between p-2 w-full max-w-full mx-auto">
        <div className="flex items-center mb-2 md:mb-0">
          <img
            src={currentSong?.album?.coverImage || currentSong?.coverImage}
            alt="Now playing cover art"
            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg mr-2 md:mr-4"
          />
          <div className="song-details">
            <h3 className="text-sm md:text-lg font-semibold text-white truncate">
              {currentSong?.title}
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
            {isPlaying ? <FaPause className="w-4 h-4 md:w-6 md:h-6" /> : <FaPlay className="w-4 h-4 md:w-6 md:h-6" />}
          </button>
          <button onClick={handleNext} className="control-button text-white">
            <FaStepForward className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="time-display text-white flex items-center text-xs md:text-sm mt-2 md:mt-0">
          <span>{`${formatTime(currTime.min)}:${formatTime(currTime.sec)} / ${formatTime(
            Math.floor(duration / 60)
          )}:${formatTime(Math.floor(duration % 60))}`}</span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={duration}
        value={globalAudio.currentTime || 0}
        className="timeline w-full"
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default PlayingSong;
