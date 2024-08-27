import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import OtpModal from "./OtpModal"; // Import the OTP modal component
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner"; // Import the Spinner component
import apiHelper from "../utils/apiHelper";
import { isValidPhoneNumber } from "libphonenumber-js";

const logoPath = process.env.PUBLIC_URL + "/logo1.png";

// Update the validation schema to use the isValidPhoneNumber function
const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .test(
      "valid-phone",
      "Invalid phone number",
      function (value) {
        return isValidPhoneNumber(value || "");
      }
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

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for spinner

  const handleSendOtp = async (values) => {
    setIsLoading(true); // Show spinner
    try {
      const { email, phoneNumber } = values;

      // Use apiHelper to send OTP
      const response = await apiHelper("/api/user/generateOtp", "POST", {
        email,
        phoneNumber,
        type: "register",
      });

      if (response.status === 200) {
        setOtpData(values);
        setIsOtpModalOpen(true);
        toast.success("OTP sent successfully!"); // Show success toast
      } else {
        toast.error(`Error sending OTP: ${response.message}`); // Show error toast
      }
    } catch (error) {
      toast.error(`Error sending OTP: ${error.message}`); // Show error toast
    } finally {
      setIsLoading(false); // Hide spinner
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await handleSendOtp(values);
    } catch (error) {
      toast.error(`Registration error: ${error.message}`); // Show error toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-grey-900 to-purple-900 min-h-screen flex flex-col justify-center items-center p-4">
      <div className="flex w-full max-w-4xl rounded-lg shadow-lg p-8">
        <div className="w-full">
          <img
            src={logoPath}
            alt="Warble Logo"
            className="w-32 h-32 mx-auto mb-6 rounded-full"
          />
          <h1 className="text-3xl font-bold mb-4 text-white">Sign Up</h1>
          <p className="text-white mb-6">Create your account</p>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              dateOfBirth: "",
              gender: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true} // Ensure validation on change
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
                      value={phoneNumber}
                      onChange={(value) => {
                        setPhoneNumber(value);
                        setFieldValue("phoneNumber", value);
                        validateField("phoneNumber");
                      }}
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

                {/* Password Fields */}
                <div className="flex gap-4">
                  {/* Password Field */}
                  <div className="w-1/2">
                    <label className="text-white block mb-2 text-left">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="border border-gray-300 p-3 rounded text-black w-full"
                      onChange={(e) => {
                        setFieldValue("password", e.target.value);
                        validateField("password");
                      }}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                  {/* Confirm Password Field */}
                  <div className="w-1/2">
                    <label className="text-white block mb-2 text-left">
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="border border-gray-300 p-3 rounded text-black w-full"
                      onChange={(e) => {
                        setFieldValue("confirmPassword", e.target.value);
                        validateField("confirmPassword");
                      }}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 mt-1"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
                >
                  {isSubmitting || isLoading ? "Please wait..." : "Register"}
                </button>

                {/* Link to Login */}
                <div className="text-center mt-4">
                  <span className="text-white">
                    If you already have an account, click on{" "}
                    <a href="/login" className="text-purple-300 underline">
                      Login
                    </a>
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <OtpModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onVerify={() => console.log("Verified")}
          otpData={otpData}
        />
      )}

      {/* Toast notifications */}
      <ToastContainer />

      {/* Spinner */}
      {isLoading && <Spinner />}
    </div>
  );
};

export default Register;
