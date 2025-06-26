import React, { useState, useRef, ChangeEvent } from 'react';
import { Camera, Check } from 'lucide-react';
import signup from '../Assets/signup.svg';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from "axios";

interface SignupFormData {
  name: string;
  email: string;
  registrationNo: string;
  phone: string;
  password: string;
  confirmPassword: string;
  category: string;
  address: string;
  profileImage?: File;
}

interface FormErrors {
  name?: string;
  email?: string;
  registrationNo?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  category?: string;
  address?: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    registrationNo: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: 'GENERAL',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const validateRegistrationNo = (regNo: string): boolean => {
    return /^RD/.test(regNo);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!validateEmail(value)) {
          newErrors.email = 'Incorrect email format';
        } else {
          delete newErrors.email;
        }
        break;

      case 'registrationNo':
        if (!validateRegistrationNo(value)) {
          newErrors.registrationNo = 'Invalid Registration Number';
        } else {
          delete newErrors.registrationNo;
        }
        break;

      case 'password':
        if (!validatePassword(value)) {
          newErrors.password = 'Password must contain at least 8 characters, uppercase, lowercase, number and special character';
        } else {
          delete newErrors.password;
        }
        if (formData.confirmPassword) {
          setPasswordMatch(value === formData.confirmPassword);
        }
        break;

      case 'confirmPassword':
        setPasswordMatch(value === formData.password);
        break;
    }

    setErrors(newErrors);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const imageUrl = URL.createObjectURL(selectedFile);
      setProfileImageUrl(imageUrl);
    }
  };

  const onFinish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { name, email, registrationNo, phone, password, category, address } = formData;

    if (!name || !email || !registrationNo || !phone || !password || !category || !address) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All Fields Required!",
      });
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("email", email);
      formDataToSend.append("registrationNo", registrationNo);
      formDataToSend.append("phone", phone);
      formDataToSend.append("password", password);
      formDataToSend.append("category", category);
      formDataToSend.append("address", address);
      formDataToSend.append("role", "CAREHOME");
      
      if (file) {
        formDataToSend.append("profileImage", file);
      }

      const response = await axios.post("http://localhost:4000/api/v1/auth/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      Swal.fire(response.data.message, "", "success");
      navigate(`/registered-carehome/${email}`);
    } catch (error: any) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        Swal.fire(error.response?.data?.message || "Registration failed", "", "error");
      } else {
        Swal.fire("An unexpected error occurred", "", "error");
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img src={signup} alt="Care home signup" className="w-[70%] h-auto object-cover" />
      </div>

      {/* Right Side */}
      <div className="w-[60%] bg-white flex items-center justify-center">
        <div className="w-full max-w-2xl px-8">
          <h1 className="text-3xl font-bold text-center text-[#63C6F7] mb-8">
            Create New Profile
          </h1>

          {/* Profile Image Upload */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-[#63C6F7] flex items-center justify-center">
                  <Camera className="w-8 h-8 text-[#63C6F7]" />
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#63C6F7] rounded-full p-2"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <form onSubmit={onFinish} className="space-y-6">
            {/* Organization Name & Email */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">Organization Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Organization Name"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Email"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Registration No & Contact No */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">Registration No</label>
                <input
                  type="text"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Registration No"
                  required
                />
                {errors.registrationNo && <p className="text-red-500 text-sm mt-1">{errors.registrationNo}</p>}
              </div>
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">Contact No</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Contact No"
                  required
                />
              </div>
            </div>

            {/* Category & Address */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  required
                >
                  <option value="GENERAL">General</option>
                  <option value="CHILDREN">Children</option>
                  <option value="ADULTS">Adults</option>
                  <option value="SENIORS">Seniors</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Address"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setShowPasswordHint(true)}
                  onBlur={() => setShowPasswordHint(false)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Password"
                  required
                />
                {showPasswordHint && <p className="text-gray-600 text-sm mt-1">Enter strong password</p>}
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              <div className="relative">
                <label className="block font-bold text-[#63C6F7] mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Confirm Password"
                  required
                />
                {passwordMatch && formData.confirmPassword && <Check className="absolute right-3 top-9 text-green-500" />}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <button type="button" className="w-full py-2 bg-white border-2 border-[#85C536] text-[#85C536] rounded-[30px] hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                className="w-full bg-[#85C536] text-white py-2 px-4 rounded-[30px] hover:bg-[#85C536] transition duration-300"
                disabled={loading}
              >
                {loading ? "Registering..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;