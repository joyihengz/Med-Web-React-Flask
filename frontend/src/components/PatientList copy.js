import Navbar from './Navbar.js';
import './PatientList.css';
import PatientDetail from './PatientDetail.js';

import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function convertExcelDate(date) {
    // Check if 'date' is a number; if so, it's likely an Excel serial date
    if (!isNaN(date)) {
        const utc_days = Math.floor(date - 25569);
        const utc_value = utc_days * 86400;                                        
        return new Date(utc_value * 1000).toLocaleDateString('en-GB');
    }
    // Otherwise, try parsing the date string
    else {
        const [day, month, year] = date.split('-').map(part => parseInt(part, 10));
        const dateObj = new Date(year, month - 1, day);
        return isNaN(dateObj.getTime()) ? 'Date of Birth (DD/MM/YYYY)' : dateObj.toLocaleDateString('en-GB');
    }
}


function ExcelTable() {
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedPatientMRN, setSelectedPatientMRN] = useState(null);


    useEffect(() => {
        const readExcelFile = async () => {
            const response = await fetch('/data.xlsx');
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            jsonData.forEach(row => {
                if(row[3]) {
                    row[3] = convertExcelDate(row[3]);
                }
            });
    
            setColumns(jsonData[0]);
            setData(jsonData.slice(1));
        };
    
        readExcelFile().catch(console.error);
    }, []);
    

    useEffect(() => {
        // Filter by medical record number (1st column), first name (2nd column), or last name (3rd column)
        const filtered = data.filter(row =>
            row[0].toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            row[1].toLowerCase().includes(searchTerm.toLowerCase()) ||
            row[2].toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, data]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    
    const handleRowClick = (mrn) => {
        setSelectedPatientMRN(mrn);
    };

    if (selectedPatientMRN) {
        return <PatientDetail mrn={selectedPatientMRN} />;
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
                            {columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index} onClick={() => handleRowClick(row[0])}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ExcelTable;
