import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiHelper from "../utils/apiHelper";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FaFacebook, FaInstagram, FaPlay, FaTwitter } from "react-icons/fa";

const AboutArtist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allAlbums, setAllAlbums] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const data = await apiHelper(`/api/artist/getArtist/${id}`, "GET");
        setArtist(data.data.artist);
        setAllSongs(data.data.allSongs);
        setAllAlbums(data.data.allAlbum);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch artist data.");
        setLoading(false);
      }
    };

    if (id) {
      fetchArtist();
    }
  }, [id]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-5">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <section className="flex-1  p-6 text-white">
        <Header />
        <div className="flex items-start gap-10 mb-4">
          {/* Artist Profile Section */}
          <div className="flex flex-col items-center">
            {artist.profilePic ? (
              <img
                src={artist.profilePic}
                alt={artist.name}
                className="w-40 h-40 rounded-full shadow-lg mb-4"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <h1 className="font-bold text-2xl mt-4">{artist.name}</h1>
          </div>

          {/* Artist Description Section */}
          <div className="bg-purple-800 p-6 rounded-lg shadow-lg max-w-lg">
            {artist && (
              <>
                <p className="mt-4 text-white">
                  {showMore ? artist.about : `${artist.about.slice(0, 150)}...`}
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-blue-400 ml-2 hover:underline"
                  >
                    {showMore ? "Show Less" : "Show More"}
                  </button>
                </p>

                {/* Social Media Links */}
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Follow on Social</h2>
                  <div className="flex space-x-4">
                    {artist.instagram && (
                      <a
                        href={artist.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-600"
                      >
                        <FaInstagram size={24}  />
                      </a>
                    )}
                    {artist.facebook && (
                      <a
                        href={artist.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <FaFacebook size={24} />
                      </a>
                    )}
                    {artist.twitter && (
                      <a
                        href={artist.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-500"
                      >
                        <FaTwitter size={24} />
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Album Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allAlbums.map((album) => (
              <div key={album._id} className="relative group">
                <Link to={`/about-album/${album._id}`}>
                  <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={album.coverImage || "default-cover-image.jpg"}
                      alt={`Album ${album.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-bold">{album.title}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Song Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Songs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allSongs.map((song) => (
              <div key={song._id} className="relative group">
                <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={song.album.coverImage || "default-cover-image.jpg"}
                    alt={`Song ${song.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    aria-label={`Play ${song.title}`}
                    className="bg-purple-700 rounded-full p-2 cursor-pointer hover:bg-purple-600"
                  >
                    <FaPlay className="fill-white w-6 h-6" />
                  </button>
                  <span className="text-white mt-2 text-center">{song.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutArtist;
