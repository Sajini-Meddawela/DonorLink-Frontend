import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/donorlink_logo.png';
import ForgotPw from '../Assets/Forgot password.svg'

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (email.length > 0) {
      const atIndex = email.indexOf('@');
      if (atIndex > 0) {
        const username = email.substring(0, atIndex);
        const domain = email.substring(atIndex);
        const maskedUsername = username.substring(0, 4) + '*'.repeat(Math.max(0, username.length - 4));
        setEmailHint(`${maskedUsername}${domain}`);
      } else {
        setEmailHint(email.substring(0, 4) + '*'.repeat(Math.max(0, email.length - 4)));
      }
    } else {
      setEmailHint('');
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Verification code sent. Please check your email.');
    navigate('/passwordverify', { state: { email } });
  };

  return (
    <div className="flex h-screen bg-[#87CEEB]">
      <div className="w-2/5 bg-[#87CEEB] flex items-center justify-center">
        <img src={ForgotPw} 
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
            <img src={logo} 
            alt="Donor Link Logo" 
            className="h-55 w-auto"
            />
          </div>
          <p className="mb-4 text-[#85C536]">
            {emailHint 
              ? `Enter your email starting with ${emailHint} to continue`
              : 'Enter your email to continue'}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="Verification Code" className="block font-bold text-[#63C6F7] mb-2">Email</label>
              <input
                type="verificationcode"
                id="verificationcode"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#63C6F7] focus:border-[#63C6F7]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#85C536] text-white py-2 px-4 rounded-[30px] hover:bg-[#85C536] transition duration-300"
            >
              Verify
            </button>
          </form>
          {message && (
            <p className="mt-4 text-green-600 text-sm">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;