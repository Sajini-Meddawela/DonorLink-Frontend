import React, { useState } from "react";
import logo from "../Assets/donorlink_logo.png"; 
import { Form, Input } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import emailConfirm from "../Assets/carehome_login.png";

interface FormValues {
  email: string;
}

const EmailConfirmation: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const params = useParams<{ email: string }>();

  const onFinish = async (values: FormValues) => {
    setLoading(true);
    if (params.email !== values.email) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Entered Email is incorrect!",
      });
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3001/api/v1/auth/verify/${values.email}`
      );
      console.log(res.data);
      setLoading(false);
      navigate(`/confirmation-sent/${values.email}`);
    } catch (err: any) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left Side - Image Section */}
      <div className="bg-[#87CEEB] flex items-center justify-center">
        <img
          src={emailConfirm}
          alt="Email Confirmation"
          className="max-h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Form Section */}
      <div className="flex flex-col justify-center items-center bg-white px-12 md:px-20 text-center">
        <h1 className="text-3xl font-bold text-[#63C6F7] mb-4">
          Email Verification
        </h1>

        <img src={logo} alt="DonorLink Logo" className="w-40 mb-4" />

        <p className="text-md text-gray-600 mb-4">
          Enter your email starting with{" "}
          <span className="font-bold">
            {params.email?.substring(0, 3)}******
          </span>{" "}
          to continue.
        </p>

        <Form
          name="email-verification"
          onFinish={onFinish}
          autoComplete="off"
          className="w-full max-w-md"
        >
          <h2 className="text-md font-bold text-left mb-1">Email</h2>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid E-mail format!" },
            ]}
            hasFeedback
          >
            <Input
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </Form.Item>

          <button
            type="submit"
            className="rounded-lg bg-[#85C536] py-2 px-6 text-md font-medium uppercase text-white transition duration-200 hover:bg-[#6da02c] w-full"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </Form>
      </div>
    </div>
  );
};

export default EmailConfirmation;
