import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  onClick?: () => void; 
  to?: string; 
  text: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  to,
  text,
  icon: Icon,
  variant = "primary",
  className = "",
}) => {
  const baseStyles =
    "flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors";
  const variantStyles = {
    primary: "bg-sky-400 hover:bg-sky-500 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 text-black",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseStyles} ${variantStyles[variant]} ${className} inline-flex`}
      >
        {Icon && <Icon size={16} />}
        {text}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {text}
    </button>
  );
};

export default Button;
