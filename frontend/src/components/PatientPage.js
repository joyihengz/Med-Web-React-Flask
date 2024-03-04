import React from 'react';
import RegistrationButton from "./RegistrationButton.js";
import './PatientPage.css'; // Create a CSS file for styling
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import ProviderInformation from './ProviderInformation.js';
import PatientAccess from './PatientAccess.js';
import AppointmentForm from './AppointmentForm.js';
import Navbar from './Navbar.js';
import PatientProfile from './PatientProfile.js';

function PatientPage() {
  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [isAuthClick, setIsAuthClick] = useState(false);

  const handleButtonClick = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      console.log('get token!!! ', accessToken);
      var config = {
        method: 'get',
        url: 'http://localhost:3000/roleManagement',
        headers: { Authorization: `Bearer ${accessToken}` }
      };
      axios(config)
        .then(function (res) {
          setIsAuthClick(true);
        })
        .catch(function (err) {
          console.log('err!', err);
        })
    } catch (err) {
      console.log('bug!', err);
    }
  }
  return (
    <div className="patient-page">
      <Navbar />
      <h1>Patient Portal</h1>
      
      
      <div className="button-container">
        
  
        <div className="button-column">
          <Link to="/ProviderInformation">
            <button className="portal-button"  onClick={handleButtonClick}>
                Provider Information
            </button>
          </Link>

          <button className="portal-button"  onClick={handleButtonClick}>
              Medical History
          </button>   
          
          <Link to="/PatientAccess">
            <button className="portal-button"  onClick={handleButtonClick}>
                Deactivate Patient Access
            </button>
          </Link>

        </div>

        <div className="button-column">
          <Link to="/PatientProfile">
            <button className="portal-button"  onClick={handleButtonClick}>
                Patient Information
            </button>
          </Link>

          <Link to="/AppointmentForm">
            <button className="portal-button"  onClick={handleButtonClick}>
                Schedule Appointments
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default PatientPage;





