import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import Sidebar from "./Sidebar";
import Spinner from "./Spinner";
import apiHelper from "../utils/apiHelper";

const AllSongs = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const data = await apiHelper(`/api/song/getAllSongs?pageNumber=${currentPage}&pageSize=${pageSize}`, 'GET');
        setSongs(data.data);
        setTotalPages(Math.ceil(data.pagination.totalSongs / pageSize));
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlaylist = async () => {
      try {
        const data = await apiHelper('/api/playlist/getPlaylist', 'GET');
        setPlaylist(data.playlist);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchSongs();
    fetchPlaylist();
  }, [currentPage]);

  const handlePlaySong = (song) => {
    navigate("/playing-song", { state: { song, playlist, currentSongIndex: songs.findIndex(s => s._id === song._id) } });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex">
          <Sidebar />
          <section className="flex-1 bg-purple-1000 p-6 text-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="text-white">
                  <tr>
                    <th className="py-2 px-4 text-left"></th>
                    <th className="py-2 px-4 text-left">Title</th>
                    <th className="py-2 px-4 text-center">Album Name</th>
                    <th className="py-2 px-4 text-center">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {songs.map((song, index) => (
                    <tr key={song._id} className="hover:bg-gray-800">
                      <td className="py-2 px-4 text-white">{index + 1}</td>
                      <td className="py-2 px-4 text-white flex items-center">
                        <img
                          src={song.album.coverImage || "default-cover-image.jpg"}
                          alt="Album Cover"
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        {song.title}
                        <button
                          aria-label={`Play ${song.title}`}
                          className="ml-4 text-purple-400 hover:text-purple-600"
                          onClick={() => handlePlaySong(song)}
                        >
                          <FaPlay className="inline w-5 h-5" />
                        </button>
                      </td>
                      <td className="py-2 px-4 text-gray-400">
                        {song.album.title}
                      </td>
                      <td className="py-2 px-4 text-gray-400">
                        {song.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-900 disabled:opacity-50"
              >
                <IoMdArrowRoundBack />
              </button>
              <span className="bg-purple-1000 text-white py-2 px-4 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-900 disabled:opacity-50"
              >
                <IoMdArrowRoundForward />
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default AllSongs;
