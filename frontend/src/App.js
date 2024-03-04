//import logo from './logo.svg';
import React from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useState } from "react";

import Navbar from './components/Navbar.js';
import About from './components/About.js';
import Services from './components/Services.js';

import Homepage from './components/Homepage.js';
import VisitorPage from './components/VisitorPage.js';
import UserPage from './components/UserPage.js'
import PatientPage from './components/PatientPage.js'
import ProviderPage from './components/ProviderPage.js'

import ProviderInformation from './components/ProviderInformation.js'
import PatientAccess from './components/PatientAccess.js'
import AppointmentForm from './components/AppointmentForm.js'
import PatientList from './components/PatientList.js'
import PatientProfile from './components/PatientProfile.js'

import MgmtRequest from './components/MgmtRequest.js'

import './App.css';

import {BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom';

import { Auth0Provider } from "@auth0/auth0-react";
const config = require('./components/config.js');

function App() {

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
          //console.log(data);
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
  let multiple;

  if (isAuthenticated){
    if (userRoles.length === 0) {
      registeredUser = 1; 
    } else if (userRoles.length === 1) {
      if (userRoles[0].toLowerCase().includes("provider")) {
        provider = 1;
      } 
      if (userRoles[0].toLowerCase().includes("patient")) {
        patient = 1
      }   
    } else {
      multiple = 1
    }
  }

  const handleLoginClick = () => {
    loginWithRedirect();
  }


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<Homepage />} />
          <Route path="/About" element={<About />} />
          <Route path="/Services" element={<Services />} />

          <Route path="/VisitorPage" element={<VisitorPage />} />
          <Route path="/UserPage" element={<UserPage />}/>
          <Route path="/PatientPage" element={<PatientPage />}/>
          <Route path="/ProviderPage" element={<ProviderPage />}/>

          <Route path="/ProviderInformation" element={<ProviderInformation />} />
          <Route path="/PatientAccess" element={<PatientAccess />}/>
          <Route path="/AppointmentForm" element={<AppointmentForm />}/>
          <Route path="/PatientList" element={<PatientList />}/>
          <Route path="/PatientProfile" element={<PatientProfile />}/>

          <Route path="/MgmtRequest" element={<MgmtRequest />}/>
          
        </Routes>
      </div>
    </BrowserRouter>

  );
}
export default App;

