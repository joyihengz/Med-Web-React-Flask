import Navbar from './Navbar.js';
import './PatientDetail.css';

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

function PatientDetail({ mrn }) {

    const [patientColumns, setPatientColumns] = useState([]);
    const [patientData, setPatientData] = useState([]);

    const [visitColumns, setvisitColumns] = useState([]);
    const [visitData, setVisitData] = useState([]);

    // A Single-Row Table showing the selected patient's information.
    useEffect(() => {
        const readPatientData = async () => {
            const response = await fetch('/data.xlsx');
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });

            // Assuming the patient data is in the first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            jsonData.forEach(row => {
                if(row[3]) {
                    row[3] = convertExcelDate(row[3]);
                }
            });
            setPatientColumns(jsonData[0]);

            // Filter the patient data based on the MRN
            const filteredPatient = jsonData.filter(row => row[0] === mrn);
            setPatientData(filteredPatient);

        };

        readPatientData().catch(console.error);
    }, [mrn]);

    // A Multi-Row Table below it showing the visit-level details for that patient.
    useEffect(() => {
        const readVisitData = async () => {
            const response = await fetch('/data.xlsx');
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });

            // Assuming the visit data is in the second sheet
            const sheetName = workbook.SheetNames[1];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            jsonData.forEach(row => {
                if(row[3]) {
                    row[3] = convertExcelDate(row[3]);
                }
            });
            setvisitColumns(jsonData[0]);

            // Filter the visit data based on the MRN
            const filteredVisits = jsonData.filter(row => row[1] === mrn);
            setVisitData(filteredVisits);

        };

        readVisitData().catch(console.error);
    }, [mrn]);

    return (
        <div>
            <Navbar/>
            <h1>Patient Detail: {mrn}</h1>

            <div className="excel-table-container">
                <h2>Patient Information</h2>
                <table className="table">
                    <thead>
                        <tr>
                            {patientColumns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {patientData.map((row, index) => (
                            <tr key={index}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            
            <div className="excel-table-container">
                <h2>Visit Information</h2>
                <table className="table">
                    <thead>
                        <tr>
                            {visitColumns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {visitData.map((row, index) => (
                            <tr key={index}>
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
export default PatientDetail;