import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To fetch route parameters
import apiHelper from "../utils/apiHelper";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AboutArtist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        console.log(id, ">>>>>>>>>");

        const data = await apiHelper(`/api/artist/getArtist/${id}`, "GET"); // Corrected API call
        console.log("Fetched data:", data);
        setArtist(data.data);
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
  if (error)
    return <div className="text-center text-red-500 py-5">{error}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <section className="flex-1 bg-purple-1000 p-6 text-white">
        <Header />
        <div className="mx-auto rounded-lg shadow-lg">
          {artist && (
            <>
              <div className="flex items-center space-x-4">
                {artist.profilePic ? (
                  <img
                    src={artist.profilePic}
                    alt={artist.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                <h1 className="text-xl font-bold">{artist.name}</h1>
              </div>
              <p className="mt-4 text-white">{artist.about}</p>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Social Media</h2>
                <ul className="space-y-2">
                  {artist.instagram && (
                    <li>
                      <a
                        href={artist.instagram}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </li>
                  )}
                  {artist.facebook && (
                    <li>
                      <a
                        href={artist.facebook}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Facebook
                      </a>
                    </li>
                  )}
                  {artist.twitter && (
                    <li>
                      <a
                        href={artist.twitter}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Twitter
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutArtist;
