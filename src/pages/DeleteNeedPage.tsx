import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBarAuth';
import { NeedsService } from '../services/api';

const DeleteNeedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteNeed = async () => {
      try {
        if (!id) {
          throw new Error('No ID provided');
        }
        
        await NeedsService.deleteNeed(parseInt(id));
        navigate('/needs', { state: { message: 'Need deleted successfully' } });
      } catch (error) {
        console.error('Error deleting need:', error);
        navigate('/needs', { state: { error: 'Failed to delete need' } });
      }
    };

    deleteNeed();
  }, [id, navigate]);

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