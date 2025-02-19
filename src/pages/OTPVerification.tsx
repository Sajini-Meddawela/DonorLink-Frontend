import React, { useState } from "react";
import { Form, Input } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import donorLinkLogo from "../Assets/donorlink_logo.png";
import careHomeImage from "../Assets/carehome_login.png";

interface OTPFormValues {
  code: string;
}

const OTPVerification: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const navigate = useNavigate();
  const params = useParams<{ email: string }>();

  const onFinish = async (values: OTPFormValues) => {
    setIsVerifying(true);
    try {
      const email = params.email;
      if (!email) throw new Error("Email parameter is missing");

      const otp = values.code;
      const res = await axios.post(`http://localhost:3001/api/v1/auth/reset-pass/otp`, {
        email,
        otp,
      });

      console.log(res.data);
      navigate(`/reset-password/${email}`);
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: errorMessage,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Section - Nurse & Elderly Image */}
      <div className="hidden md:flex justify-center items-center bg-[#9dd6f9]">
        <img src={careHomeImage} alt="Care Home Nurse" className="max-h-full w-full object-cover mt-60" />
      </div>

      {/* Right Section - OTP Verification */}
      <div className="flex flex-col justify-center items-center text-center px-8">
        <h1 className="text-3xl font-bold text-[#63C6F7] mb-4">Reset Password Verification</h1>

        <img src={donorLinkLogo} alt="DonorLink Logo" className="w-40 mb-4" />

        <p className="text-md text-gray-600 mb-4">
          We want to make sure it's really you. In order to verify your email, enter the verification code that was sent to{" "}
          <span className="text-[#85C536] font-semibold">{params.email ?? "johndoe@gmail.com"}</span>.
        </p>

        <Form name="otp-verification" onFinish={onFinish} autoComplete="off" className="w-full max-w-md">
          <h2 className="text-md font-bold text-left mb-1">Verification Code</h2>
          <Form.Item
            name="code"
            rules={[
              { required: true, message: "Please enter the verification code!" },
              { pattern: /^[0-9]{6}$/, message: "Enter a valid 6-digit OTP!" },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Enter verification code"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </Form.Item>

          <button
            type="submit"
            disabled={isVerifying}
            className="rounded-lg bg-[#85C536] py-2 px-6 text-md font-medium uppercase text-white transition duration-200 hover:bg-[#6da02c] w-full"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default OTPVerification;
