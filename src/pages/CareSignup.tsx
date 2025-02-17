import React, { useState, useRef, ChangeEvent } from 'react';
import { Camera, Check, Users } from 'lucide-react';
import signup from '../Assets/signup.svg';
import { Link } from 'react-router-dom';

interface FormData {
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
  const [formData, setFormData] = useState<FormData>({
    organizationName: '',
    email: '',
    registrationNo: '',
    contactNo: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
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

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your submit logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img 
          src={signup} 
          alt="Care home signup" 
          className="w-[70%] h-auto object-cover"
        />
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
                <img 
                  src={profileImageUrl} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-[#63C6F7] flex items-center justify-center">
                  <Camera className="w-8 h-8 text-[#63C6F7]" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#63C6F7] rounded-full p-2"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name & Email */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Organization Name
                </label>
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
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Registration No & Contact No */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Registration No
                </label>
                <input
                  type="text"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Registration No"
                  required
                />
                {errors.registrationNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.registrationNo}</p>
                )}
              </div>
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Contact No
                </label>
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
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Password
                </label>
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
                {showPasswordHint && (
                  <p className="text-gray-600 text-sm mt-1">Enter strong password</p>
                )}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="relative">
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Confirm Password"
                  required
                />
                {passwordMatch && formData.confirmPassword && (
                  <Check className="absolute right-3 top-9 text-green-500" />
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <button
                type="button"
                className="w-full py-2 bg-white border-2 border-[#85C536] text-[#85C536] rounded-[30px] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-[#85C536] text-white py-2 px-4 rounded-[30px] hover:bg-[#85C536] transition duration-300"
              >
                Save
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
              Already have an Account?{' '}
            <Link to="/carelogin" className="text-[#85C536] hover:underline">
             Login
            </Link>
          </p>
          </div>
      </div>
    </div>
  );
};

export default SignupForm;