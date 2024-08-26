import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiHelper from "../utils/apiHelper";

const HomeSongs = () => {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await apiHelper("/api/song/getAllSongs", "GET");
        setSongs(data.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const handlePlaySong = (song) => {
    navigate("/playing-song", { state: { song } });
  };

  return (
    <>
      <div className="flex overflow-x-auto whitespace-nowrap gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="min-w-[160px] max-w-xs ml-5 bg-[#682828] rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group relative flex-shrink-0"
            role="group"
            aria-labelledby={`card-title-${song._id}`}
          >
            <div className="relative p-4">
              <div className="relative w-full pb-[100%] bg-[#f1f1f1]">
                <img
                  src={song.album.coverImage || "default-cover-image.jpg"}
                  alt="Album Cover"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 hidden group-hover:block">
                  <button
                    aria-label={`Play ${song.title}`}
                    className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
                    onClick={() => handlePlaySong(song)}
                  >
                    <FaPlay className="fill-black w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <button
                className="text-white text-lg"
                id={`card-title-${song._id}`}
                onClick={() => handlePlaySong(song)}
              >
                {song.title}
              </button>
              <div className="text-gray-400 text-sm">Song</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default HomeSongs;
