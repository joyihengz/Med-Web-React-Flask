import React, { useEffect, useState } from 'react';
import './PatientAccess.css';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import emailjs from "@emailjs/browser";
import Alert from '@mui/material/Alert';

const PatientAccess = () => {
  // State variables for form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    request: '',
    auth0_id: '',
  });

  // Fetch Auth0 data: user profile (email & auth0_id)
  const { user, isAuthenticated } = useAuth0();
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(user)
      setFormData({ ...formData, email: user.email, auth0_id: user.sub });
    }
  }, [isAuthenticated, user]);

  // State variables for submission alert
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log(formData);


    // Send the form data to the Flask API
    fetch('http://127.0.0.1:5000/api/accessrequests/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setAlertType("success");
      setAlertMessage("Access request submitted successfully");
    })
    .catch((error) => {
      console.error('Error:', error);
      setAlertType("error");
      setAlertMessage("An error occurred while submitting the access request");
    });


    //

    // EmailJS Logic

    // Your EmailJS service ID, template ID, and Public Key
    const serviceId = '';
    const templateId = '';
    const publicKey = '';

    // Create a new object that contains dynamic template params
    const templateParams = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      request: formData.request,
    };

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setAlertType("success");
        setAlertMessage("Form Submitted Successfully!");
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setAlertType("error");
        setAlertMessage("Unknown Error: Please Submit Again.");
      });

    //
  };

  return (
    <div>
        <Navbar />

        {alertType && (
          <Alert severity={alertType}>
              {alertMessage}
          </Alert>
        )}

        <form className="access-form" onSubmit={handleSubmit}>
            <h2>Patient Access Request Form</h2>
            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="dob"
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={formData.dob}
                onChange={handleChange}
                required
            />
            <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                required
            >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Prefer not to say</option>
            </select>

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                readOnly
            />
            <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
            />

            <select 
                name="request" 
                value={formData.request} 
                onChange={handleChange}
                required
            >
                <option value="">Select Request Type</option>
                <option value="Activate">Activate Patient Access</option>
                <option value="Deactivate">Deactivate Patient Access</option>
            </select>



            <button type="submit">Submit</button>
        </form>
    </div>
  );
};

export default PatientAccess;