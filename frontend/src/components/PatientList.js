import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.js';
import './PatientList.css';

function PatientList() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data: Patients
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/patients')
        .then(response => response.json())
        .then(data => setData(data));
    }, []);
    

    useEffect(() => {
        // Filter by medical record number (1st column), first name (2nd column), or last name (3rd column)
        const filtered = data.filter(row =>
            row.id.toString().includes(searchTerm.toLowerCase()) ||
            row.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.last_name.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    return (
        <div>
            <Navbar/>
            <div className="excel-table-container">
                <input 
                    type="text" 
                    className="search-input"
                    placeholder="Search by Medical Record Number, First Name, or Last Name" 
                    value={searchTerm} 
                    onChange={handleSearchChange} 
                />
                <table className="table">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Active Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(row => (
                            <tr key={row.id}>
                                <td>{row.first_name}</td>
                                <td>{row.last_name}</td>
                                <td>{row.dob}</td>
                                <td>{row.gender}</td>
                                <td>{row.email}</td>
                                <td>{row.phone}</td>
                                <td>{row.is_active ? 'Activated' : 'Deactivated'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PatientList;
