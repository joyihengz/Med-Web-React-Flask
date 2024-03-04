import React from 'react';
import './PatientProfile.css';
import Navbar from './Navbar';

const PatientProfile = () => {
  const patientInfo = {
    image: require("../Images/medical-team.png"), // Replace with actual image path
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    address: 'Street, City, State, Zip',
    mobilePhone: '123-456-7890',
    homePhone: '098-765-4321',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    language: 'English',
    weight: '70 kg',
    height: '180 cm',
    allergies: 'None'
  };

  const appointments = [
    { date: '2024-01-25', time: '10:00 AM', department: 'Cardiology', doctor: 'Dr. Smith', bookedAt: '2024-01-10', status: 'Confirmed' },
    { date: '2024-02-15', time: '02:00 PM', department: 'Neurology', doctor: 'Dr. Johnson', bookedAt: '2024-02-01', status: 'Pending' },
    { date: '2024-03-20', time: '11:30 AM', department: 'Orthopedics', doctor: 'Dr. Williams', bookedAt: '2024-03-05', status: 'Confirmed' },
    { date: '2024-04-10', time: '09:00 AM', department: 'Dermatology', doctor: 'Dr. Brown', bookedAt: '2024-03-25', status: 'Cancelled' },
    { date: '2024-05-05', time: '01:45 PM', department: 'Pediatrics', doctor: 'Dr. Davis', bookedAt: '2024-04-20', status: 'Confirmed' }
  ];
  

  const medications = [
    { name: 'Medication 1', dosage: '20mg', frequency: '2 times a day', instructions: 'After meals' },
    { name: 'Medication 2', dosage: '10mg', frequency: 'Once a day', instructions: 'Before bedtime' },
    { name: 'Medication 3', dosage: '5mg', frequency: '3 times a day', instructions: 'With food' }
  ];
  

  const files = [
    { name: 'Lab Report.pdf', link: '#', dateUploaded: '2024-01-20' },
    { name: 'X-Ray Image.jpg', link: '#', dateUploaded: '2024-02-15' },
    { name: 'Prescription.pdf', link: '#', dateUploaded: '2024-03-10' },
    { name: 'Medical History.docx', link: '#', dateUploaded: '2024-04-05' }
  ];
  

  return (
    <div>
        <Navbar/>
        <h1>{patientInfo.fullName}</h1>
        <div className="patient-profile">
            
            {/* Patient information boxes */}
            <div className="section">
                <div className="box">
                    <div className='overview-column'>
                        <img src={patientInfo.image} alt={patientInfo.fullName} />
                    </div>
                    <div className='overview-column'>
                        <p>Email: {patientInfo.email}</p>
                        <p>Address: {patientInfo.address}</p>
                        <p>Mobile Phone: {patientInfo.mobilePhone}</p>
                    </div>
                </div>
                <div className="box">
                    <div className='overview-column'>
                        <p>Gender: {patientInfo.gender}</p>
                        <p>Date of Birth: {patientInfo.dateOfBirth}</p>
                        <p>Language: {patientInfo.language}</p>
                    </div>
                    <div className='overview-column'>
                        <p>Weight: {patientInfo.weight}</p>
                        <p>Height: {patientInfo.height}</p>
                        <p>Allergies: {patientInfo.allergies}</p>
                    </div>
                </div>
            </div>
            
            {/* Appointments table */}
            <h2 className="section-header">Appointments</h2>
            <div className="section">
                
                <table className="table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Department</th>
                        <th>Doctor</th>
                        <th>Booked At</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.map((appointment, index) => (
                        <tr key={index}>
                        <td>{appointment.date}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.department}</td>
                        <td>{appointment.doctor}</td>
                        <td>{appointment.bookedAt}</td>
                        <td>{appointment.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Medications section */}
            <h2 className="section-header">Medications</h2>
            <div className="section">
                
                <table className="table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Instructions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {medications.map((medication, index) => (
                        <tr key={index}>
                        <td>{medication.name}</td>
                        <td>{medication.dosage}</td>
                        <td>{medication.frequency}</td>
                        <td>{medication.instructions}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Files/Documents section */}
            <h2 className="section-header">Files/Documents</h2>
            <div className="section">
                
                
                    {files.map((file, index) => (
                    <div className="box" key={index}>
                        <a href={file.link} className="file-link" target="_blank" rel="noopener noreferrer">{file.name}</a>
                        <p>Date Uploaded: {file.dateUploaded}</p>
                    </div>
                    ))}
                
            </div>


        </div>
    </div>
  );
};

export default PatientProfile;
