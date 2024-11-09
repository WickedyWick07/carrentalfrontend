import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const RentalDetails = () => {
  const [userRentals, setUserRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchUserRentals } = useAuth();

  useEffect(() => {
    const getUserRentals = async () => {
      try {
        const rentals = await fetchUserRentals();
        setUserRentals(rentals);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user rentals:', error);
        setError('Failed to fetch user rentals. Please try again later.');
        setLoading(false);
      }
    };

    getUserRentals();
  }, [fetchUserRentals]);

  if (loading) {
    return <p className=".022 text-gray-500 animate-spin h-24 w-24 border rounded-full mx-auto text-center text-xl my-auto"></p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6  min-h-screen">
      <div>
        <Header />
      </div>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">My Rentals</h1>
      {userRentals.length === 0 ? (
        <p className="text-center text-gray-500">No rentals found.</p>
      ) : (
        <ul className="space-y-6">
          {userRentals.map((rental) => (
            <li key={rental.id} className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-700">Rental ID: {rental.id}</h2>
              <p className="text-gray-600">Rental Date: {rental.rental_date}</p>
              <p className="text-gray-600">Pickup Time: {rental.pickup_time}</p>
              <p className="text-gray-600">Return Time: {rental.return_time}</p>
              <p className="text-gray-600">Return Date: {rental.return_date}</p>

              {/* Fetch car details */}
              <CarDetails carId={rental.car} />
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

const CarDetails = ({ carId }) => {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'http://localhost:8000/api/';

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const authHeaders = {
          Authorization: `Bearer ${token}`,
        };
        const carResponse = await axios.get(`${API_URL}cars/${carId}/`, { headers: authHeaders });
        setCar(carResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching car details:', error);
        setError('Failed to fetch car details. Please try again later.');
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading car details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-gray-700">Car Details</h3>
      <p className="text-gray-600">Make: {car.make}</p>
      <p className="text-gray-600">Model: {car.model}</p>
      <p className="text-gray-600">Year: {car.year}</p>
    </div>
  );
};

export default RentalDetails;
