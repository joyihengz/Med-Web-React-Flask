import React from 'react';
import './About.css'; // Make sure to create an About.css file for styling
import Navbar from './Navbar.js';
import aboutimage from '../Images/about.png'

const About = () => {
    return (
        <div>
            <Navbar />
            <div className="about-page">

                <h1>About Us</h1>
                <p>
                    Welcome to TCR Med, where we are committed to enhancing your healthcare journey with innovation and security. 
                    Our platform, developed using the latest <span>React.js</span> technology, 
                    offers streamlined access to a range of essential healthcare services. 
                    Central to our mission is the unwavering protection of your personal health information. 
                    Leveraging the advanced capabilities of <span>Auth0</span>, 
                    we implement rigorous identity and access management protocols 
                    to ensure the highest standards of authentication and authorization. 
                    Join us as we redefine your healthcare experience, 
                    prioritizing confidentiality and ease of use in every step of your medical journey.
                </p>
                
            </div>
        </div>
    );
}

export default About;
