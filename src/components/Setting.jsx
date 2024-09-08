import React, { useEffect, useState } from "react";
import { FaFacebook, FaWhatsapp, FaInstagram, FaBars } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiHelper from "../utils/apiHelper"; // Adjust the path based on your folder structure

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const [subscriptions, setMySubscriptions] = useState([]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await apiHelper(
          "/api/subscription/getUserSubscription",
          "GET"
        );
        if (response.status === 200) {
          setMySubscriptions(response.data);
        } else {
          toast.error(response.data.error || "Failed to fetch subscriptions.");
        }
      } catch (error) {
        toast.error(error.response?.data?.error || "An error occurred.");
      }
    };
    fetchSubscriptions();
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getReferralLink = () => {
    const baseUrl = window.location.origin;
    const referralCode = profile?.myReferralCode || "";
    return `${baseUrl}/register/?referralCode=${encodeURIComponent(
      referralCode
    )}`;
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

  // Formik validation schema using Yup
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(6, "Old password must be at least 6 characters long")
      .required("Old password is required"),
    newPassword: Yup.string()
      .min(6, "New password must be at least 6 characters long")
      .required("New password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Function to handle password change API call
  const handlePasswordChange = async (oldPassword, newPassword) => {
    try {
      const response = await apiHelper(
        "/api/user/changePassword",
        "POST",
        { oldPassword, newPassword } // Ensure this object is correct
      );

      if (response.status === 200) {
        toast.success("Password updated successfully!");
      } else {
        toast.error(response.data.error || "Failed to update password.");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred.");
    }
  };
  const handleSubmitPasswordChange = (values, { resetForm }) => {
    const { oldPassword, newPassword } = values;
    console.log(values);
    handlePasswordChange(oldPassword, newPassword);
    resetForm();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-purple-1000">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 flex flex-col">
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

        <div className="flex-1 p-4 sm:p-6 text-white">
          <Header />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white text-black p-4 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4">Exciting Prize!</h2>
              <p className="text-xl font-bold mb-4">
                Refer a friend and get 20 MB of free space for each referral.
              </p>
              <div className="mb-4">
                <label
                  htmlFor="myReferralCode"
                  className="block text-sm font-medium mb-2"
                >
                  Your Referral Code:
                </label>
                <input
                  disabled
                  id="myReferralCode"
                  value={profile?.myReferralCode || ""}
                  className="bg-gray-200 border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={handleShareFacebook}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  <FaFacebook />
                  Share on Facebook
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  <FaWhatsapp />
                  Share on WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 bg-purple-500 text-white px-4 py-2 rounded"
                >
                  <FaInstagram />
                  Copy Link
                </button>
              </div>
            </div>

            {/* Password Update Section with Formik */}
            <div className="bg-white text-black p-4 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4">Update Password</h2>
              <Formik
                initialValues={{
                  oldPassword: "",
                  newPassword: "",
                  confirmNewPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmitPasswordChange}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label
                        htmlFor="oldPassword"
                        className="block text-sm font-medium mb-2"
                      >
                        Old Password
                      </label>
                      <Field
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                      <ErrorMessage
                        name="oldPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium mb-2"
                      >
                        New Password
                      </label>
                      <Field
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="confirmNewPassword"
                        className="block text-sm font-medium mb-2"
                      >
                        Confirm New Password
                      </label>
                      <Field
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        className="border border-gray-300 rounded p-2 w-full"
                      />
                      <ErrorMessage
                        name="confirmNewPassword"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-purple-600 text-white px-4 py-2 rounded w-full"
                      disabled={isSubmitting}
                    >
                      Update Password
                    </button>
                  </Form>
                )}
              </Formik>
            </div>

            {/* My Subscription Section */}
            <div className="bg-white text-black p-4 rounded shadow-md md:col-span-2">
              <h2 className="text-xl font-bold mb-4">My Subscription</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subscription Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subscriptions.length > 0 ? (
                      subscriptions.map((subscription) => (
                        <tr key={subscription._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {subscription.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {subscription.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{subscription.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(
                              subscription.startDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(
                              subscription.endDate
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                subscription.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {subscription.status.charAt(0).toUpperCase() +
                                subscription.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                        >
                          No subscriptions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer />
    </div>
  );
};

export default Settings;
