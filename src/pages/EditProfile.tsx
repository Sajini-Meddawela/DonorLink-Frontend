import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBarAuth';
import { UserService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    registrationNo: '',
    category: '',
    profileImage: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser) {
          navigate('/login');
          return;
        }
        
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
        setError(null);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError('Failed to load profile data');
        
        if (currentUser) {
          setProfileData({
            name: currentUser.name || '',
            email: currentUser.email || '',
            phone: currentUser.phone || '',
            address: currentUser.address || '',
            registrationNo: (currentUser as any).registrationNo || '',
            category: (currentUser as any).category || 'GENERAL',
            profileImage: ''
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser, navigate]);

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
      navigate(currentUser.role === 'CAREHOME' ? '/care_dashboard' : '/donor_dashboard');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (!currentUser) return;
    navigate(currentUser.role === 'CAREHOME' ? '/care_dashboard' : '/donor_dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center p-8">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <Navbar />
      <div className="flex-1 overflow-auto pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#63C6F7] mb-2">Your Profile</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your personal information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="flex flex-col lg:flex-row gap-8 justify-center">
            {/* Profile Picture Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 w-full lg:w-1/3 max-w-md h-fit">
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#63C6F7] to-[#52b0e0] mb-4 overflow-hidden flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {profileData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profileData.name}</h2>
                <p className="text-gray-600 mb-4">{profileData.email}</p>
                <button 
                  type="button"
                  className="px-4 py-2 text-sm text-[#63C6F7] font-medium rounded-full border border-[#63C6F7] hover:bg-[#63C6F7] hover:bg-opacity-10 transition duration-200"
                >
                  Change Profile Picture
                </button>
              </div>
            </div>

            {/* Profile Form Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 w-full lg:w-2/3 max-w-3xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Profile Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Care Home Specific Fields */}
                {currentUser?.role === 'CAREHOME' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Registration Number</label>
                      <input
                        type="text"
                        name="registrationNo"
                        value={profileData.registrationNo}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">Category</label>
                      <select
                        name="category"
                        value={profileData.category}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#63C6F7] focus:border-transparent"
                      >
                        <option value="CHILDREN">Children</option>
                        <option value="ADULTS">Adults</option>
                        <option value="SENIORS">Seniors</option>
                        <option value="DISABLED">Disabled</option>
                        <option value="GENERAL">General</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-2 border-2 border-[#63C6F7] rounded-full text-[#63C6F7] font-medium hover:bg-[#63C6F7] hover:bg-opacity-10 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2 bg-[#63C6F7] hover:bg-[#52b0e0] text-white rounded-full font-medium shadow-md hover:shadow-lg transition duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;