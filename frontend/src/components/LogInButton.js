import React from 'react';
import './LogInButton.css'; // Create a CSS file for styling
import { useAuth0 } from '@auth0/auth0-react';

const LogInButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (
            <button className="login-button" onClick={() => loginWithRedirect()}>

                Log In / Sign Up
                
            </button>
        )
    )
}

export default LogInButton