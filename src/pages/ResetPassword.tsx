import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import logo from "../Assets/donorlink_logo.png";
import ResetPwImage from "../Assets/Forgot password.svg";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, EyeOff, Check } from "lucide-react";

interface LocationState {
  resetToken?: string;
}

const ResetPassword: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  const resetToken = (location.state as LocationState)?.resetToken || "";

  // Improved password validation
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        hasMinLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,
      checks: {
        length: hasMinLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        number: hasNumber,
        specialChar: hasSpecialChar,
      },
    };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const validation = validatePassword(newPassword);
    setPasswordValid(validation.isValid);
    setPasswordMatch(newPassword === confirmPassword && newPassword.length > 0);
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const requestData = {
        email,
        newPassword,
        token: resetToken,
      };

      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/reset-password",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Password Reset Successful",
        text: "You can now login with your new password",
        willClose: () => {
          navigate(userRole === "DONOR" ? "/donorlogin" : "/carelogin");
        },
      });
    } catch (error: any) {
      console.error("Reset password error:", error);
      let errorMessage =
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";

      if (error.response?.status === 400) {
        errorMessage =
          error.response.data.message ||
          "Invalid request. Please check your input.";
      }

      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#87CEEB]">
      {/* Left Side - Image */}
      <div className="w-[40%] bg-[#87CEEB] flex items-center justify-center">
        <img
          src={ResetPwImage}
          alt="Reset Password"
          className="w-[70%] h-auto object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-[60%] bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#63C6F7] mb-8 text-center">
            Reset Your Password
          </h2>

          <div className="flex justify-center mb-8">
            <img src={logo} alt="DonorLink Logo" className="h-24 w-auto" />
          </div>

          <p className="text-center text-gray-600 mb-6">
            Enter a new password for{" "}
            <span className="font-semibold text-[#85C536]">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block font-bold text-[#63C6F7] mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-2 text-sm">
                <p className="font-medium mb-1">Password Requirements:</p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center ${
                      newPassword.length >= 8
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {newPassword.length >= 8 ? (
                      <Check size={16} className="mr-1" />
                    ) : (
                      "•"
                    )}{" "}
                    At least 8 characters
                  </li>
                  <li
                    className={`flex items-center ${
                      /[A-Z]/.test(newPassword)
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {/[A-Z]/.test(newPassword) ? (
                      <Check size={16} className="mr-1" />
                    ) : (
                      "•"
                    )}{" "}
                    At least one uppercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /[a-z]/.test(newPassword)
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {/[a-z]/.test(newPassword) ? (
                      <Check size={16} className="mr-1" />
                    ) : (
                      "•"
                    )}{" "}
                    At least one lowercase letter
                  </li>
                  <li
                    className={`flex items-center ${
                      /[0-9]/.test(newPassword)
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {/[0-9]/.test(newPassword) ? (
                      <Check size={16} className="mr-1" />
                    ) : (
                      "•"
                    )}{" "}
                    At least one number
                  </li>
                  <li
                    className={`flex items-center ${
                      /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? (
                      <Check size={16} className="mr-1" />
                    ) : (
                      "•"
                    )}{" "}
                    At least one special character
                  </li>
                </ul>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block font-bold text-[#63C6F7] mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#63C6F7]"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {confirmPassword && !passwordMatch && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
              {passwordMatch && confirmPassword && (
                <p className="text-green-500 text-sm mt-1 flex items-center">
                  <Check size={16} className="mr-1" /> Passwords match
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-[30px] bg-[#85C536] text-white transition duration-300 hover:bg-[#6da02c]"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
