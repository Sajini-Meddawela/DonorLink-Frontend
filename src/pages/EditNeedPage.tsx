import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBarAuth';
import NeedForm from '../components/NeedForm';
import { NeedsService } from '../services/api';
import { NeedItem } from '../Types/types';

const EditNeedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [needDetails, setNeedDetails] = useState<NeedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNeed = async () => {
      try {
        if (!id) throw new Error('No ID provided');
        
        const need = await NeedsService.getNeedById(parseInt(id));
        if (!need) throw new Error('Need not found');
        
        setNeedDetails(need);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch need');
      } finally {
        setLoading(false);
      }
    };

    fetchNeed();
  }, [id]);

  const handleSubmit = async (formData: NeedItem) => {
    try {
      if (!id) return;
      await NeedsService.updateNeed(parseInt(id), formData);
      navigate('/needs');
    } catch (error) {
      console.error('Failed to update need:', error);
      alert('Failed to update need. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/needs');
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!needDetails) return <div className="text-center p-8">Need not found</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <Sidebar activePage="need-list" />
        <div className="flex flex-col flex-1 overflow-hidden p-10 items-center justify-center ml-[200px]">
          <NeedForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            initialData={needDetails}
            isEditMode={true}
            careHomeId={needDetails.careHomeId} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditNeedPage;