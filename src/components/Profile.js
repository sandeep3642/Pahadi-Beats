import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import apiHelper from "../utils/apiHelper";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner"; // Import the Spinner component
import { useDispatch, useSelector } from "react-redux";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { fetchProfile } from "../redux/profileSlice";
import Sidebar from "./Sidebar";
import Header from "./Header";

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
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const [isLoading, setIsLoading] = useState(false); // State for spinner

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true); // Show spinner
    try {
      // Use apiHelper to update user profile
      const response = await apiHelper(
        "/api/user/update",
        "POST",
        values
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!"); // Show success toast
      } else {
        toast.error(`Error updating profile: ${response.message}`); // Show error toast
      }
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`); // Show error toast
    } finally {
      setIsLoading(false); // Hide spinner
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <section className="flex-1 bg-purple-1000 p-6 text-white">
        <Header />
        <div className="bg-gradient-to-r from-grey-900 to-purple-900 min-h-screen flex flex-col justify-center items-center p-4">
          <div className="flex w-full max-w-4xl rounded-lg shadow-lg p-8">
            <div className="w-full">
              <h1 className="text-3xl font-bold mb-4 text-white">
                Edit Profile
              </h1>
              <p className="text-white mb-6">Update your profile information</p>
              {loading ? (
                <Spinner /> // Show spinner while loading profile data
              ) : (
                <Formik
                  initialValues={{
                    firstName: profile?.firstName || "",
                    lastName: profile?.lastName || "",
                    email: profile?.email || "",
                    phoneNumber: profile?.phoneNumber || "",
                    dateOfBirth: profile?.dateOfBirth || "",
                    gender: profile?.gender || "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize // Ensures the form is updated with new initialValues when profile changes
                >
                  {({ setFieldValue, validateField, isSubmitting }) => (
                    <Form className="flex flex-col gap-6">
                      {/* Form Fields */}
                      <div className="flex gap-4">
                        {/* First Name Field */}
                        <div className="w-1/2">
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
                        <div className="w-1/2">
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

                      <div className="flex gap-4">
                        {/* Email Field */}
                        <div className="w-1/2">
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
                        <div className="w-1/2">
                          <label className="text-white block mb-2 text-left">
                            Phone Number
                          </label>
                          <PhoneInput
                            international
                            defaultCountry="IN"
                            value={profile?.phoneNumber || ""}
                            onChange={(value) =>
                              setFieldValue("phoneNumber", value)
                            }
                            className="border border-gray-300 p-3 rounded text-black w-full"
                          />
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="text-red-500 mt-1"
                          />
                        </div>
                      </div>

                      {/* Additional Fields */}
                      <div className="flex gap-4">
                        {/* Date of Birth Field */}
                        <div className="w-1/2">
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
                        <div className="w-1/2">
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

                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                          disabled={isSubmitting || isLoading}
                        >
                          {isSubmitting || isLoading
                            ? "Updating..."
                            : "Update Profile"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              )}
              <ToastContainer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
