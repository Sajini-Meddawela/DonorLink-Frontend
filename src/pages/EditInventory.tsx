import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import InventoryForm from "../components/Form";
import { InventoryService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const EditInventoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id || !user)
          throw new Error("No ID provided or user not authenticated");

        const item = await InventoryService.getItemById(parseInt(id), user.id);
        if (!item) throw new Error("Item not found");

        setItemDetails(item);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, user]);

  const handleSubmit = async (formData: any) => {
    try {
      if (!id || !user) return;
      await InventoryService.updateItem(parseInt(id), user.id, formData);
      toast.success("Inventory item updated successfully!");
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      toast.error("Failed to update inventory item. Please try again.");
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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!itemDetails)
    return <div className="text-center p-8">Item not found</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage="inventory" />
        <div className="flex flex-col flex-1 overflow-hidden p-10 items-center justify-center ml-[200px]">
          <InventoryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={itemDetails}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditInventoryPage;
