import React, { useContext, useState } from 'react';
import DataContext from '../Context/DataContext';
import Button from './Button'; // Import the new Button component

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z" />
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const Profile = () => {
  const { user, updateUserProfile, logout } = useContext(DataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone_number: user.phone_number || '',
    });
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch {
      // Error is handled and alerted in the DataContext.
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100/50 flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-8">
        <div className="flex items-center mb-6">
            <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
            <h1 className="text-xl font-semibold text-gray-800">Profile</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative w-40 h-40 mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="absolute top-2 right-2">
                    <CameraIcon />
                </div>
                <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">First Name:</p>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Name:</p>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email:</p>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number:</p>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  {/* <div>
                    <p className="text-sm text-gray-500">Address:</p>
                    <p className="text-lg font-medium text-gray-800">285 N Broad St, Elizabeth, NJ 07208, USA</p>
                  </div> */}
                </div>
                <div className="mt-8 flex space-x-4">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={handleCancelClick}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <p className="text-sm text-gray-500">First Name:</p>
                          <p className="text-lg font-medium text-gray-800">{user.first_name}</p>
                      </div>
                      <div>
                          <p className="text-sm text-gray-500">Last Name:</p>
                          <p className="text-lg font-medium text-gray-800">{user.last_name}</p>
                      </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="text-lg font-medium text-gray-800">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number:</p>
                    <p className="text-lg font-medium text-gray-800">{user.phone_number}</p>
                  </div>
                  {/* <div>
                    <p className="text-sm text-gray-500">Address:</p>
                    <p className="text-lg font-medium text-gray-800">285 N Broad St, Elizabeth, NJ 07208, USA</p>
                  </div> */}
                </div>
                <div className="mt-8 flex flex-wrap flex-col sm:flex-row sm:justify-evenly gap-4">
                  <Button variant="secondary" onClick={handleEditClick}>
                      <EditIcon />
                      EDIT PROFILE
                  </Button>
                  <Button to="/mybooking" variant="primary">
                  
                    My Bookings
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
