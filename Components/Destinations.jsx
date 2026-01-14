import React, { useState, useEffect } from 'react';
import api from '../api/api';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/routes/');
        const uniqueDestinations = new Set(res.data.map(route => route.destination_city));
        setDestinations(Array.from(uniqueDestinations).sort());
      } catch (err) {
        console.error('Failed to load destinations', err);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Our Destinations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <h2 className="text-xl font-semibold">{destination}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;