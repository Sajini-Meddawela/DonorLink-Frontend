import React, { useState, useEffect } from 'react';
import { UserService } from '../services/api';
import { X } from 'lucide-react';

interface ProfileEditTooltipProps {
  currentUser: any;
  onClose: () => void;
}

const ProfileEditTooltip: React.FC<ProfileEditTooltipProps> = ({ currentUser, onClose }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationNo: '',
    category: '',
    profileImage: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const userData = await UserService.getCurrentUser();
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          registrationNo: userData.registrationNo || '',
          category: userData.category || 'GENERAL',
          profileImage: ''
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfileData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: currentUser.address || '',
          registrationNo: (currentUser as any).registrationNo || '',
          category: (currentUser as any).category || 'GENERAL',
          profileImage: ''
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!currentUser) return;
      
      const updateData = {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        ...(currentUser.role === 'CAREHOME' && { category: profileData.category })
      };

      await UserService.updateUser(currentUser.id, updateData);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-40 pt-20">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="absolute right-20 top-24 w-80 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-[#63C6F7]">Edit Profile</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#63C6F7]"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-gray-700 mb-1 text-xs font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1 text-xs font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1 text-xs font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7]"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1 text-xs font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7]"
                />
              </div>

              {currentUser?.role === 'CAREHOME' && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1 text-xs font-medium">Registration No</label>
                    <input
                      type="text"
                      name="registrationNo"
                      value={profileData.registrationNo}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-xs font-medium">Category</label>
                    <select
                      name="category"
                      value={profileData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7]"
                    >
                      <option value="CHILDREN">Children</option>
                      <option value="ADULTS">Adults</option>
                      <option value="SENIORS">Seniors</option>
                      <option value="DISABLED">Disabled</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs border border-[#63C6F7] text-[#63C6F7] rounded-full hover:bg-[#63C6F7] hover:bg-opacity-10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-[#63C6F7] text-white rounded-full hover:bg-[#52b0e0] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditTooltip;