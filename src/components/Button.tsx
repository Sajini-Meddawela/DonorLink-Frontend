import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = "primary",
  className = "",
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
