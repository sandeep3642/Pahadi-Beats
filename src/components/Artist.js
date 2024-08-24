import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";

const Artist = () => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await apiHelper('/api/artist/getAllArtists', 'GET');
        console.log('Fetched data:', data);
        setArtists(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(160px,_1fr))] gap-4">
        {artists.map((artist) => (
          <div
            key={artist._id}
            className="ml-5 bg-[#682828] rounded-lg overflow-hidden transform transition-transform duration-200 hover:scale-105 group"
            role="group"
            aria-labelledby={`card-title-${artist._id}`}
          >
            <div className="relative p-4">
              <div className="relative w-full pb-[100%] bg-[#f1f1f1]">
                <img
                  src={artist.profilePic || "default-cover-image.jpg"}
                  alt="Artist Cover"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 hidden group-hover:block">
                  <button
                    aria-label={`Play ${artist.name}`}
                    className="bg-purple-1000 rounded-full p-2 cursor-pointer hover:bg-purple-700"
                  >
                    <FaPlay className="fill-black  w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <button
                onClick={() => console.log(`Clicked on artist ${artist.name}`)}
                className="text-white text-lg"
                id={`card-title-${artist._id}`}
              >
                {artist.name}
              </button>
              <div className="text-gray-400 text-sm">Artist</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Artist;
