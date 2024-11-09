// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CarList from "./components/CarList";
import RentalForm from "./components/RentalForm";
import PaymentForm from "./components/PaymentForm";
import Checkout from "./components/Checkout";
import RentalDetails from './components/RentalDetails';
import Home from "./components/Home";
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import { AuthProvider } from "./context/AuthContext";
import "./App.css"
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cars" element={<PrivateRoute><CarList /></PrivateRoute>} />
            <Route path="/create-rental" element={<PrivateRoute><RentalForm /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><PaymentForm /></PrivateRoute>} />
            <Route path="/checkout/:rentalId" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/rental-details" element={<PrivateRoute><RentalDetails /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
