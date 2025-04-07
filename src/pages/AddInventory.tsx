import React from 'react';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBarAuth';
import InventoryForm from '../components/Form';
import { InventoryService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { InventoryItem } from '../Types/types';

const AddInventoryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: Omit<InventoryItem, 'id'>) => {
    try {
      await InventoryService.createItem(formData);
      navigate('/inventory');
    } catch (error) {
      console.error('Failed to create inventory item:', error);
      alert('Failed to create inventory item');
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
          <Sidebar activePage="inventory" onPageChange={() => {}} />
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