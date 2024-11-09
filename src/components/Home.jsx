import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronRight, LogIn, LogOut, Car, FolderDot } from 'lucide-react';
import heroImg from "../assets/images/heroImg.jfif";
import heroImg2 from "../assets/images/heroImg2.avif";
import heroImg3 from "../assets/images/heroImg3.avif";

function Home() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleClick = () => {
        logout();
        navigate("/");
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <div className="min-w-screen mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-lg">
            <div className="mb-8 sm:mb-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-black mb-3">Welcome</h2>
                <p className="text-lg sm:text-xl text-indigo-600 font-semibold">
                    {currentUser ? currentUser.username : "Guest"}
                </p>
                <nav className="mt-6">
                    <ul className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-10">
                        <li>
                            <Link to="/cars" className="text-black font-semibold hover:text-indigo-800 transition duration-300 transform hover:scale-105 flex items-center">
                                Cars List <Car className="ml-1 w-4 h-4" />
                            </Link>
                        </li>
                        <li className="text-black font-semibold hover:text-indigo-800 transition duration-300 transform hover:scale-105 cursor-pointer flex items-center">
                            {currentUser ? (
                                <span onClick={handleClick} className="flex items-center">
                                Logout <LogOut className="ml-1 w-4 h-4" />
                               </span>
                            ) : (
                                <Link to="/login" onClick={handleLoginClick}>
                                    Login <LogIn className="ml-1 w-4 h-4" />
                                </Link>
                            )}
                        </li>
                        <li>
                            <Link to="/rental-details" className="text-black font-semibold hover:text-indigo-800 transition duration-300 transform hover:scale-105 flex items-center">
                                My Rentals <FolderDot className="ml-1 w-4 h-4" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            <section className="mb-8 sm:mb-12 text-center p-4">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-black mb-6">Welcome to Speedy Rentals</h1>
                <p className="text-lg sm:text-2xl font-semibold text-indigo-700 leading-relaxed max-w-3xl mx-auto">
                    Your ultimate destination for convenient and affordable car rentals. Whether you're planning a weekend getaway or need a reliable car for business travel, we've got you covered with a wide range of vehicles to suit your needs.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 mx-auto">
                    <img src={heroImg} alt="Car 1" className="w-64 sm:w-1/3" />
                    <img src={heroImg2} alt="Car 2" className="w-64 sm:w-1/3" />
                    <img src={heroImg3} alt="Car 3" className="w-64 sm:w-1/3" />
                </div>
            </section>

            <section className="mb-8 sm:mb-12 bg-white p-6 sm:p-8 rounded-lg shadow-2xl">
                <h2 className="text-2xl sm:text-3xl mb-4 text-black font-extrabold text-center">About Speedy Rentals</h2>
                <p className="text-base sm:text-lg font-semibold text-indigo-700 leading-relaxed">
                    At Speedy Rentals, we pride ourselves on offering top-notch customer service and a seamless rental experience. Our fleet includes the latest models from top brands, ensuring that you have a comfortable and safe journey. With flexible rental terms and competitive pricing, we make it easy for you to find the perfect car for your trip.
                </p>
            </section>

            <section className="mb-8 sm:mb-12 bg-white p-6 sm:p-8 rounded-lg shadow-2xl">
                <h2 className="text-2xl sm:text-3xl mb-4 text-black text-center font-extrabold">Why Choose Us?</h2>
                <p className="text-base sm:text-lg text-indigo-700 mb-4 font-semibold">
                    Choosing Speedy Rentals means choosing quality and reliability. Here are a few reasons why our customers love us:
                </p>
                <ul className="list-none mt-2 text-indigo-700 space-y-3">
                    {[
                        "Wide selection of vehicles: From compact cars to luxury SUVs, we have something for everyone.",
                        "24/7 customer support: Our team is always here to assist you, no matter what time of day.",
                        "Affordable rates: We offer competitive pricing with no hidden fees.",
                        "Easy booking process: Rent a car in just a few clicks with our user-friendly online platform.",
                        "Flexible rental terms: Need a car for a day or a month? We've got flexible options to suit your schedule."
                    ].map((item, index) => (
                        <li key={index} className="flex items-start hover:translate-y-1 cursor-pointer">
                            <ChevronRight className="mr-2 w-5 h-5 text-indigo-500 flex-shrink-0 mt-1" />
                            <span className="font-semibold">{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <footer className="text-center mt-8 sm:mt-12">
                <p className="text-indigo-600 font-semibold">Coded by NSM &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}

export default Home;
