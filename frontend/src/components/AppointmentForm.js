import React, { useEffect, useState } from 'react';
import './AppointmentForm.css';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import emailjs from "@emailjs/browser";
import Alert from '@mui/material/Alert';

const AppointmentForm = () => {
  // State variables for form inputs
  const [formData, setFormData] = useState({
    patientId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    doctor: '',
    appointment: '', // preferredTime
    auth0Id: '',
  });

  // Fetch Auth0 data: user profile (auth0Id)
  const { user, isAuthenticated } = useAuth0();
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(user)
      setFormData({ ...formData, auth0Id: user.sub });
    }
  }, [isAuthenticated, user]);

  // Fetch patient data using auth0Id
  useEffect(() => {
    const fetchPatientData = async () => {
      if (formData.auth0Id) {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/patients/${formData.auth0Id}`);
          if (response.ok) {
            const data = await response.json();
            // Update form data with patient information
            setFormData(formData => ({
              ...formData,
              patientId: data.id,
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              phone: data.phone,
            }));
          } else {
            console.error("Patient data not found or error fetching data");
          }
        } catch (error) {
          console.error("Error fetching patient data:", error);
        }
      }
    };
    fetchPatientData();
  }, [formData.auth0Id]); // Dependency on formData.auth0Id ensures this runs when auth0Id is set


  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Fetch data: departments, doctors, appointments
  useEffect(() => {

    // Departments
    fetch('http://127.0.0.1:5000/api/departments')
    .then(response => response.json())
    .then(data => setDepartments(data));

    // Doctors
    fetch('http://127.0.0.1:5000/api/providers')
    .then(response => response.json())
    .then(data => setDoctors(data));

    // Appointments
    fetch('http://127.0.0.1:5000/api/appointments/available')
    .then(response => response.json())
    .then(data => setAppointments(data));

  }, []);

  const handleChange = (e) => {
    
    if (e.target.name === 'department') {
      setFormData({ ...formData, department: e.target.value, doctor:'', appointment:'' });
      const filteredDocs = doctors.filter(doc => doc.department.id == e.target.value);
      setFilteredDoctors(filteredDocs);
      setFilteredAppointments([]);
    } else if (e.target.name === 'doctor') {
      setFormData({ ...formData, doctor: e.target.value, appointment:'' });
      const filteredAppts = appointments.filter(appt => appt.provider.id == e.target.value);
      setFilteredAppointments(filteredAppts);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log(formData);


    // Send the form data to the Flask API
    fetch(`http://127.0.0.1:5000/api/appointments/${formData.appointment}/book`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: formData.patientId,
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to book the appointment');
      }
      return response.json(); // Parse JSON response if successful
    })
    .then(data => {
      console.log("Appointment booked successfully", data);
    })
    .catch (error => {
      console.error("Error booking appointment:", error);
    });




    // Prepare Email Detail
    const selectedDepartment = departments.find(dept => dept.id == formData.department);
    const departmentName = selectedDepartment.name;
    const selectedDoctor = filteredDoctors.find(doc => doc.id == formData.doctor);
    const doctorFullName = `${selectedDoctor.first_name} ${selectedDoctor.last_name}`;
    const selectedAppointment = filteredAppointments.find(appt => appt.id == formData.appointment);
    const appointmentFullTime = `${selectedAppointment.date} ${selectedAppointment.start_time}`;

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
      email: formData.email,
      phone: formData.phone,
      department: departmentName,
      doctor: doctorFullName,
      appointment: appointmentFullTime,
    };

    console.log(templateParams);

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setAlertType("success");
        setAlertMessage("Appointment Scheduled Successfully!");
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

        <form className="appointment-form" onSubmit={handleSubmit}>
            <h2>Schedule an Appointment</h2>

            <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                readOnly
            />

            <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                readOnly
            />
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
                readOnly
            />
            <select 
              name="department" 
              value={formData.department} 
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a Department
              </option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <select 
              name="doctor" 
              value={formData.doctor} 
              onChange={handleChange} 
              disabled={!formData.department}
              required
            >
              <option value="" disabled>
                Select a Doctor
              </option>
              {filteredDoctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.first_name} {doc.last_name}, {doc.degree}
                </option>
              ))}
            </select>
            <select 
              name="appointment" 
              value={formData.appointment} 
              onChange={handleChange} 
              disabled={!formData.doctor}
              required
            >
              <option value="" disabled>
                Select a Preferred Date and Time
              </option>
              {filteredAppointments.map(appt => (
                <option key={appt.id} value={appt.id}>
                  {appt.date} {appt.start_time}
                </option>
              ))}
            </select>

            <button type="submit">Submit</button>
        </form>
    </div>
  );
};

export default AppointmentForm;