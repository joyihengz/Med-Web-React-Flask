import React, { useState, useEffect } from 'react';
import './ProviderInformation.css'; // Create a CSS file for styling
import Navbar from './Navbar';
import Select from "react-select";

const ProviderInformation = () => {

  // Provider data
  const [providers, setProviders] = useState([]);

  // Fetch providers from Flask API
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/providers');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }

  };


  // Department options for the select dropdown
  const [departments, setDepartments] = useState([]);

  // State to store the selected department options
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/departments')
    .then(response => response.json())
    .then(data => {
      const departmentOptions = data.map(dept => ({
        value: dept.name,
        label: dept.name
      }));
      setDepartments(departmentOptions);
    })
    .catch(error => console.error('Error fetching departments:', error));
  }, []);

  // Function to handle change in the select dropdown
  const handleChange = (selectedOptions) => {
    setSelectedDepartments(selectedOptions);
  };

  // Small dataset here: client-side filtering for a faster, more responsive user experience
  // Function to filter providers based on selected departments
  const filtered = selectedDepartments.length > 0
    ? providers.filter(provider => selectedDepartments.some(dept => dept.value === provider.department.name))
    : providers;
  
  // Define custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      // additional styles can be added here
    }),
    option: (styles) => ({
      ...styles,
      fontFamily: 'Verdana', // Set the font for dropdown items
    }),
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: '#E5F7FA', // Setting the background color for selected options
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: '#00AFD1', // You can also change the text color if needed
      fontFamily: 'Verdana', // Set the font for selected options labels
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: '#00AFD1', // Change this to your desired icon color
    }),
  };

  return (
  <div className='provider-info'>
    <Navbar/>
    <h1>Meet Our Team</h1>
    <div className='select-menu'>
      <Select 
        isMulti 
        options={departments} 
        onChange={handleChange}
        value={selectedDepartments}
        styles={customStyles}
      />
    </div>
    <div className='content-container'>
      {filtered.map(provider => (
      <div key={provider.id} className='provider-item'>
        <img src={require("../Images/medical-team.png")} alt="medical-doctor"/>
        <p>{provider.first_name} {provider.last_name}, {provider.degree}</p>
        <p>{provider.role}</p>
        <p>{provider.department.name}</p>
      </div>

      ))}
    </div>
  </div>
);
}


export default ProviderInformation;
