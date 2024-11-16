import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FolderPen, CarFront, BadgeDollarSign } from 'lucide-react';

const Checkout = () => {
  const API_URL = "https://carrentalbackend-0zuw.onrender.com/api/"
  const { rentalId } = useParams(); // Extract rentalId from URL parameters
  const [rental, setRental] = useState(null);
  const [car, setCar] = useState(null);
  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const fetchRentalDetails = async () => {
      try {
        const rentalResponse = await axios.get(`${API_URL}rentals/${rentalId}/`, { headers: authHeaders });
        const rentalData = rentalResponse.data;

        // Fetch car details using car ID from rental data
        const carResponse = await axios.get(`${API_URL}cars/${rentalData.car}/`, { headers: authHeaders });
        
        // Fetch user details using user ID from rental data
        const userResponse = await axios.get(`${API_URL}users/${rentalData.user}/`, { headers: authHeaders });
        
        setRental(rentalData);
        setCar(carResponse.data);
        setUser(userResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch rental details', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchRentalDetails();
  }, [rentalId]);

  if (loading) {
    return <div className='h-24 w-24 border rounded-full animate-spin border-black mx-auto my-auto'></div>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!rental || !car || !user) {
    return <p>No rental details found</p>;
  }

  const { rental_date, pickup_time, return_time, return_date } = rental;
  const { make, model, year } = car;
  const { username } = user;

  const handleClick = (e) => {
    navigate("/");
  };

  const handleLogout = (e) => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold text-center mb-4 underline">Checkout</h1>
      
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        User Details 
        <span className="ml-2">
          <FolderPen />
        </span>
      </h2>
      <p className="text-gray-700">Username: {username}</p>
      
      <h2 className="text-xl font-semibold mt-4 mb-2 flex items-center">
        Rental Details 
        <span className="ml-2">
          <FolderPen />
        </span>
      </h2>
      <p className="text-gray-700">Rental Date: {rental_date}</p>
      <p className="text-gray-700">Pickup Time: {pickup_time}</p>
      <p className="text-gray-700">Return Time: {return_time}</p>
      <p className="text-gray-700">Return Date: {return_date}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2 flex items-center">
        Car Details 
        <span className="ml-2">
          <CarFront />
        </span>
      </h2>
      <p className="text-gray-700">Make: {make}</p>
      <p className="text-gray-700">Model: {model}</p>
      <p className="text-gray-700">Year: {year}</p>

      <p className="text-xl font-bold mt-4 flex items-center">
        Price Per Day: R1000 
        <span className="ml-2">
          <BadgeDollarSign />
        </span>
      </p>

      <div className="checkout__buttons flex justify-between mt-6">
        <button 
          onClick={handleClick} 
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Back to Home
        </button>
        <button 
          onClick={handleLogout} 
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Checkout;
