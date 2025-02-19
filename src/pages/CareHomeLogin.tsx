import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import carehomelogin from '../Assets/login.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

interface LoginFormData {
  email: string;
  password: string;
}

const CareHomeLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/v1/auth/login", {
        email: formData.email,
        password: formData.password,
        type: 2,
        careId: formData.email, // Assuming email is used for orgId temporarily
      });

      if (res.data.status === "success") {
        localStorage.setItem("jsonwebtoken", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userEmail", formData.email);
        
        setTimeout(() => {
          setLoading(false);
          navigate("/care_dashboard");
        }, 2000);
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response?.data?.message === "Please Verify Your Email!") {
        navigate(`/email-verification/${formData.email}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response?.data?.message || "Login failed. Please try again.",
        });
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img
          src={carehomelogin}
          alt="Care Home"
          className="w-[70%] h-auto object-cover"
        />
      </div>

      <div className="w-[60%] flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#63C6F7] mb-16">
            Login as a Care Home Owner
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
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/caresignup" className="text-[#85C536] hover:underline">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareHomeLoginPage;