import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import logo from "../Assets/donorlink_logo.png";
import verificationImage from "../Assets/carehome_login.png";
import { Check, X } from "lucide-react";

const EmailVerificationPage: React.FC = () => {
  const { email: paramEmail, token: paramToken } = useParams<{
    email: string;
    token: string;
  }>();
  const [searchParams] = useSearchParams();
  const queryEmail = searchParams.get("email");
  const queryToken = searchParams.get("token");

  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");

  // Determine which values to use
  const email = paramEmail || queryEmail;
  const token = paramToken || queryToken;

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!email || !token) {
          throw new Error("Invalid verification link");
        }

        // URL encode email to handle special characters
        const encodedEmail = encodeURIComponent(email);
        const response = await axios.get(
          `http://localhost:4000/api/v1/auth/verify/${encodedEmail}/${token}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          await Swal.fire({
            icon: "success",
            title: "Verified!",
            text: response.data.message,
            timer: 2000,
          });
          navigate(
            response.data.role === "DONOR" ? "/donorlogin" : "/carelogin"
          );
        } else {
          throw new Error(response.data.message || "Verification failed");
        }
      } catch (error: any) {
        await Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: error.response?.data?.message || error.message,
        });
        navigate("/");
      }
    };

    verifyEmail();
  }, [email, token, navigate]);
  return (
    <div className="flex h-screen">
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img
          src={verificationImage}
          alt="Email Verification"
          className="w-[70%] h-auto object-cover"
        />
      </div>
      <div className="w-[60%] flex flex-col items-center justify-center bg-white p-8 text-center">
        {status === "verifying" && (
          <>
            <h1 className="text-3xl font-bold text-[#63C6F7] mb-4">
              Verifying Your Email...
            </h1>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#63C6F7] mb-4"></div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <Check className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">Success!</h1>
            <p className="text-lg text-gray-600 mb-6">{message}</p>
            <p className="text-gray-500">
              You will be redirected to login shortly...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="bg-red-100 rounded-full p-4 mb-4">
              <X className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-red-600 mb-2">
              Verification Failed
            </h1>
            <p className="text-lg text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-[#85C536] text-white py-2 px-6 rounded-[30px] hover:bg-[#6fa32e] transition duration-300"
            >
              Go to Home
            </button>
          </>
        )}

        <img src={logo} alt="DonorLink Logo" className="w-32 mt-8" />
      </div>
    </div>
  );
};

export default EmailVerificationPage;
