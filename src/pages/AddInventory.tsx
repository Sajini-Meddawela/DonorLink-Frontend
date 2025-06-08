import React from 'react';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBarAuth';
import InventoryForm from '../components/Form';
import { InventoryService } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { InventoryItem } from '../Types/types';

const AddInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { careHomeId } = useParams<{ careHomeId: string }>();

  const handleSubmit = async (formData: Omit<InventoryItem, 'id'>) => {
    try {
      if (!careHomeId) {
        throw new Error('Care home ID is required');
      }
      await InventoryService.createItem({
        ...formData,
        careHomeId: parseInt(careHomeId)
      });
      navigate('/inventory');
    } catch (error) {
      console.error('Failed to create inventory item:', error);
      alert('Failed to create inventory item. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <div className="relative">
          <Sidebar activePage="inventory"/>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden p-10 items-center justify-center ml-[200px]">
          <InventoryForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel} 
            initialData={null}
            careHomeId={parseInt(careHomeId || '0')}
          />
        </div>
      </div>
    </div>
  );
};

export default AddInventoryPage;