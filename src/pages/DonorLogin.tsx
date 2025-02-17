import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import donorlogin from '../Assets/login.svg'; // Assuming the donor login image path is correct
import { Link } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

const DonorLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', formData);
  };

  return (
    <div className="flex h-screen">
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img
          src={donorlogin}
          alt="Donor"
          className="w-[70%] h-auto object-cover"
        />
      </div>
      <div className="w-[60%] flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#63C6F7] mb-16 text-center">
            Login as a Donor
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block font-bold text-[#63C6F7] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block font-bold text-[#63C6F7] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#87CEEB]"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex justify-between items-center mb-6">
            <Link to="/forgotpw" className="text-sm text-[#85C536] hover:underline">
             Forgot Password
            </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-[#85C536] text-white py-2 px-4 rounded-[30px] hover:bg-[#85C536] transition duration-300"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/donorsignup" className="text-[#85C536] hover:underline">
             Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorLoginPage;
