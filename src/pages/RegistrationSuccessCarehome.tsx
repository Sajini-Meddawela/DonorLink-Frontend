import React from "react";
import { useParams, Link } from "react-router-dom";
import logo from "../Assets/donorlink_logo.png";
import bg from "../Assets/carehome_login.png";

const RegistrationSuccessCareHome: React.FC = () => {
  const params = useParams<Record<string, string | undefined>>();
  const email = params.email ?? "sajinimeddawela@gmail.com"; // Default email

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Section - Image */}
      <div className="hidden md:flex justify-center items-center bg-[#9dd6f9]">
        <img src={bg} alt="Care Home Nurse with Elderly" className="max-h-[85%] object-contain" />
      </div>

      {/* Right Section - Content */}
      <div className="flex flex-col justify-center items-center text-center px-8">
        <h1 className="text-3xl font-bold text-[#63C6F7] mb-6">Account Created Successfully</h1>
        <img src={logo} alt="DonorLink Logo" className="w-52 mb-6" />

        <p className="text-md text-gray-600 mb-4">
          Your Email is{" "}
          <span className="text-lg font-semibold text-[#85C536]">{email}</span>
        </p>

        <Link to="/carelogin">
          <button
            type="button"
            className="rounded-3xl bg-[#85C536] px-8 py-2 text-md font-medium uppercase text-white shadow-md hover:bg-[#6da02c] transition duration-300"
          >
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegistrationSuccessCareHome;
