import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";

const BuyPlans = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch subscription plans from the API
  const fetchSubscriptions = async () => {
    try {
      const response = await apiHelper("/api/subscription/getAllSubscription", "GET");
      setSubscriptions(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Function to handle the buy subscription button click
  const handleBuySubscription = (subscriptionId) => {
    console.log(`Buying subscription with ID: ${subscriptionId}`);
    // Add the logic to handle the subscription purchase here, such as API call to process the purchase
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area */}
      <main className="flex-1 flex flex-col p-4">
        {/* Header with hamburger menu */}
        <header className="bg-black text-white p-4 flex justify-between items-center md:hidden">
          <h1 className="text-xl font-bold">Pahadi Beats</h1>
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <FaBars size={24} />
          </button>
        </header>

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {subscriptions && subscriptions.length > 0 ? (
            subscriptions.map((item, index) => (
              <div
                key={index}
                className={`relative border rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105 ${
                  item.subscriptionStatus === "active" ? "bg-purple-600" : "bg-gray-200"
                }`}
              >
                {/* Subscription Name */}
                <h2 className="text-2xl font-semibold text-white">{item.name}</h2>
                
                {/* Subscription Description */}
                <p className="text-gray-200 mt-2">{item.description}</p>
                
                {/* Subscription Price */}
                <p className="text-white font-bold mt-4 text-lg">₹{item.price.toFixed(2)}</p>
                
                {/* Buy Button */}
                <button
                  className="mt-6 bg-white text-purple-600 py-2 px-4 rounded-full hover:bg-purple-700 hover:text-white transition duration-300"
                  onClick={() => handleBuySubscription(item._id)}
                >
                  Buy
                </button>
                
                {/* Number of Days in Red Circle */}
                <div className="absolute bottom-4 right-4 bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                  {item.days}
                </div>
              </div>
            ))
          ) : (
            <p className="text-white">No subscription plans available.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default BuyPlans;
