import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBarAuth";
import { NeedsService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const DeleteNeedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const deleteNeed = async () => {
      try {
        if (!id || !user) {
          toast.error("No ID provided or user not authenticated");
          navigate("/needs");
          return;
        }

        await NeedsService.deleteNeed(parseInt(id), user.id);
        toast.success("Need deleted successfully!");
        navigate("/needs");
      } catch (error) {
        console.error("Error deleting need:", error);
        toast.error("Failed to delete need");
        navigate("/needs");
      }
    };

    deleteNeed();
  }, [id, navigate, user]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage="need-list" />
        <div className="flex flex-col flex-1 overflow-hidden p-10 items-center justify-center ml-[200px]">
          <div className="text-center p-8">Deleting need...</div>
        </div>
      </div>
    </div>
  );
};

export default DeleteNeedPage;
