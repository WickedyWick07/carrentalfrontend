import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import { FolderDot, Home, LogIn, LogOut } from 'lucide-react';


const Header = () => {
    const { currentUser, logout } = useAuth();

    const handleClick = () => {
        logout();
        navigate("/");
    };
  return (
    <div>
        <header className='p-4 m-4'>
            <h1 className='text-center font-semibold text-3xl'>SPEEDY RENTALS</h1>
            <nav className="mt-6">
                    <ul className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10">
                        
                        <li>
                            <Link to="/rental-details" className="text-black font-semibold hover:text-indigo-800 transition duration-300 transform hover:scale-105 flex items-center">
                                My Rentals <FolderDot className="ml-1 w-4 h-4" />
                            </Link>
                        </li>
                        <li className="text-black font-semibold hover:text-indigo-800 transition duration-300 transform hover:scale-105 cursor-pointer flex items-center">
                            {currentUser ? (
                                <span onClick={handleClick} className="flex items-center">
                                Logout <LogOut className="ml-1 w-4 h-4" />
                               </span>) : ""}
                           
                        </li>
                        <li>
                            <Link to="/" className="text-black font-semibold hover:text-indigo-800 transition duration-300 transform hover:scale-105 flex items-center">
                                Home <Home className="ml-1 w-4 h-4" />
                            </Link>
                        </li>
                    </ul>
                </nav>
<hr className='mt-2'/>

        </header>

      
    </div>
  )
}

export default Header
