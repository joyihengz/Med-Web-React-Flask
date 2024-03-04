import React from 'react';
import './MgmtRequestPopup.css'; 

const MgmtRequestPopup = ({ request, onClose, onApprove, onDisapprove }) => {
    return (
        <div className="popup">
            <div className="popup-content">
                <div className="popup-header">
                    <h2>Request Details</h2>
                    <button className='close-button' onClick={onClose}>x</button>
                </div>
                
                {/* Map through request details and display them */}
                <p><strong>Request ID:</strong> {request.id}</p>
                <p><strong>First Name:</strong> {request.first_name}</p>
                <p><strong>Last Name:</strong> {request.last_name}</p>
                {/* ... include other details ... */}
                <p><strong>Date of Birth:</strong> {request.dob}</p>
                <p><strong>Gender:</strong> {request.gender}</p>
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Phone:</strong> {request.phone}</p>
                <p><strong>Request Type:</strong> {request.request_type}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Auth0 ID:</strong> {request.auth0_id}</p>
                <p><strong>Created At:</strong> {request.created_at}</p>
                <p><strong>Solved At:</strong> {request.solved_at}</p>
                
                {/* Conditionally render buttons for 'Pending' status */}
                {request.status === 'Pending' && (
                    <div className='popup-decision'>
                        <button className="approve-button" onClick={() => onApprove(request)}>Approve</button>
                        <button className='disapprove-button' onClick={() => onDisapprove(request)}>Disapprove</button>
                    </div>
                )}

                
            </div>
        </div>
    );
};

export default MgmtRequestPopup;
