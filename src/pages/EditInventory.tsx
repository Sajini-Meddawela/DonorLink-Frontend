import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import InventoryForm from "../components/Form";
import { InventoryService } from "../services/api";
import { InventoryItem } from "../Types/types";

const InventoryEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [itemDetails, setItemDetails] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const careHomeId = 1; // Hardcoded for now

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!id) throw new Error("No ID provided");

        const item = await InventoryService.getItemById(parseInt(id), careHomeId);
        if (!item) throw new Error("Item not found");

        setItemDetails(item);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (formData: InventoryItem) => {
    try {
      if (!id) return;
      await InventoryService.updateItem(parseInt(id), careHomeId, formData);
      navigate("/inventory");
    } catch (error) {
      console.error("Failed to update inventory item:", error);
      alert("Failed to update inventory item. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

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
            careHomeId={careHomeId}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryEditPage;