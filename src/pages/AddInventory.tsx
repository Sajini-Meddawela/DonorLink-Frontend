import React from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import InventoryForm from "../components/Form";
import { InventoryService } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AddInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (formData: any) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      await InventoryService.createItem({
        ...formData,
        userId: user.id,
      });
      
      toast.success("Inventory item added/updated successfully!");
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to create/update inventory item:", error);
      toast.error("Failed to add/update inventory item. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

  if (!user) {
    return (
      <div className="text-center p-8">Please login to access this page</div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <div className="relative">
          <Sidebar activePage="inventory" />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden p-10 items-center justify-center ml-[200px]">
          <InventoryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={null}
          />
        </div>
      </div>
    </div>
  );
};

export default AddInventoryPage;