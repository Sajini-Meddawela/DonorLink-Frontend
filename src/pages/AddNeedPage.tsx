import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import NeedForm from "../components/NeedForm";
import { NeedsService } from "../services/api";
import { NeedItem } from "../Types/types";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AddNeedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (formData: Omit<NeedItem, "id">) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      await NeedsService.createNeed({
        ...formData,
        userId: user.id,
      });
      toast.success("Need created successfully!");
      navigate("/needs");
    } catch (error) {
      console.error("Failed to create need:", error);
      toast.error("Failed to create need. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/needs");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage="need-list" />
        <div className="flex flex-col flex-1 overflow-hidden p-10 items-center justify-center ml-[200px]">
          <NeedForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={null}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNeedPage;
