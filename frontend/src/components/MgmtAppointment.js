import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import './MgmtAppointment.css';

const MgmtAppointment = () => {

    const [appointments, setAppointments] = useState([]);

    // Fetch data: Appointments
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/appointments')
        .then(response => response.json())
        .then(data => setAppointments(data));
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Appointment Management</h1>
            <div className="mgmt-appointment">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Datetime</th>
                            <th>Department</th>
                            <th>Provider</th>
                            <th>Status</th>
                            <th>Patient</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(row => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.date} {row.start_time}</td>
                                <td>{row.provider.department}</td>
                                <td>{row.provider.first_name} {row.provider.last_name}</td>
                                <td>
                                    <span className={
                                        row.is_available ? 'status-available' : 'status-booked'
                                    }>
                                        {row.is_available ? 'Available' : 'Booked'}
                                    </span>
                                </td>
                                <td>{row.patient.first_name} {row.patient.last_name}</td>
                                <td>{row.patient.email}</td>
                                <td>{row.patient.phone}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MgmtAppointment;