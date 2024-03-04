import React from 'react';
import RegistrationButton from "./RegistrationButton.js";
import './ProviderPage.css'; // Create a CSS file for styling
import { Link } from 'react-router-dom'; 
import axios from 'axios';

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useState } from "react";

import ProviderInformation from './ProviderInformation.js';
import PatientList from './PatientList.js'
import Navbar from './Navbar.js';

function ProviderPage() {
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
    <div className="provider-page">
      <Navbar />
      <h1>Provider Portal</h1>

      <div className="button-container">
        
        <div className="button-column">
          <Link to="/ProviderInformation">
            <button  className="portal-button" onClick={handleButtonClick}>
                Provider Information
            </button>
          </Link>

          <Link to="/PatientAccess">
            <button  className="portal-button" onClick={handleButtonClick}>
                Activate Patient Access
            </button>
          </Link>
            
        </div>

        <div className="button-column">

          <Link to="/PatientList">
            <button  className="portal-button" onClick={handleButtonClick}>
                Patient List
            </button>
          </Link>

        </div>

      </div>

    </div>
      
  );
}

export default ProviderPage;





