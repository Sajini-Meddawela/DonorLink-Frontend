import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import logo from "../Assets/donorlink_logo.png";
import VerifyCode from "../Assets/verification code.svg";
import axios from "axios";
import Swal from "sweetalert2";

interface LocationState {
  email: string;
}

const PasswordVerify: React.FC = () => {
  const [message, setMessage] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 
  const [otpValue, setOtpValue] = useState("");

  const email = (location.state as LocationState)?.email || "";

    useEffect(() => {
    if (email.length > 0) {
      const atIndex = email.indexOf("@");
      if (atIndex > 0) {
        const username = email.substring(0, atIndex);
        const domain = email.substring(atIndex);
        const maskedUsername = username.substring(0, 4) + '*'.repeat(Math.max(0, username.length - 4));
        setEmailHint(`${maskedUsername}${domain}`);
      } else {
        setEmailHint(email.substring(0, 4) + '*'.repeat(Math.max(0, email.length - 4)));
      }
    } else {
      setEmailHint("");
    }
  }, [email]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:4000/api/v1/auth/verify-otp",
      { email, otp: otpValue }
    );
    
    navigate(`/reset-password/${email}`, {
      state: {
        resetToken: response.data.resetToken 
      }
    });
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Failed to verify OTP",
    });
  }
};

  return (
    <div className="flex h-screen bg-[#87CEEB]">
      <div className="w-2/5 bg-[#87CEEB] flex items-center justify-center">
        <img
          src={VerifyCode}
          alt="Forgot password"
          className="w-[70%] h-auto object-cover"
        />
      </div>
      <div className="w-3/5 bg-white p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold text-[#63C6F7] mb-14">
            Reset Password Verification
          </h2>
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Donor Link Logo" className="h-55 w-auto" />
          </div>
          <p className="mb-4 text-[#85C536]">
            {emailHint
              ? `Enter your email starting with ${emailHint} to continue`
              : "Enter your email to continue"}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block font-bold text-[#63C6F7] mb-2"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#63C6F7] focus:border-[#63C6F7]"
                placeholder="Enter 6-digit code"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#85C536] text-white py-2 px-4 rounded-[30px] hover:bg-[#85C536] transition duration-300"
            >
              Verify Code
            </button>
          </form>
          {message && <p className="mt-4 text-green-600 text-sm">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default PasswordVerify;