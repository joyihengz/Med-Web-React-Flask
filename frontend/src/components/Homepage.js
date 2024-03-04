import React from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from 'react-router-dom'; 

import './Homepage.css';
import Navbar from './Navbar';
import VisitorPage from './VisitorPage.js';
import UserPage from './UserPage.js';
import PatientPage from './PatientPage.js';
import ProviderPage from './ProviderPage.js';
import AdminPage from './AdminPage.js';

import Alert from '@mui/material/Alert';


function HomePage() {

  const handleNavigation = (path) => {
    localStorage.setItem("userRoles", userRoles);
    window.location.href = path;
  };

  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // go to the auth0 dashboard, application and find api test.
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append(
        "Authorization",
        "Bearer "
        );

      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const user_id = user ? user["sub"] : " ";
      const url = `https://.../api/v2/users/${user_id}/roles`;

      fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const roleNames = data.map(role => role.name);
          setUserRoles(roleNames);
        })
        .catch(error => console.log("Error fetching user roles:", error));
    }
  }, [isAuthenticated, user]);

  //console.log(userRoles);
  
  let registeredUser;
  let patient;
  let provider;
  let admin;
  let multiple;

  if (isAuthenticated){
    if (userRoles.length === 0) {
      registeredUser = 1; 
    } else if (userRoles.length === 1) {
      if (userRoles[0].toLowerCase().includes("provider")) {
        provider = 1;
      } 
      if (userRoles[0].toLowerCase().includes("patient")) {
        patient = 1;
      }
      if (userRoles[0].toLowerCase().includes("admin")) {
        admin = 1;
      }  
    } else {
      multiple = 1;
      console.log(userRoles);

      for (let i=0; i<userRoles.length; i++) {
        if (userRoles[i].toLowerCase().includes("provider")) {
          provider = 1;
        } 
        if (userRoles[i].toLowerCase().includes("patient")) {
          patient = 1;
        }
        if (userRoles[i].toLowerCase().includes("admin")) {
          admin = 1;
        }  
      }
    }
  }

  const handleLoginClick = () => {
    loginWithRedirect();
  }


  return (
    <div>
      
        {!isAuthenticated && (
          <div className="homepage">
            <Navbar />
            
            <div className="homepage-container">

              <div className="homepage-column">
                <h1>At TCR Med, YOUR health is OUR priority!</h1>
                <div>
                  <button  className="homepage-button" onClick={() => handleNavigation("/About")}>
                      About Us
                  </button>                 
                  <button  className="homepage-button" onClick={() => handleNavigation("/ProviderInformation")}>
                        Learn More
                  </button>              
                </div>
              </div>

              <div className="homepage-column">
                <img src={require('../Images/homepage.gif')} />
              </div>

            </div>
          </div>
        )}

        {registeredUser && (
            <UserPage />           
        )}

        {(!multiple && patient) && (
            <PatientPage />           
        )}
        
        {(!multiple && provider) && (
            <ProviderPage />           
        )}

        {(!multiple && admin) && (
            <AdminPage />           
        )}


        {multiple && (
          <div className="multi-page">
            <Navbar />

            <Alert severity="warning">
              Use separate accounts for professional and personal purposes.
            </Alert>

            <div className="button-container">
        
              {provider && (
                <div className="button-column"> 
                  <button  className="portal-button" onClick={() => handleNavigation("/ProviderPage")}>
                      Provider Portal
                  </button>
                </div>
              )}
                   

              {patient && (
                <div className="button-column">    
                  <button  className="portal-button" onClick={() => handleNavigation("/PatientPage")}>
                    Patient Portal
                  </button>
                </div>
              )}

              {admin && (
                <div className="button-column">    
                  <button  className="portal-button" onClick={() => handleNavigation("/AdminPage")}>
                    Admin Portal
                  </button>
                </div>
              )}              

            </div>


          </div>           
        )}

    </div>
  );
}

export default HomePage;
