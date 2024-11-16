import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs"; 
import { UserCircle2, CarFrontIcon, Calendar1Icon, Clock1 } from "lucide-react";
const API_URL =  import.meta.VITE_API_URL || "https://carrentalbackend-0zuw.onrender.com/api"

function RentalForm() {
  const location = useLocation();
  const { car } = location.state || {};
  const { currentUser, refreshToken } = useAuth();
  const navigate = useNavigate();
  const [rentalDate, setRentalDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!car) {
      navigate("/car-list");
    }
  }, [car, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setMessage("User not authenticated. Please log in.");
      return;
    }
    
    try {
      const formattedRentalDate = dayjs(rentalDate).format("YYYY-MM-DD");
      const formattedPickupTime = dayjs(`${formattedRentalDate} ${pickup}`).format("HH:mm:ss");
      const formattedReturnTime = dayjs(`${dayjs(returnDate).format("YYYY-MM-DD")} ${dropoff}`).format("HH:mm:ss");

      const payload = {
        user: currentUser.id,
        car: car.id,
        rental_date: formattedRentalDate,
        pickup_time: formattedPickupTime,
        return_time: formattedReturnTime,
        return_date: dayjs(returnDate).format("YYYY-MM-DD"),
      };
      const response = await axios.post(`${API_URL}create-rental/`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      const { id: rentalId } = response.data;
      setMessage("Rental Submission Successful");
      navigate(`/payment?rentalId=${rentalId}`);
    } catch (error) {
      console.error("Error with the rental submission", error);
      if (error.response.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) {
          handleSubmit(e); // Retry the request after refreshing token
        } else {
          setMessage("Rental submission failed. Please log in again.");
        }
      } else {
        setMessage("Rental submission failed. Please try again.");
      }
    }
  };

  const handleDateChange = (date) => {
    setRentalDate(new Date(date));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6 rental-form__heading">Rental Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <label htmlFor="customer" className="flex items-center text-gray-700 font-semibold">Customer<span className="ml-2"><UserCircle2 size={18} /></span></label>
                <div className="rental-input">
                    <input
                        type="text"
                        value={currentUser ? currentUser.username : ""}
                        name="customer"
                        className="rental-form__input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        readOnly
                    />
                </div>
                <label htmlFor="car" className="flex items-center text-gray-700 font-semibold">Car Selected<span className="ml-2"><CarFrontIcon size={18} /></span></label>
                <div className="rental-input">
                    <input
                        type="text"
                        value={`${car.make} ${car.model}`}
                        name="car"
                        className="rental-form__input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        readOnly
                    />
                </div>
                <label htmlFor="rental-date" className="flex items-center text-gray-700 font-semibold">Rental Date<span className="ml-2"><Calendar1Icon size={18} /></span></label>
                <div className="rental-input">
                    <input
                        type="date"
                        value={rentalDate ? dayjs(rentalDate).format("YYYY-MM-DD") : ""}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="rental-form__input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <label htmlFor="return-date" className="flex items-center text-gray-700 font-semibold">Return Date<span className="ml-2"><Calendar1Icon size={18} /></span></label>
                <div className="rental-input">
                    <input
                        type="date"
                        name="return-date"
                        value={returnDate ? dayjs(returnDate).format("YYYY-MM-DD") : ""}
                        className="rental-form__input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                        onChange={(e) => setReturnDate(new Date(e.target.value))}
                    />
                </div>
                <label htmlFor="pickup" className="flex items-center text-gray-700 font-semibold">Pick Time<span className="ml-2"><Clock1 size={18} /></span></label>
                <div className="rental-input">
                    <input
                        type="time"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        className="rental-form__input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <label htmlFor="dropoff" className="flex items-center text-gray-700 font-semibold">Drop Off Time<span className="ml-2"><Clock1 size={18} /></span></label>
                <div className="rental-input">
                    <input
                        type="time"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        className="rental-form__input w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200">Proceed to payment</button>
            </form>
            {message && <p className="mt-4 text-center text-red-500"><b>{message}</b></p>}
        </div>
  );
}

export default RentalForm;
