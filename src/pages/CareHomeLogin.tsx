import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import carehomelogin from '../Assets/login.svg';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react'; 

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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      await login(formData.email, formData.password);
    } catch (err: any) {
      setLoading(false);
      if (err.response?.data?.message === "Please verify your email first") {
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
            <div className="mb-4 relative">
              <label htmlFor="password" className="block font-bold text-[#63C6F7] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#87CEEB] pr-10"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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