import React, { useState, useRef, ChangeEvent } from 'react';
import { Camera, Check} from 'lucide-react';
import signup from '../Assets/signup.svg';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import axios from "axios";

interface SignupFormData {
  organizationName: string;
  email: string;
  registrationNo: string;
  contactNo: string;
  password: string;
  confirmPassword: string;
  profileImage?: File;
}

interface FormErrors {
  organizationName?: string;
  email?: string;
  registrationNo?: string;
  contactNo?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    organizationName: '',
    email: '',
    registrationNo: '',
    contactNo: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, isLoading] = useState(false);
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validation logic
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
    isLoading(true);

    const { organizationName, email, registrationNo, contactNo, password } = formData;
    const role = "carehome";

    if (!organizationName || !email || !registrationNo || !contactNo || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All Fields Required!",
      });
      isLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("organizationName", organizationName);
      formDataToSend.append("email", email);
      formDataToSend.append("registrationNo", registrationNo);
      formDataToSend.append("contactNo", contactNo);
      formDataToSend.append("password", password);
      formDataToSend.append("role", role);
      if (file) {
        formDataToSend.append("profileImage", file);
      }

      const response = await axios.post("http://localhost:3001/api/v1/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
      isLoading(false);
      Swal.fire(response.data.message, "", "success");
      navigate(`/registered-carehome/${email}`);
    } catch (error: unknown) {
      isLoading(false);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        Swal.fire(error.response?.data?.message || "An error occurred", "", "error");
      } else {
        console.error("Unexpected error:", error);
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
                name="organizationName"
                value={formData.organizationName}
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
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                placeholder="Enter Contact No"
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
            <button type="submit" className="w-full bg-[#85C536] text-white py-2 px-4 rounded-[30px] hover:bg-[#85C536] transition duration-300">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default SignupForm;