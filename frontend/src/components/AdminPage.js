import React from 'react';
import RegistrationButton from "./RegistrationButton.js";
import './UserPage.css'; // Create a CSS file for styling
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import MgmtAppointment from './MgmtAppointment.js';
import MgmtRequest from './MgmtRequest.js';
import Navbar from './Navbar.js';

function AdminPage() {
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
    <div className="user-page">
      <Navbar />
      <h1>Admin Portal</h1>

      <div className="button-container">
        
        <div className="button-column">
          <Link to="/MgmtRequest">
            <button  className="portal-button" onClick={handleButtonClick}>
                Request Management
            </button>
          </Link>



            
        </div>

        <div className="button-column">
          <Link to="/MgmtAppointment">
            <button  className="portal-button" onClick={handleButtonClick}>
                Appointment Management
            </button>
          </Link>
         

        </div>

      </div>

    </div>
      
  );
}
export default AdminPage;