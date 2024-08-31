import React, { useState } from "react";
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [referralCode, setReferralCode] = useState("");

  const handleReferralCodeChange = (e) => {
    setReferralCode(e.target.value);
  };

  const getReferralLink = () => {
    const baseUrl = "https://yourapp.com/register";
    return `${baseUrl}?referralCode=${encodeURIComponent(referralCode)}`;
  };

  const handleShareFacebook = () => {
    const referralLink = getReferralLink();
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      referralLink
    )}`;
    window.open(facebookShareUrl, "_blank");
  };

  const handleShareWhatsApp = () => {
    const referralLink = getReferralLink();
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
      `Join my app using this link: ${referralLink}`
    )}`;
    window.open(whatsappShareUrl, "_blank");
  };

  const handleCopyLink = () => {
    const referralLink = getReferralLink();
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="mb-4">
        <label htmlFor="referralCode" className="block text-sm font-medium text-white-700 mb-2">
          Enter Your Referral Code:
        </label>
        <input
          type="text"
          id="referralCode"
          value={referralCode}
          onChange={handleReferralCodeChange}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleShareFacebook}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <FaFacebook />
          Share on Facebook
        </button>
        <button
          onClick={handleShareWhatsApp}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          <FaWhatsapp />
          Share on WhatsApp
        </button>
        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded"
        >
          <FaInstagram />
          Copy Instagram Link
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Settings;
