import React from 'react';
import Sidebar from '../components/SideBar';
import Navbar from '../components/NavBarAuth';
import InventoryForm from '../components/Form';

const AddInventoryPage: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Form Submitted');
  };

  const handleCancel = () => {
    console.log('Form Cancelled');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-20">
        <div className="relative">
          <Sidebar activePage="inventory" onPageChange={() => {}} />
        </div>

        <div className="flex flex-col flex-1 overflow-hidden p-10 items-center justify-center ml-[200px]">
          <InventoryForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default AddInventoryPage;
