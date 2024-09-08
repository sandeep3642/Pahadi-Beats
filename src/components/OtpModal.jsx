import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner"; // Import the Spinner component
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import the toastify CSS
import apiHelper from "../utils/apiHelper"; // Import the apiHelper function

const OtpModal = ({ isOpen, onClose, otpData }) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const navigate = useNavigate();

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true); // Show spinner
    try {
      // Use apiHelper to verify OTP
      const response = await apiHelper("/api/user/verifyOtp", "PUT", {
        otp,
        email: otpData.email,
        phoneNumber: otpData.phoneNumber,
        type: "register",
      });

      if (response.status === 200) {
        console.log("OTP verified successfully!");
        try {
          // Use apiHelper to register the user
          const registerResponse = await apiHelper(
            "/api/user/register",
            "POST",
            {
              email: otpData.email,
              phoneNumber: otpData.phoneNumber,
              password: otpData.password,
              firstName: otpData.firstName,
              lastName: otpData.lastName,
              dateOfBirth: otpData.dateOfBirth,
              gender: otpData.gender,
              referralCode:otpData.referralCode
            }
          );

          if (registerResponse.status === 200) {
            toast.success("Registration successful!"); // Success toast
            navigate("/login");
          } else {
            toast.error(`Registration failed: ${registerResponse.message}`); // Error toast
          }
        } catch (error) {
          console.error("Registration error:", error);
          toast.error("Registration failed. Please try again."); // Error toast
        } finally {
          onClose();
        }
      } else {
        toast.error(`OTP verification failed: ${response.message}`); // Error toast
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Error verifying OTP. Please try again."); // Error toast
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full mx-4 sm:mx-auto"> {/* Adjust padding for smaller screens */}
        <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
          OTP Verification
        </h1>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          placeholder="Enter OTP"
          className="border border-gray-300 p-3 rounded text-black w-full mb-3 md:mb-4"
        />
        <button
          onClick={handleVerifyOtp}
          className="bg-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg w-full"
        >
          Verify OTP
        </button>
        <button
          onClick={onClose}
          className="mt-3 md:mt-4 text-purple-600 underline w-full text-center"
        >
          Cancel
        </button>
        {isLoading && <Spinner />} {/* Show spinner when loading */}
      </div>
    </div>
  );
};

export default OtpModal;
