import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios'

const API_URL = import.meta.env(VITE_API_URL)
  
  const Register = () =>  {
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate()

    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#$%^&*])[A-Za-z\d@!#$%^&*]{9,}$/;
        return passwordPattern.test(password);
      };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validatePassword(password)) {
            setMessage("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
          }
       
       try{
            const response = await axios.post(`${API_URL}/auth/register/`, {
                first_name: firstName,
                last_name: lastName,
                username,
                password
        })
        console.log(response.data)
             setMessage("Registration successful!");
             navigate(`/`)
        }catch (error){
            console.error(error)
            setMessage("Registration failed. Please try again")
        }
    };

	return (
        <div className=" mx-auto p-6  rounded-lg shadow-lg mt-20">
        <h2 className="text-center text-2xl font-semibold mb-6 uppercase underline">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-600">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}
              required
              placeholder='Enter your first name'

              className="w-full p-2 border  border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
              required
              placeholder='Enter your last name'

              className="w-full p-2  border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder='Enter your username'
              className="w-full  p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Enter your password'
              className="w-full p-2 border  border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <p className='text-xs text-gray-600'>Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>
        </form>
        {message && <p className="text-red-600 text-center mt-2">{message}</p>}
      </div>
	);
  }
  
  export default Register;
  