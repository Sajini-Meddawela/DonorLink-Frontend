import React from "react";
import logo from "../Assets/donorlink_logo.png";
import emailConfirm from "../Assets/carehome_login.png";
import { useParams } from "react-router-dom";

const ConfirmationEmailSent = () => {
  const params = useParams();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Side - Image Section */}
      <div className="bg-[#87CEEB] flex items-center justify-center">
        <img
          src={emailConfirm}
          alt="Email Confirmation"
          className="w-[70%] h-auto object-cover"
        />
      </div>

      {/* Right Side - Content Section */}
      <div className="flex flex-col items-center justify-center bg-white p-8 text-center">
        <h1 className="text-4xl font-bold text-[#63C6F7] mb-4">
          Confirmation Email Sent
        </h1>
        <p className="text-lg text-[#5CB85C]">
          We've sent a confirmation email to <br />
          <span className="font-bold">{params.email}</span>
        </p>
        <img src={logo} alt="DonorLink Logo" className="w-32 mt-6" />
      </div>
    </div>
  );
};

export default ConfirmationEmailSent;
