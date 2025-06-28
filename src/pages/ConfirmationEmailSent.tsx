import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../Assets/donorlink_logo.png";
import emailConfirm from "../Assets/carehome_login.png";
import { CheckCircle } from "lucide-react";

const ConfirmationEmailSent = () => {
  const params = useParams();
  const navigate = useNavigate();

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
        <div className="bg-green-100 rounded-full p-4 mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-[#63C6F7] mb-4">
          Confirmation Email Sent
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          We've sent a confirmation email to <br />
          <span className="font-bold text-[#85C536]">{params.email}</span>
        </p>
        
        <p className="text-gray-500 mb-8">
          Please check your inbox and verify your email to complete registration.
        </p>
        
        <button
          onClick={() => navigate("/donorlogin")}
          className="bg-[#85C536] text-white py-3 px-8 rounded-[30px] hover:bg-[#6da02c] transition duration-300 shadow-md"
        >
          Go to Login
        </button>
        
        <img 
          src={logo} 
          alt="DonorLink Logo" 
          className="w-32 mt-10 opacity-90" 
        />
      </div>
    </div>
  );
};

export default ConfirmationEmailSent;