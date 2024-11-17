import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { CreditCard, Calendar } from "lucide-react";
import Header from "./Header";
function PaymentForm() {
  const API_URL =  import.meta.VITE_API_URL || "https://carrentalbackend-0zuw.onrender.com/api/"
  const location = useLocation();
  const rentalId = new URLSearchParams(location.search).get("rentalId");
  const { currentUser, refreshToken } = useAuth();
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [message, setMessage] = useState("");
  const [cardType, setCardType] = useState("");

  const fetchCurrentUserDetails = async () => {
    try {
      await refreshToken(); // Refresh token if necessary
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // Handle error, such as logging out the user or displaying an error message
    }
  };

  useEffect(() => {
    if (!rentalId) {
      console.error("Rental Id is missing in URL parameters");
      navigate("/rental-form"); // Navigate back to rental form
    } else {
      console.log("Current rentalId:", rentalId);
    }

    // Fetch current user details if not available
    if (!currentUser) {
      fetchCurrentUserDetails();
    }
  }, [rentalId, navigate, currentUser]);

  // Function to format card number with spaces every 4 digits
  const formatCardNumber = (number) => {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, "");
    // Split the cleaned number into groups of 4 and join with spaces
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    return formatted.trim();
  };

  const handleCvvChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, ""); // Remove all non-digit characters
    const truncated = cleaned.slice(0, 3); // Limit to 3 digits
    setCvv(truncated);
  };
  
  const isCardNumberValid = (number) => {
    const cleaned = number.replace(/\D/g, ""); // Remove spaces for validation
    return cleaned.length === 16; // Check if it's 16 digits
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    const formattedNumber = formatCardNumber(input);
    setCardNumber(formattedNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cardType) {
      setMessage("Please select a card type");
      return;
    }

    if (!isCardNumberValid(cardNumber)) {
      setMessage("Card number must be exactly 16 digits.");
      return;
    }



    if (!currentUser || !currentUser.id) {
      console.error("Current user or user ID is missing");
      setMessage("Current user or user ID is missing");
      return; // Handle this scenario appropriately
    }

    try {
      const response = await axios.post(
        `${API_URL}payment/${rentalId}/`,
        {
          user: currentUser.id,
          card_number: cardNumber.replace(/\s/g, ""), // Remove spaces for submission
          cvv: cvv,
          expiry_date: expiryDate,
          card_type: cardType,
          rental_id: rentalId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      console.log(response.data);
      setMessage("Payment was successful!!!");
      navigate(`/checkout/${rentalId}`);
    } catch (error) {
      console.error("There was an error with the payment. Please try again...", error);
      if (error.response && error.response.status === 401) {
        try {
          await refreshToken(); // Attempt to refresh token
          handleSubmit(e); // Retry payment submission after token refresh
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
          setMessage("Failed to refresh token. Please log in again.");
        }
      } else {
        setMessage("Payment submission failed. Please try again.");
      }
    }
  };

  const formatExpiryDate = (dateString) => {
    // Check if dateString is not empty
    if (!dateString) return "";
    
    // Split the input into year and month
    const [year, month] = dateString.split("-");
    
    // Format the expiry date as MM/YYYY
    return `${month}/${year}`;
  };

  return (
    <div className=" max-w-4xl mx-auto p-6  rounded-lg shadow-md mt-8">
      <div>
        < Header /> 
      </div>
      {currentUser && (
        <>
          <h2 className="text-2xl font-bold text-center mb-4">Payment</h2>
          <p className="text-center text-gray-700">Rental ID: {rentalId}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="card-type" className="flex text-gray-700  font-semibold items-center">Card Type<span className="ml-4">< CreditCard size={18}/></span></label>
            <div className="input__container">
              <select
                name="card-type"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="" disabled>Select Card Type</option>
                <option value="debit">Debit</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <label htmlFor="card-number" className="flex text-gray-700 font-semibold items-center">Card Number<span className="ml-4">< CreditCard size={18}/></span></label>
            <div className="input__container">
              <input
                type="text" // Change type to text to allow spaces
                name="card-number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength="19" // Allow 19 characters (16 digits + 3 spaces)
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <label htmlFor="cvv-number" className="flex text-gray-700 font-semibold items-center">CVV Number <span className="ml-4">< CreditCard size={18}/></span></label>
            <div className="input__container">
              <input
                type="number"
                name="cvv-number"
                value={cvv}
                onChange={handleCvvChange}
                maxLength='3'
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <label htmlFor="expiry-date" className="flex text-gray-700 font-semibold items-center">Expiry Date<span className="flex ml-4">< Calendar size={18}/></span></label>
            <div className="input__container">
              <input
                type="date"
                name="expiry-date"
                value={expiryDate} // Keep the state in YYYY-MM
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <p className="text-gray-700">Formatted Expiry Date: {formatExpiryDate(expiryDate)}</p> {/* Display formatted date */}
            
            <button 
              type="submit" 
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit Payment
            </button>
          </form>
          {message && <p className="mt-4 text-center text-red-500"><b>{message}</b></p>}
        </>
      )}
    </div>
  );
}

export default PaymentForm;
