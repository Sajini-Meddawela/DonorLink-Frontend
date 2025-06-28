import React, { useState, useRef, ChangeEvent } from "react";
import { Camera, Eye, EyeOff, X, Check } from "lucide-react";
import signup from "../Assets/signup.svg";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  profileImage?: File;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  };

  const checkPasswordStrength = (password: string) => {
    if (!password) return "";

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const isLong = password.length >= 8;

    const strength =
      (hasLowercase ? 1 : 0) +
      (hasUppercase ? 1 : 0) +
      (hasNumber ? 1 : 0) +
      (hasSpecial ? 1 : 0) +
      (isLong ? 1 : 0);

    if (strength >= 4) return "strong";
    if (strength >= 3) return "medium";
    return "weak";
  };

  // Add this state variable
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | ""
  >("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const newErrors = { ...errors };

    switch (name) {
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Incorrect email format";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        const strength = checkPasswordStrength(value);
        setPasswordStrength(strength);
        if (!validatePassword(value)) {
          newErrors.password =
            "Password must contain at least 8 characters, uppercase, lowercase, number and special character";
        } else {
          delete newErrors.password;
        }
        if (formData.confirmPassword) {
          setPasswordMatch(value === formData.confirmPassword);
        }
        break;

      case "confirmPassword":
        setPasswordMatch(value === formData.password);
        break;
    }

    setErrors(newErrors);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, phone, address, password, confirmPassword } = formData;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All Fields Required!",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match!",
      });
      setLoading(false);
      return;
    }

    try {
      // Create JSON payload instead of FormData
      const payload = {
        name,
        email,
        phone,
        address,
        password,
        role: "DONOR",
        profileImage: formData.profileImage
          ? formData.profileImage.name
          : undefined,
      };

      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      Swal.fire(response.data.message, "", "success");
      navigate(`/confirmation-sent/${email}`);
    } catch (error: any) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        Swal.fire(
          error.response?.data?.message || "Registration failed",
          "",
          "error"
        );
      } else {
        Swal.fire("An unexpected error occurred", "", "error");
      }
    }
  };

  const togglePasswordVisibility = (
    field: "password" | "confirmPassword"
  ): void => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img
          src={signup}
          alt="Donor signup"
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
            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Your Name"
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

            {/* Phone & Address */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter Phone Number"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Address
                </label>
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

            {/* Password & Confirm Password with Eye Icon */}
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                    placeholder="Enter Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="mt-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-1 flex-1 rounded-full ${
                        passwordStrength === "weak"
                          ? "bg-red-500"
                          : passwordStrength === "medium"
                          ? "bg-yellow-500"
                          : passwordStrength === "strong"
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {passwordStrength === "weak"
                        ? "Weak"
                        : passwordStrength === "medium"
                        ? "Medium"
                        : passwordStrength === "strong"
                        ? "Strong"
                        : ""}
                    </span>
                  </div>
                  {passwordStrength !== "strong" && formData.password && (
                    <p className="text-red-500 text-xs mt-1">
                      Password must contain at least 8 characters with
                      uppercase, lowercase, number & special character
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block font-bold text-[#63C6F7] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-2 text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="flex items-center mt-1">
                    {passwordMatch ? (
                      <Check className="text-green-500 mr-1" size={16} />
                    ) : (
                      <X className="text-red-500 mr-1" size={16} />
                    )}
                    <span
                      className={`text-xs ${
                        passwordMatch ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {passwordMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
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
                disabled={loading}
              >
                {loading ? "Registering..." : "Save"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/donorlogin" className="text-[#85C536] hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
