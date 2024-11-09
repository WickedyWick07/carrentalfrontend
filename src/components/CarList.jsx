import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Header from "./Header";


function CarList(){
    
    const [cars, setCars] = useState([])
    const API_URL = "http://localhost:8000/api/"

    useEffect(() =>{
        axios.get(`${API_URL}cars`)
        .then(response => {
            console.log(response.data)
            setCars(response.data);
        })
        .catch(error => {
            console.error("There was an error fetching the data",error)
        })},[])

        const navigate = useNavigate()

        const handleSelectCar = (car) => {
            navigate('/create-rental', {state: {car}})


        }

        

        return(
            <div  className="mx-auto p-8 rounded-xl shadow-lg">
                <Header />
            <div className=" mx-auto p-6  rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Available Cars</h1>
                <ul className="list-none p-0">
                    {cars.map(car => (
                        <li 
                            key={car.id} 
                            onClick={() => handleSelectCar(car)} 
                            className="flex items-center sm:p-4 lg:p-8 mb-4 bg-white rounded-lg shadow transition-transform transform hover:scale-105 cursor-pointer hover:bg-gray-100 md:hover:bg-gray-100 sm:hover:bg-gray-100" 
                        >
                            {car.image && (
                                <img
                                    src={car.image}
                                    alt={`${car.make} ${car.model}`}
                                    className="h-32 w-32 lg:h-3/4 lg:w-48 rounded-lg mr-4 object-cover" // Adjusted image styling
                                />
                            )}
                            <div>
                                <h2 className="text-lg font-medium text-gray-700"><span className="font-light">Car Make:</span> {car.make}</h2>
                                <h2 className="text-lg font-medium text-gray-700"><span className="font-light">Car Model:</span> {car.model}</h2>
                                <h2 className="text-lg font-medium text-gray-700"><span className="font-light">Car Year:</span> {car.year}</h2>
                                        <p className="text-lg font-medium text-gray-700">
                <span className="font-light">Car Availability:</span> 
                <span className="ml-2 h-4 w-4 rounded-full animate-pulse inline-block" 
                    style={{ backgroundColor: car.availability ? 'green' : 'red' }}>
                </span>
            </p>                            
            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        )
    

}

export default CarList 
