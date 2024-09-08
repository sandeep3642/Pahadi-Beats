import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { FaBars } from "react-icons/fa";
import apiHelper from "../utils/apiHelper";
import { load } from "@cashfreepayments/cashfree-js";
import Spinner from "./Spinner";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const BuyPlans = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [cashfree, setCashfree] = useState(null);
  const [loading, setLoading] = useState(false);  // State for loading indicator

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdk = await load({ mode: "sandbox" });
        setCashfree(sdk);
      } catch (error) {
        console.error("Error initializing Cashfree SDK:", error);
        toast.error("Failed to load payment gateway. Please try again later.");
      }
    };

    initializeSDK();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);  // Start loading
    try {
      const response = await apiHelper(
        "/api/subscription/getAllSubscription",
        "GET"
      );
      setSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions. Please try again later.");
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const getSessionId = async (subscriptionId) => {
    setLoading(true);  // Start loading
    try {
      const response = await apiHelper("/api/payment/payment", "GET", null, null, { subscriptionId });
      if (response) {
        return {
          sessionId:response?.payment_session_id,
          orderId:response.order_id
        };
      }
    } catch (error) {
      console.error("Error getting session ID:", error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const verifyPayment = async (orderId) => {
    setLoading(true);  // Start loading
    try {
      const res = await apiHelper("/api/payment/verify", "POST", { orderId:orderId });

      if (res) {
        toast.success("Payment completed successfully!");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to verify payment. Please try again.");
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const handleBuySubscription = async (subscriptionId) => {
    if (!cashfree) {
      toast.error("Cashfree SDK not loaded. Please try again later.");
      return;
    }
  
    try {
      const data = await getSessionId(subscriptionId);
      if (data.sessionId) {  
        const checkoutOptions = {
          paymentSessionId: data.sessionId,
          redirectTarget: "_modal",
        };
  
        cashfree
          .checkout(checkoutOptions)
          .then(() => {
            console.log("Payment initialized");
            verifyPayment(data.orderId); // Trigger payment verification after modal closes
          })
          .catch((error) => {
            console.error("Error during checkout:", error);
            toast.error("Payment failed. Please try again.");
          });
      } else {
        toast.error("Failed to get payment session. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 flex flex-col p-4">
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

        {loading && <Spinner />}  {/* Display spinner while loading */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {subscriptions && subscriptions.length > 0 ? (
            subscriptions.map((item, index) => (
              <div
                key={index}
                className={`relative border rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105 ${
                  item.subscriptionStatus === "active"
                    ? "bg-purple-600"
                    : "bg-gray-200"
                }`}
              >
                <h2 className="text-2xl font-semibold text-white">
                  {item.name}
                </h2>
                <p className="text-gray-200 mt-2">{item.description}</p>
                <p className="text-white font-bold mt-4 text-lg">
                  ₹{item.price.toFixed(2)}
                </p>
                <button
                  className="mt-6 bg-white text-purple-600 py-2 px-4 rounded-full hover:bg-purple-700 hover:text-white transition duration-300"
                  onClick={() => handleBuySubscription(item._id)}
                >
                  Buy
                </button>
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

      <ToastContainer /> {/* Toast container to display notifications */}
    </div>
  );
};

export default BuyPlans;
