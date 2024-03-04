import React, { useState, useEffect } from 'react';
import './Services.css';
import Navbar from './Navbar.js';

const Services = () => {

    // Department data
    const [departments, setDepartments] = useState([]);

    // Fetch departments from Flask API
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/departments');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setDepartments(data);
        } catch (error) {
            console.error("Failed to fetch departments", error);
        }
    };

    return (
        <div className='services-page'>
            <Navbar />
            <h1>Our Services</h1>

            <div className='services-container'>
                {departments.map(dept => (
                    <div key={dept.id} className='dept-item'>
                        <h3>{dept.name}</h3>
                        <p>{dept.description}</p>
                    
                    </div>
                ))}
                            
            </div>

        </div>
    );
}

export default Services;