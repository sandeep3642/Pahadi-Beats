import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../redux/profileSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-800 min-h-screen">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <div className="profile-info">
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
      </div>
    </div>
  );
};

export default Dashboard;
