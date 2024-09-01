import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import OtpModal from "./OtpModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "./Spinner";
import apiHelper from "../utils/apiHelper";
import { isValidPhoneNumber } from "libphonenumber-js";
import { useSearchParams } from "react-router-dom"; // Import useSearchParams from react-router-dom

const logoPath = process.env.PUBLIC_URL + "/logo1.png";

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone Number is required")
    .test("valid-phone", "Invalid phone number", function (value) {
      return isValidPhoneNumber(value || "");
    }),
  dateOfBirth: Yup.date().required("Date of Birth is required"),
  gender: Yup.string().required("Gender is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  referralCode: Yup.string(), // Referral code is optional
});

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams(); // useSearchParams hook to get URL parameters

  const referralCodeFromUrl = searchParams.get("referralCode") || ""; // Retrieve the referral code from the URL

  const handleSendOtp = async (values) => {
    setIsLoading(true);
    try {
      const { email, phoneNumber } = values;
      const response = await apiHelper("/api/user/generateOtp", "POST", {
        email,
        phoneNumber,
        type: "register",
      });

      if (response.status === 200) {
        setOtpData(values);
        setIsOtpModalOpen(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error(`Error sending OTP: ${response.message}`);
      }
    } catch (error) {
      toast.error(`Error sending OTP: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    await handleSendOtp(values);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gradient-to-r from-gray-900 to-purple-900">
      <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-lg shadow-lg bg-gray-500">
        {/* Left Panel - Registration Form */}
        <div className="w-full md:w-1/2 p-6">
          <img src={logoPath} alt="Warble Logo" className="w-32 h-32 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4 text-black text-center">"Discover, Listen, Enjoy—Join Us Today!"</h1>
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
              referralCode: referralCodeFromUrl, // Prefill referral code from URL
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnChange={true}
          >
            {({ setFieldValue, validateField, isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                {/* Input Fields */}
                {[
                  { name: "firstName", type: "text", placeholder: "First Name" },
                  { name: "lastName", type: "text", placeholder: "Last Name" },
                  { name: "email", type: "email", placeholder: "Email" },
                  { name: "dateOfBirth", type: "date", placeholder: "Date of Birth" },
                ].map(({ name, type, placeholder }) => (
                  <div key={name}>
                    <label className="text-black block mb-2 text-left">
                      {placeholder} *
                    </label>
                    <Field
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      className="border border-gray-300 p-3 rounded text-black w-full"
                      onChange={(e) => {
                        setFieldValue(name, e.target.value);
                        validateField(name);
                      }}
                    />
                    <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
                  </div>
                ))}

                {/* Phone Number Input */}
                <div>
                  <label className="text-black block mb-2 text-left">Phone Number *</label>
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
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-500 mt-1" />
                </div>

                {/* Gender Input */}
                <div>
                  <label className="text-black block mb-2 text-left">Gender *</label>
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
                  <ErrorMessage name="gender" component="div" className="text-red-500 mt-1" />
                </div>

                {/* Password Fields */}
                {[
                  { name: "password", type: "password", placeholder: "Password" },
                  { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
                ].map(({ name, type, placeholder }) => (
                  <div key={name}>
                    <label className="text-black block mb-2 text-left">
                      {placeholder} *
                    </label>
                    <Field
                      type={type}
                      name={name}
                      placeholder={placeholder}
                      className="border border-gray-300 p-3 rounded text-black w-full"
                      onChange={(e) => {
                        setFieldValue(name, e.target.value);
                        validateField(name);
                      }}
                    />
                    <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
                  </div>
                ))}

                {/* Referral Code Input */}
                <div>
                  <label className="text-black block mb-2 text-left">Referral Code</label>
                  <Field
                    type="text"
                    name="referralCode"
                    placeholder="Referral Code (optional)"
                    className="border border-gray-300 p-3 rounded text-black w-full"
                    onChange={(e) => {
                      setFieldValue("referralCode", e.target.value);
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg w-full mt-4"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <span className="text-black">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-600 hover:text-purple-800">
                      Login
                    </a>
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Right Panel - Welcome Message */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center items-center bg-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-black">Welcome to Warble!</h2>
          <p className="text-black text-center mb-6">
            Your journey to discovering amazing music begins here. Create an account and start exploring today!
          </p>
          <a href="/login">
            <button className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl">
              Login
            </button>
          </a>
        </div>
      </div>
      {/* Spinner Component */}
      {isLoading && <Spinner />}
      {/* OTP Modal */}
      {isOtpModalOpen && <OtpModal isOpen={isOtpModalOpen} setIsOpen={setIsOtpModalOpen} otpData={otpData} />}
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Register;
