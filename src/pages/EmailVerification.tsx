import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmailVerify from '../Assets/carehome_login.png';
import logo from '../Assets/donorlink_logo.png';

const EmailVerifiedPage: React.FC = () => {
  const [loading, isLoading] = useState(true);
  const { email, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/v1/auth/${email}/verify/${token}`
        );
        console.log(response.status);
        isLoading(false);
      } catch (error) {
        isLoading(false);
        console.error('Error verifying email:', error);
      }
    };

    verifyEmail();
  }, [email, token]);

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img
          src={EmailVerify}
          alt="Verification"
          className="w-[70%] h-auto object-cover"
        />
      </div>

      {/* Right Side */}
      <div className="w-[60%] flex flex-col items-center justify-center bg-white p-8 text-center">
        <h2 className="text-3xl font-bold text-[#63C6F7] mb-4">Email Verification</h2>
        <img src={logo} alt="DonorLink Logo" className="w-32 mb-4" />
        <p className="text-[#5CB85C] mb-6">
          We want to make sure it's really you. Verification email sent to <br />
          <span className="font-bold">{email}</span>
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#85C536] text-white py-2 px-6 rounded-[30px] hover:bg-[#6fa32e] transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
