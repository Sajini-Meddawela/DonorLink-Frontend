import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import emailConfirmed from "../Assets/verification code.svg";
import logo from "../Assets/donorlink_logo.png";

const PasswordRecovered: React.FC = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const { email, token } = useParams<{ email: string; token: string }>();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/auth/${email}/verify/${token}`
        );
        console.log(response.status);
        setIsVerified(true);
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };

    verifyEmail();
  }, [email, token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen bg-gray-100">
      {/* Left Side - Logo */}
      <div className="flex items-center justify-center bg-[#63C6F7]">
        <img
          src={logo}
          alt="DonorLink Logo"
          className="w-[60%] h-auto object-cover"
        />
      </div>

      {/* Right Side - Password Recovery Confirmation */}
      <div className="flex flex-col justify-center items-center px-12 md:px-20 bg-white">
        {isVerified ? (
          <>
            <h1 className="text-4xl font-bold text-[#5CB85C] text-center mb-4">
              Password Recovered Successfully!
            </h1>

            <img
              src={emailConfirmed}
              alt="Verified"
              className="w-[50%] h-auto object-cover mb-4"
            />

            <p className="text-lg text-gray-600 text-center mb-4">
              Your password has been successfully updated.
            </p>

            <Link to="/login">
              <button className="rounded-lg bg-[#562595] py-2 px-6 text-md font-medium uppercase text-white transition duration-200 hover:bg-[#441c71]">
                Login
              </button>
            </Link>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-red-500 text-center">
            Verification failed. Please try again.
          </h1>
        )}
      </div>
    </div>
  );
};

export default PasswordRecovered;
