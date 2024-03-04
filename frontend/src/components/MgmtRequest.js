import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import MgmtRequestPopup from "./MgmtRequestPopup";
import './MgmtRequest.css';

const MgmtRequest = () => {

    function getCurrentDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // getMonth() is zero-based
        const day = now.getDate();
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    

    const [accessRequests, setAccessRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Fetch data: AccessRequests
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/accessrequests')
        .then(response => response.json())
        .then(data => setAccessRequests(data));
    }, []);

    
    const handleOpenPopup = (request) => {
        setSelectedRequest(request);
    };

    const handleClosePopup = () => {
        setSelectedRequest(null);
    };

    const handleApprove = async (request) => {
        try {
            // console.log(request.id)
            // Update status to 'Approved' in the backend
            const response = await fetch(`http://127.0.0.1:5000/api/accessrequests/${request.id}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Update the request status in the local state
                setAccessRequests(accessRequests.map(req => req.id === request.id ? {...req, status: 'Approved', solved_at: getCurrentDate()} : req));

                // Close the popup
                setSelectedRequest(null);
            } else {
                // Handle non-OK responses here
                console.error('Failed to approve request');
            }

        } catch (error) {
            // Handle any errors that occurred during fetch
            console.error('Error during fetch: ', error);
        }

    };

    const handleDisapprove = async (request) => {
        // Implement disapproval logic
        try {
            // Update status to 'Disapproved' in the backend
            const response = await fetch(`http://127.0.0.1:5000/api/accessrequests/${request.id}/disapprove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Update the request status in the local state
                setAccessRequests(accessRequests.map(req => req.id === request.id ? {...req, status: 'Disapproved', solved_at: getCurrentDate()} : req));

                // Close the popup
                setSelectedRequest(null);
            } else {
                // Handle non-OK responses here
                console.error('Failed to disapprove request');
            }

        } catch (error) {
            // Handle any errors that occurred during fetch
            console.error('Error during fetch: ', error);
        }

    };

    return (
        <div>
            <Navbar />
            <h1>Request Management</h1>
            <div className="mgmt-request">
                

                
                    <table className="table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Request Type</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accessRequests.map(row => (
                                <tr key={row.id}>
                                    <td>{row.first_name}</td>
                                    <td>{row.last_name}</td>
                                    <td>{row.request_type}</td>
                                    <td>{row.created_at}</td>
                                    <td>
                                        <span className={
                                            row.status === 'Pending' ? 'status-pending' :
                                            row.status === 'Disapproved' ? 'status-disapproved' :
                                            row.status === 'Approved' ? 'status-approved' : ''
                                        }>
                                            {row.status}
                                        </span>    
                                    </td>
                                    <td>
                                        {row.status === 'Pending' ?
                                            <button onClick={() => handleOpenPopup(row)}>Edit Request</button> :
                                            <button onClick={() => handleOpenPopup(row)}>View Only</button>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                
            </div>

            {selectedRequest && (
                <MgmtRequestPopup
                    request={selectedRequest}
                    onClose={handleClosePopup}
                    onApprove={handleApprove}
                    onDisapprove={handleDisapprove}
                />
            )}
        </div>
    );


};

export default MgmtRequest;