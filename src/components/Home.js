import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Songs from "./Songs";
import Artist from "./Artist";
import Album from "./Album";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex">
      <Sidebar/>
      <section className="flex-1 bg-purple-1000 p-6 text-white">
        <Header />
        <div className="mt-6 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Popular Songs</h2>
          <Link to="/allsongs" className="text-purple-500 hover:underline">Show all</Link>
        </div>
        <Songs />
        
        <div className="mt-6 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Popular Artist</h2>
          <Link to="/allartists" className="text-purple-500 hover:underline">
            Show all
          </Link>
        </div>
        <Artist/>
        
        <div className="mt-6 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Popular Album</h2>
          <Link to="/allalbums" className="text-purple-500 hover:underline">
            Show all
          </Link>
        </div>
        <Album/>
        <Footer />
      </section>
    </div>
  );
};

export default Home;
