import React, { useState, useEffect, useContext } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import DataContext from '../Context/DataContext';

const Profile = () => {
  const { logout } = useContext(DataContext);

  const [user, setUser] = useState({
    username: '',
    email: '',
    phone_number: '',
    first_name: '',
    last_name: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile/');
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch profile data.');
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile/', user);
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-24">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white shadow-xl rounded-xl p-8 border-t-4 border-red-600">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Profile</h2>
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            disabled
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone_number" className="block mb-1">Phone</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={user.phone_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="first_name" className="block mb-1">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block mb-1">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">Update Profile</button>
            <button type="button" onClick={handleLogout} className="flex-1 bg-gray-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-gray-200">Logout</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
