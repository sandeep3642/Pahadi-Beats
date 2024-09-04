import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiHelper from "../utils/apiHelper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";
import { useDispatch, useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { fetchProfile } from "../redux/profileSlice";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { FaPencilAlt } from "react-icons/fa";

const avatar = process.env.PUBLIC_URL + "/avatar.png";

// Update the validation schema for the profile form
const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .test("is-valid-phone", "Invalid phone number", (value) =>
      Boolean(value && value.length > 8)
    ),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  // const [isLoading, setIsLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(
    profile?.profilePic
  );

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > 800) {
              height = Math.round((height * 800) / width);
              width = 800;
            }
          } else {
            if (height > 800) {
              width = Math.round((width * 800) / height);
              height = 800;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            },
            "image/jpeg",
            0.7
          ); // Adjust quality here (0.7 = 70% quality)
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    const changedValues = {};
    Object.keys(values).forEach((key) => {
      if (key === "profilePic") {
        // Compare the profilePic preview with the original profilePic URL
        if (profilePicPreview !== profile.profilePic) {
          changedValues[key] = values[key];
        }
      } else if (values[key] !== profile[key]) {
        changedValues[key] = values[key];
      }
    });

    if (Object.keys(changedValues).length === 0) {
      toast.info("No changes to update.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    for (const key in changedValues) {
      if (key === "profilePic" && changedValues[key]) {
        const resizedImage = await resizeImage(changedValues[key]);
        formData.append(key, resizedImage);
      } else {
        formData.append(key, changedValues[key]);
      }
    }

    try {
      const headers = {
        "Content-Type": "multipart/form-data",
      };

      const response = await apiHelper(
        "/api/user/update",
        "POST",
        formData,
        headers
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        // Update the profilePicPreview state with the new profile picture URL
        setProfilePicPreview(profile.profilePic);
      } else {
        toast.error(`Error updating profile: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <section className="flex-1 bg-purple-1000 p-4 md:p-6 text-white">
        <Header />
        <div className="bg-gradient-to-r from-grey-900 to-purple-900 min-h-screen flex flex-col justify-center items-center p-2 md:p-4">
          <div className="w-full max-w-4xl rounded-lg shadow-lg p-4 md:p-8">
            <div className="w-full">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white text-center md:text-left">
                Edit Profile
              </h1>
              {loading ? (
                <Spinner />
              ) : (
                <Formik
                  initialValues={{
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    email: profile.email || "",
                    phoneNumber: profile.phoneNumber || "",
                    dateOfBirth: profile.dateOfBirth || "",
                    gender: profile.gender || "",
                    profilePic: profile.profilePic || "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ setFieldValue, validateField, isSubmitting }) => (
                    <Form className="flex flex-col gap-4 md:gap-6">
                      {/* Profile Picture Upload */}
                      <div className="flex flex-col items-center mb-6">
                        <label className="text-white block mb-2 text-left">
                          Profile Picture
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            name="profilePic"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              const resizedFile = await resizeImage(file);
                              setFieldValue("profilePic", resizedFile);
                              setProfilePicPreview(
                                URL.createObjectURL(resizedFile)
                              );
                            }}
                            className="text-white"
                            style={{ display: "none" }}
                            id="profilePicInput"
                          />
                          {profilePicPreview ? (
                            <img
                              src={profilePicPreview}
                              alt="Profile Preview"
                              className="mt-4 w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                            />
                          ) : (
                            <img
                              src={avatar}
                              alt="Default Avatar"
                              className="mt-4 w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                            />
                          )}
                          <FaPencilAlt
                            onClick={() =>
                              document.getElementById("profilePicInput").click()
                            }
                            className="absolute bottom-0 right-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* First Name Field */}
                        <div className="w-full md:w-1/2">
                          <label className="text-white block mb-2 text-left">
                            First Name
                          </label>
                          <Field
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="border border-gray-300 p-3 rounded text-black w-full"
                            onChange={(e) => {
                              setFieldValue("firstName", e.target.value);
                              validateField("firstName");
                            }}
                          />
                          <ErrorMessage
                            name="firstName"
                            component="div"
                            className="text-red-500 mt-1"
                          />
                        </div>
                        {/* Last Name Field */}
                        <div className="w-full md:w-1/2">
                          <label className="text-white block mb-2 text-left">
                            Last Name
                          </label>
                          <Field
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="border border-gray-300 p-3 rounded text-black w-full"
                            onChange={(e) => {
                              setFieldValue("lastName", e.target.value);
                              validateField("lastName");
                            }}
                          />
                          <ErrorMessage
                            name="lastName"
                            component="div"
                            className="text-red-500 mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Email Field */}
                        <div className="w-full md:w-1/2">
                          <label className="text-white block mb-2 text-left">
                            Email
                          </label>
                          <Field
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="border border-gray-300 p-3 rounded text-black w-full"
                            onChange={(e) => {
                              setFieldValue("email", e.target.value);
                              validateField("email");
                            }}
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 mt-1"
                          />
                        </div>

                        {/* Phone Number Field */}
                        <div className="w-full md:w-1/2">
                          <label className="text-white block mb-2 text-left">
                            Phone Number
                          </label>
                          <Field name="phoneNumber">
                            {({ field, form }) => (
                              <PhoneInput
                                placeholder="Phone Number"
                                className="border border-gray-300 p-3 rounded text-black w-full"
                                {...field}
                                onChange={(value) => {
                                  form.setFieldValue("phoneNumber", value);
                                  validateField("phoneNumber");
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="text-red-500 mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Date of Birth Field */}
                        <div className="w-full md:w-1/2">
                          <label className="text-white block mb-2 text-left">
                            Date of Birth
                          </label>
                          <Field
                            type="date"
                            name="dateOfBirth"
                            className="border border-gray-300 p-3 rounded text-black w-full"
                            onChange={(e) => {
                              setFieldValue("dateOfBirth", e.target.value);
                              validateField("dateOfBirth");
                            }}
                          />
                          <ErrorMessage
                            name="dateOfBirth"
                            component="div"
                            className="text-red-500 mt-1"
                          />
                        </div>
                        {/* Gender Field */}
                        <div className="w-full md:w-1/2">
                          <label className="text-white block mb-2 text-left">
                            Gender
                          </label>
                          <Field
                            as="select"
                            name="gender"
                            className="border border-gray-300 p-3 rounded text-black w-full"
                            onChange={(e) => {
                              setFieldValue("gender", e.target.value);
                              validateField("gender");
                            }}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="text-red-500 mt-1"
                          />
                        </div>
                      </div>

                      {/* Update Profile Button */}
                      <button
                        type="submit"
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                        disabled={isSubmitting}
                      >
                        Update Profile
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Profile;
