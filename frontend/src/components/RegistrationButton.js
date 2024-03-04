import React from 'react';
import './VisitorPage.css'; // Create a CSS file for styling
import { useAuth0 } from '@auth0/auth0-react';

const RegistrationButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (
            <button className="portal-button" onClick={() => loginWithRedirect()}>
                User Registration
            </button>
        )
    )
}

export default RegistrationButton